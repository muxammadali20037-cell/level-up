import "server-only";
import { type Db } from "@/lib/db/client";

export type Budget = "free" | "low" | "medium" | "high";

export interface ProfileRow {
  userId: string;
  displayName: string | null;
  firstName: string | null;
  username: string | null;
  showNameOnShare: boolean;
  timePerDayMinutes: number | null;
  budget: Budget | null;
  location: string | null;
  goalType: string | null;
  timezone: string | null;
  notificationsOptIn: boolean;
  marketingOptIn: boolean;
}

const PROFILE_COLUMNS = ["user_id", "display_name", "first_name", "username", "show_name_on_share",
  "time_per_day_minutes", "budget", "location", "goal_type", "timezone", "notifications_opt_in",
  "marketing_opt_in"] as const;

export async function getProfile(db: Db, userId: string): Promise<ProfileRow | null> {
  const [row] = await db<ProfileRow[]>`
    select ${db(PROFILE_COLUMNS)} from public.profiles where user_id = ${userId}`;
  return row ?? null;
}

/** User-editable columns (server-managed ones such as username are not in this list). */
export interface ProfilePatch {
  displayName?: string | null;
  showNameOnShare?: boolean;
  timePerDayMinutes?: number | null;
  budget?: Budget | null;
  goalType?: string | null;
  timezone?: string | null;
}

const PATCH_COLUMNS: Record<keyof ProfilePatch, string> = {
  displayName: "display_name",
  showNameOnShare: "show_name_on_share",
  timePerDayMinutes: "time_per_day_minutes",
  budget: "budget",
  goalType: "goal_type",
  timezone: "timezone",
};

export async function updateProfile(db: Db, userId: string, patch: ProfilePatch): Promise<void> {
  const values: Record<string, unknown> = {};
  for (const [key, column] of Object.entries(PATCH_COLUMNS) as [keyof ProfilePatch, string][]) {
    if (patch[key] !== undefined) values[column] = patch[key];
  }
  const columns = Object.keys(values);
  if (columns.length === 0) return;
  await db`insert into public.profiles (user_id) values (${userId}) on conflict (user_id) do nothing`;
  await db`update public.profiles set ${db(values, columns)} where user_id = ${userId}`;
}

/** Server-managed Telegram fields (first name / username), refreshed on every Telegram sign-in. */
export async function setTelegramNames(
  db: Db,
  userId: string,
  names: { firstName: string | null; username: string | null },
): Promise<void> {
  const firstName = names.firstName?.trim().slice(0, 64) || null;
  const username = names.username?.trim().slice(0, 64) || null;
  await db`
    insert into public.profiles (user_id, first_name, username) values (${userId}, ${firstName}, ${username})
    on conflict (user_id) do update
       set first_name = coalesce(excluded.first_name, public.profiles.first_name),
           username = coalesce(excluded.username, public.profiles.username)`;
}
