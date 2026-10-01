import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Db, Sql, TransactionSql } from "@/lib/db/client";
import {
  cleanupFixtures,
  connectTestDb,
  createCatalog,
  createPayment,
  createResult,
  createUser,
  getPrice,
  unlockResult,
  type CatalogFixture,
  type PriceRow,
} from "./fixtures";

/**
 * Database-level payment integrity: what an unlock may point at, what a payment may never change, how a payment is
 * born, how a captured duplicate is recorded, and the records that hang off a payment. The application is the primary
 * gate; these tests pin the invariants the schema enforces on its own.
 */

const check = (constraint: string) => ({ code: "23514", constraint_name: constraint });
const unique = (constraint: string) => ({ code: "23505", constraint_name: constraint });

let sql: Sql;
let catalog: CatalogFixture;

beforeAll(async () => {
  sql = connectTestDb();
  catalog = await createCatalog(sql);
});

afterAll(async () => {
  await cleanupFixtures(sql);
  await sql.end();
});

/** Runs `fn` in a transaction that is always rolled back; returns what `fn` returned. */
async function rolledBack<T>(fn: (tx: TransactionSql) => Promise<T>): Promise<T> {
  const marker = { value: undefined as T };
  await sql
    .begin(async (tx) => {
      marker.value = await fn(tx as unknown as TransactionSql);
      throw marker;
    })
    .catch((error: unknown) => {
      if (error !== marker) throw error;
    });
  return marker.value;
}

async function insertPayment(
  db: Db,
  price: PriceRow,
  opts: { userId: string; targetType: string; targetId: string | null; status?: string; provider?: string },
) {
  const [row] = await db<{ id: string }[]>`
    insert into public.payments (user_id, product_id, price_id, target_type, target_id, amount_minor, currency,
                                 provider, status, idempotency_key)
    values (${opts.userId}, ${price.productId}, ${price.priceId}, ${opts.targetType}, ${opts.targetId},
            ${price.amountMinor}, ${price.currency}, ${opts.provider ?? "click"}, ${opts.status ?? "created"},
            ${`idem-${randomUUID()}`})
    returning id`;
  return row!.id;
}

async function userWithResult() {
  const userId = await createUser(sql);
  const { resultId, sessionId } = await createResult(sql, { userId, catalog });
  return { userId, resultId, sessionId };
}

describe("payment-sourced unlocks", () => {
  it("are only backed by a PAID payment", async () => {
    const b = await userWithResult();
    const created = await createPayment(sql, { userId: b.userId, targetId: b.resultId, provider: "click" });
    await expect(unlockResult(sql, { userId: b.userId, resultId: b.resultId, paymentId: created })).rejects.toMatchObject(
      check("result_unlocks_payment_valid"),
    );
    const failed = await createPayment(sql, { userId: b.userId, targetId: b.resultId, provider: "payme", status: "failed" });
    await expect(unlockResult(sql, { userId: b.userId, resultId: b.resultId, paymentId: failed })).rejects.toMatchObject(
      check("result_unlocks_payment_valid"),
    );
  });

  it("must match the payment's payer, target result and product entitlement, once per payment", async () => {
    const a = await userWithResult();
    const b = await userWithResult();
    const paid = await createPayment(sql, { userId: b.userId, targetId: b.resultId, status: "paid" });

    // B's payment cannot unlock A's result, nor a deep unlock (full_report entitles a full unlock only).
    await expect(unlockResult(sql, { userId: a.userId, resultId: a.resultId, paymentId: paid })).rejects.toMatchObject(
      check("result_unlocks_payment_valid"),
    );
    await expect(
      unlockResult(sql, { userId: b.userId, resultId: b.resultId, paymentId: paid, unlockType: "deep" }),
    ).rejects.toMatchObject(check("result_unlocks_payment_valid"));

    await unlockResult(sql, { userId: b.userId, resultId: b.resultId, paymentId: paid });
    const { resultId: secondResult } = await createResult(sql, { userId: b.userId, catalog });
    await expect(unlockResult(sql, { userId: b.userId, resultId: secondResult, paymentId: paid })).rejects.toMatchObject(
      unique("result_unlocks_payment_id_key"),
    );
  });

  it("are removed together with the refund, never separately", async () => {
    const b = await userWithResult();
    const paid = await createPayment(sql, { userId: b.userId, targetId: b.resultId, status: "paid" });
    await unlockResult(sql, { userId: b.userId, resultId: b.resultId, paymentId: paid });

    await expect(sql`update public.payments set status = 'refunded' where id = ${paid}`).rejects.toMatchObject(
      check("result_unlocks_payment_paid"),
    );
    await expect(sql`delete from public.result_unlocks where payment_id = ${paid}`).rejects.toMatchObject(
      check("result_unlocks_paid_requires_unlock"),
    );

    await sql.begin(async (tx) => {
      await tx`update public.payments set status = 'refunded' where id = ${paid}`;
      await tx`delete from public.result_unlocks where payment_id = ${paid}`;
    });
    const [row] = await sql<{ status: string; unlocks: number }[]>`
      select p.status, (select count(*)::int from public.result_unlocks u where u.payment_id = p.id) as unlocks
        from public.payments p where p.id = ${paid}`;
    expect(row).toEqual({ status: "refunded", unlocks: 0 });
  });
});

