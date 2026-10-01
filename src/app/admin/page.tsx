import { Logo } from "@/components/brand/logo";

/** Placeholder: the admin console (auth, content, analytics) is built in a later phase. */
export default function AdminPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-12">
      <Logo />
      <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
      <p className="text-muted-foreground">The admin console is not available yet.</p>
    </main>
  );
}
