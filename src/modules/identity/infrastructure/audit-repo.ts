import "server-only";
import { type Db } from "@/lib/db/client";

export interface AuditEntry {
  actorUserId: string | null;
  actorType: "user" | "admin" | "system" | "provider";
  action: string;
  entityType: string;
  entityId: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ipHash?: string | null;
}

/** Appends one audit_logs row (append-only table). */
export async function insertAudit(db: Db, entry: AuditEntry): Promise<void> {
  await db`
    insert into public.audit_logs (actor_user_id, actor_type, action, entity_type, entity_id, before, after, ip_hash)
    values (${entry.actorUserId}, ${entry.actorType}, ${entry.action}, ${entry.entityType}, ${entry.entityId},
            ${entry.before ? db.json(entry.before as never) : null}, ${entry.after ? db.json(entry.after as never) : null},
            ${entry.ipHash ?? null})`;
}
