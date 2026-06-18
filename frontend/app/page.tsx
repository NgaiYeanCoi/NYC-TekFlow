import Link from "next/link";
import { BookOpenIcon, GraduationCapIcon, LayoutDashboardIcon, ShieldCheckIcon, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicShell } from "@/components/layout/public-shell";
import { PostCard } from "@/components/public/post-card";
import { getSchoolNotices, getWikiPosts } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [wikiResult, schoolResult] = await Promise.allSettled([
    getWikiPosts({ page: 1, pageSize: 3 }),
    getSchoolNotices({ page: 1, pageSize: 3 }),
  ]);
  const wikiPosts = wikiResult.status === "fulfilled" ? wikiResult.value.items : [];
  const schoolPosts = schoolResult.status === "fulfilled" ? schoolResult.value.items : [];

  return (
    <PublicShell>
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">TekFlow 个人知识工作台</h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                统一管理技术沉淀、运维手册、学校通知、学习资料和项目记录，并用清晰的可见性边界保护私有内容。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/wiki" className={buttonVariants()}>
                <BookOpenIcon data-icon="inline-start" />
                打开 Wiki
              </Link>
              <Link href="/school" className={buttonVariants({ variant: "outline" })}>
                <GraduationCapIcon data-icon="inline-start" />
                查看 School
              </Link>
            </div>
          </div>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>内容边界</CardTitle>
              <CardDescription>每篇 Post 都有明确 visibility，公开页面只展示服务端允许的内容。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                ["private", "仅管理员后台可见"],
                ["public", "进入公开知识库"],
                ["school", "进入学校事项板"],
                ["unlisted", "持链接访问，不进列表"],
              ].map(([label, text]) => (
                <div key={label} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <EntryCard href="/wiki" title="Public Knowledge Base" description="公开技术笔记、SOP、教程和项目复盘。" icon={BookOpenIcon} />
          <EntryCard href="/school" title="School Board" description="课程、作业、考试和截止时间。" icon={GraduationCapIcon} />
          <EntryCard href="/login" title="Private Dashboard" description="登录后台维护全部内容和附件。" icon={LayoutDashboardIcon} />
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <BookOpenIcon data-icon="inline-start" />
              <h2 className="text-xl font-semibold">最新公开内容</h2>
            </div>
            <div className="grid gap-4">{wikiPosts.map((post) => <PostCard key={post.id} post={post} href={`/wiki/${post.slug}`} />)}</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon data-icon="inline-start" />
              <h2 className="text-xl font-semibold">近期学校事项</h2>
            </div>
            <div className="grid gap-4">{schoolPosts.map((post) => <PostCard key={post.id} post={post} href={`/school/${post.slug}`} />)}</div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function EntryCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="transition-colors hover:border-primary/40">
      <CardHeader>
        <Icon data-icon="inline-start" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={href} className="text-sm font-medium text-primary">
          进入
        </Link>
      </CardContent>
    </Card>
  );
}
