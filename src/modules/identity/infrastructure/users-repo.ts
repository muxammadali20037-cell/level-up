import "server-only";
import { type Db } from "@/lib/db/client";
import { type SessionChannel } from "../domain/session-token";

/** users + profiles persistence. Every function takes `db` so it composes inside transactions. */
export interface UserRow {
  id: string;
  isAnonymous: boolean;
  role: "user" | "admin";
  locale: string;
  countryCode: string | null;
  telegramUserId: number | null;
  mergedIntoUserId: string | null;
  firstTouch: Record<string, unknown>;
  lastSeenAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
}

const USER_COLUMNS = ["id", "is_anonymous", "role", "locale", "country_code", "telegram_user_id",
  "merged_into_user_id", "first_touch", "last_seen_at", "deleted_at", "created_at"] as const;

export interface FirstTouch {
  readonly channel?: SessionChannel;
  readonly [key: string]: unknown;
}

/** Creates an anonymous user and its default profile. */
export async function createAnonymous(
  db: Db,
  locale: string,
  channel: SessionChannel,
  firstTouch: FirstTouch = {},
): Promise<UserRow> {
  const touch = { ...firstTouch, channel };
  const [user] = await db<UserRow[]>`
    insert into public.users (is_anonymous, locale, first_touch)
    values (true, ${locale}, ${db.json(touch as never)})
    returning ${db(USER_COLUMNS)}`;
  await ensureProfile(db, user!.id);
  return user!;
}

/** Creates an identified Telegram user (no anonymous predecessor) with a default profile. */
export async function createTelegramUser(
  db: Db,
  input: { telegramUserId: number; locale: string; firstTouch: FirstTouch },
): Promise<UserRow> {
  const [user] = await db<UserRow[]>`
    insert into public.users (is_anonymous, locale, telegram_user_id, first_touch)
    values (false, ${input.locale}, ${input.telegramUserId}, ${db.json(input.firstTouch as never)})
    returning ${db(USER_COLUMNS)}`;
  await ensureProfile(db, user!.id);
  return user!;
}

export async function findById(db: Db, id: string, opts: { forUpdate?: boolean } = {}): Promise<UserRow | null> {
  const rows = opts.forUpdate
    ? await db<UserRow[]>`select ${db(USER_COLUMNS)} from public.users where id = ${id} for update`
    : await db<UserRow[]>`select ${db(USER_COLUMNS)} from public.users where id = ${id}`;
  return rows[0] ?? null;
}

export async function findByTelegramId(
  db: Db,
  telegramUserId: number,
  opts: { forUpdate?: boolean } = {},
): Promise<UserRow | null> {
  const rows = opts.forUpdate
    ? await db<UserRow[]>`
        select ${db(USER_COLUMNS)} from public.users where telegram_user_id = ${telegramUserId} for update`
    : await db<UserRow[]>`select ${db(USER_COLUMNS)} from public.users where telegram_user_id = ${telegramUserId}`;
  return rows[0] ?? null;
}

/** Follows merged_into_user_id (max depth 5) to the surviving user. */
export async function canonicalUserId(db: Db, id: string): Promise<string> {
  const [row] = await db<{ id: string | null }[]>`select public.canonical_user_id(${id}::uuid) as id`;
  return row?.id ?? id;
}

/** Upgrades an anonymous user in place to a Telegram identity (no merge needed). */
export async function linkTelegram(db: Db, userId: string, telegramUserId: number): Promise<void> {
  await db`
    update public.users set telegram_user_id = ${telegramUserId}, is_anonymous = false
     where id = ${userId}`;
}

export async function setLocale(db: Db, userId: string, locale: string): Promise<void> {
  await db`update public.users set locale = ${locale} where id = ${userId}`;
}

export async function touchLastSeen(db: Db, userId: string): Promise<void> {
  await db`update public.users set last_seen_at = now() where id = ${userId}`;
}

/** First-touch attribution: adds only keys the user does not have yet (first touch wins). */
export async function addFirstTouch(db: Db, userId: string, touch: Record<string, unknown>): Promise<void> {
  if (Object.keys(touch).length === 0) return;
  await db`
    update public.users set first_touch = ${db.json(touch as never)}::jsonb || first_touch
     where id = ${userId}`;
}

export async function ensureProfile(db: Db, userId: string): Promise<void> {
  await db`insert into public.profiles (user_id) values (${userId}) on conflict (user_id) do nothing`;
}
