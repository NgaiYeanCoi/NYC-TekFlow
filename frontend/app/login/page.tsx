import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { PublicShell } from "@/components/layout/public-shell";

export default async function LoginPage() {
  const session = await auth();
  if (session?.accessToken) {
    redirect("/dashboard");
  }
  return (
    <PublicShell>
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <LoginForm />
      </main>
    </PublicShell>
  );
}