describe("payment immutability", () => {
  it("freezes target, provider and idempotency key; provider_payment_id is write-once", async () => {
    const a = await userWithResult();
    const b = await userWithResult();
    const paid = await createPayment(sql, { userId: a.userId, targetId: a.resultId, provider: "click", status: "paid" });
    const identity = check("payments_identity_immutable");
    await expect(sql`update public.payments set target_id = ${b.resultId} where id = ${paid}`).rejects.toMatchObject(identity);
    await expect(sql`update public.payments set target_type = 'verification_task' where id = ${paid}`).rejects.toMatchObject(identity);
    await expect(sql`update public.payments set provider = 'payme' where id = ${paid}`).rejects.toMatchObject(identity);
    await expect(sql`update public.payments set idempotency_key = 'rewritten-key' where id = ${paid}`).rejects.toMatchObject(identity);

    await sql`update public.payments set provider_payment_id = ${`click-${paid}`} where id = ${paid}`;
    await sql`update public.payments set provider_payment_id = ${`click-${paid}`} where id = ${paid}`; // same value: replay
    await expect(sql`update public.payments set provider_payment_id = 'other' where id = ${paid}`).rejects.toMatchObject(
      check("payments_provider_payment_id_immutable"),
    );
  });

  it("moves to another user only when that user absorbed the payer in a merge", async () => {
    const anon = await userWithResult();
    const target = await createUser(sql);
    const paid = await createPayment(sql, { userId: anon.userId, targetId: anon.resultId, status: "paid" });
    await unlockResult(sql, { userId: anon.userId, resultId: anon.resultId, paymentId: paid });

    await expect(sql`update public.payments set user_id = ${target} where id = ${paid}`).rejects.toMatchObject(
      check("payments_user_merge_only"),
    );

    // The merge transaction (any order): mark the anon user merged, re-point the session (result, unlock follow) and
    // the payment.
    await sql.begin(async (tx) => {
      await tx`update public.payments set user_id = ${target} where user_id = ${anon.userId}`;
      await tx`update public.assessment_sessions set user_id = ${target} where user_id = ${anon.userId}`;
      await tx`update public.users set merged_into_user_id = ${target} where id = ${anon.userId}`;
    });
    const [row] = await sql<{ payer: string; owner: string; unlockOwner: string }[]>`
      select p.user_id as payer, r.user_id as owner, u.user_id as unlock_owner
        from public.payments p
        join public.assessment_results r on r.id = p.target_id
        join public.result_unlocks u on u.payment_id = p.id
       where p.id = ${paid}`;
    expect(row).toEqual({ payer: target, owner: target, unlockOwner: target });
  });

  it("validates the target kind, existence and owner at creation", async () => {
    const a = await userWithResult();
    const b = await userWithResult();
    const fullReport = await getPrice(sql, "full_report");
    await expect(
      insertPayment(sql, fullReport, { userId: a.userId, targetType: "verification_task", targetId: randomUUID() }),
    ).rejects.toMatchObject(check("payments_target_type"));
    await expect(
      insertPayment(sql, fullReport, { userId: a.userId, targetType: "assessment_result", targetId: randomUUID() }),
    ).rejects.toMatchObject(check("payments_target_valid"));
    await expect(
      insertPayment(sql, fullReport, { userId: a.userId, targetType: "assessment_result", targetId: b.resultId }),
    ).rejects.toMatchObject(check("payments_target_valid"));
  });
});

