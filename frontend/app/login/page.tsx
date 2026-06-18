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
      <main className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_440px] lg:items-center">
        <section className="hidden rounded-lg border border-border bg-card p-6 lg:block">
          <h1 className="text-3xl font-semibold">Private Dashboard</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            后台用于维护 private、public、school 和 unlisted 内容边界。登录态由 NextAuth 封装，后端继续使用 JWT 做真实认证。
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            {["内容发布前人工脱敏", "附件访问跟随 Post 权限", "公开页面由服务端兜底过滤"].map((item) => (
              <div key={item} className="rounded-md border border-border bg-background px-3 py-2 text-muted-foreground">{item}</div>
            ))}
          </div>
        </section>
        <div className="flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </main>
    </PublicShell>
  );
}
