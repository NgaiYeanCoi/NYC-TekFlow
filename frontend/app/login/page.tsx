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
          <h1 className="text-3xl font-semibold">管理后台</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            登录后整理文章草稿、学校事项、项目资料和附件，让公开知识库与事项板保持清晰更新。
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            {["写作与草稿整理", "学校事项维护", "附件资料归档"].map((item) => (
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