describe("payment creation", () => {
  it("starts every payment as created or pending", async () => {
    const a = await userWithResult();
    const price = await getPrice(sql, "full_report");
    for (const status of ["paid", "refunded", "failed"]) {
      await expect(
        insertPayment(sql, price, { userId: a.userId, targetType: "assessment_result", targetId: a.resultId, status }),
      ).rejects.toMatchObject(check("payments_initial_status"));
    }
  });

  it("refuses inactive or out-of-window prices and inactive products", async () => {
    const a = await userWithResult();
    const pay = (price: PriceRow, provider = "click") =>
      insertPayment(sql, price, { userId: a.userId, targetType: "assessment_result", targetId: a.resultId, provider });

    // Seeded XTR placeholder price is inactive; deep_report has an active price but the product is not launched.
    await expect(pay(await getPrice(sql, "full_report", "XTR"), "telegram_stars")).rejects.toMatchObject(
      check("payments_price_active"),
    );
    await expect(pay(await getPrice(sql, "deep_report"))).rejects.toMatchObject(check("payments_product_active"));

    const windows = [
      { from: "2020-01-01T00:00:00Z", to: "2020-02-01T00:00:00Z" }, // expired
      { from: "2099-01-01T00:00:00Z", to: null }, // not yet valid
    ];
    const active = await getPrice(sql, "full_report");
    const outcomes = await rolledBack(async (tx) => {
      const errors: unknown[] = [];
      for (const w of windows) {
        const [row] = await tx<{ id: string }[]>`
          insert into public.prices (product_id, currency, amount_minor, valid_from, valid_to, experiment_variant)
          values (${active.productId}, 'UZS', ${active.amountMinor}, ${w.from}, ${w.to}, 'window_test')
          returning id`;
        const windowed = { ...active, priceId: row!.id };
        const target = { userId: a.userId, targetType: "assessment_result", targetId: a.resultId };
        const error = await tx
          .savepoint((sp: TransactionSql) => insertPayment(sp, windowed, target))
          .then(() => null, (e: unknown) => e);
        errors.push(error);
      }
      return errors;
    });
    expect(outcomes).toHaveLength(2);
    for (const outcome of outcomes) expect(outcome).toMatchObject(check("payments_price_active"));
  });
});

