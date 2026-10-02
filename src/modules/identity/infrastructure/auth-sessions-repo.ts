import "server-only";
import { type Db } from "@/lib/db/client";
import { type SessionChannel } from "../domain/session-token";

export interface AuthSessionRow {
  id: string;
  userId: string;
  channel: SessionChannel;
  expiresAt: Date;
  revokedAt: Date | null;
}

export async function createAuthSession(
  db: Db,
  input: {
    userId: string;
    channel: SessionChannel;
    expiresAt: Date;
    ipHash: string | null;
    uaHash: string | null;
    deviceHash: string | null;
  },
): Promise<AuthSessionRow> {
  const [row] = await db<AuthSessionRow[]>`
    insert into public.auth_sessions (user_id, channel, expires_at, last_used_at, ip_hash, ua_hash, device_hash)
    values (${input.userId}, ${input.channel}, ${input.expiresAt}, now(), ${input.ipHash}, ${input.uaHash},
            ${input.deviceHash})
    returning id, user_id, channel, expires_at, revoked_at`;
  return row!;
}

/** Session row plus its (canonical, i.e. merge-followed) owner. */
export interface ActiveSessionRow {
  id: string;
  channel: SessionChannel;
  expiresAt: Date;
  revokedAt: Date | null;
  userId: string;
  isAnonymous: boolean;
  role: "user" | "admin";
  locale: string;
  deletedAt: Date | null;
}

export async function findSessionWithUser(db: Db, sessionId: string): Promise<ActiveSessionRow | null> {
  const [row] = await db<ActiveSessionRow[]>`
    select s.id, s.channel, s.expires_at, s.revoked_at,
           u.id as user_id, u.is_anonymous, u.role, u.locale, u.deleted_at
      from public.auth_sessions s
      join public.users u on u.id = public.canonical_user_id(s.user_id)
     where s.id = ${sessionId}`;
  return row ?? null;
}

export async function extendSession(db: Db, sessionId: string, expiresAt: Date): Promise<void> {
  await db`
    update public.auth_sessions set expires_at = ${expiresAt}, last_used_at = now()
     where id = ${sessionId} and revoked_at is null`;
}

export async function revokeSession(db: Db, sessionId: string): Promise<void> {
  await db`update public.auth_sessions set revoked_at = now() where id = ${sessionId} and revoked_at is null`;
}