describe("duplicates and open payments", () => {
  it("records a captured duplicate as paid -> refunded without a second PAID or an unlock", async () => {
    const a = await userWithResult();
    const click = await createPayment(sql, { userId: a.userId, targetId: a.resultId, provider: "click", status: "pending" });
    const payme = await createPayment(sql, { userId: a.userId, targetId: a.resultId, provider: "payme", status: "pending" });
    await sql`update public.payments set status = 'paid' where id = ${click}`;
    await expect(sql`update public.payments set status = 'paid' where id = ${payme}`).rejects.toMatchObject(
      unique("payments_one_paid_per_target"),
    );

    // Marking an unrelated payment as the original is refused.
    const b = await userWithResult();
    const other = await createPayment(sql, { userId: b.userId, targetId: b.resultId, status: "paid" });
    await expect(
      sql`update public.payments set status = 'paid', duplicate_of_payment_id = ${other} where id = ${payme}`,
    ).rejects.toMatchObject(check("payments_duplicate_capture"));

    await sql`update public.payments set status = 'paid', duplicate_of_payment_id = ${click} where id = ${payme}`;
    await expect(unlockResult(sql, { userId: a.userId, resultId: a.resultId, paymentId: payme })).rejects.toMatchObject(
      check("result_unlocks_payment_valid"),
    );
    await sql`update public.payments set status = 'refunded' where id = ${payme}`;
    await expect(
      sql`update public.payments set duplicate_of_payment_id = null where id = ${payme}`,
    ).rejects.toMatchObject(check("payments_duplicate_capture"));
    // The original stays the single PAID payment and can still unlock the result.
    await unlockResult(sql, { userId: a.userId, resultId: a.resultId, paymentId: click });
    // A PAID payment cannot be re-labelled a duplicate after the fact.
    await expect(
      sql`update public.payments set duplicate_of_payment_id = ${payme} where id = ${click}`,
    ).rejects.toMatchObject(check("payments_duplicate_capture"));
  });

  it("allows one open target-less payment per (user, product, provider)", async () => {
    const userId = await createUser(sql);
    const outcome = await rolledBack(async (tx) => {
      await tx`update public.products set is_active = true where slug = 'verification_attempt'`;
      const price = await getPrice(tx, "verification_attempt");
      await insertPayment(tx, price, { userId, targetType: "none", targetId: null, status: "pending" });
      const second = await tx
        .savepoint((sp: TransactionSql) => insertPayment(sp, price, { userId, targetType: "none", targetId: null }))
        .then(() => null, (error: unknown) => error);
      const otherProvider = await insertPayment(tx, price, { userId, targetType: "none", targetId: null, provider: "payme" });
      return { second, otherProvider };
    });
    expect(outcome.second).toMatchObject(unique("payments_one_open_per_target_provider"));
    expect(outcome.otherProvider).toBeTypeOf("string");
  });
});

describe("payment-adjacent records", () => {
  it("provider transactions carry the payment's provider and exact amount", async () => {
    const a = await userWithResult();
    const paymentId = await createPayment(sql, { userId: a.userId, targetId: a.resultId, provider: "payme" });
    const insert = (provider: string, amount: number) => sql`
      insert into public.provider_transactions (payment_id, provider, provider_txn_id, state, amount_minor)
      values (${paymentId}, ${provider}, ${`txn-${randomUUID()}`}, 1, ${amount})`;
    await expect(insert("click", 100000)).rejects.toMatchObject(check("provider_transactions_match_payment"));
    await expect(insert("payme", 1)).rejects.toMatchObject(check("provider_transactions_match_payment"));
    await expect(insert("payme", 100000)).resolves.toBeDefined();
  });

  it("a payment mints each entitlement at most once", async () => {
    const a = await userWithResult();
    const paymentId = await createPayment(sql, { userId: a.userId, targetId: a.resultId, status: "paid" });
    const grant = () => sql`
      insert into public.entitlements (user_id, entitlement, source, source_ref, payment_id)
      values (${a.userId}, 'deep_analysis', 'payment', 'pay-1', ${paymentId})`;
    await grant();
    await expect(grant()).rejects.toMatchObject(unique("entitlements_payment_entitlement_key"));
    await expect(sql`
      insert into public.entitlements (user_id, entitlement, source, source_ref)
      values (${a.userId}, 'deep_analysis', 'payment', 'pay-1')`).rejects.toMatchObject(check("entitlements_payment_source"));
  });

  it("keeps the amount of a price that payments reference", async () => {
    const a = await userWithResult();
    await createPayment(sql, { userId: a.userId, targetId: a.resultId });
    const price = await getPrice(sql, "full_report");
    await expect(sql`update public.prices set amount_minor = 1 where id = ${price.priceId}`).rejects.toMatchObject(
      check("prices_immutable_once_used"),
    );
    // Lifecycle columns stay editable (deactivate + insert a new row to change a price).
    await expect(sql`update public.prices set valid_to = null where id = ${price.priceId}`).resolves.toBeDefined();
  });
});
