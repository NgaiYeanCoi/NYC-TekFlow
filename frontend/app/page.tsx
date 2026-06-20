import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  FileTextIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PublicShell } from "@/components/layout/public-shell";
import { PostCard } from "@/components/public/post-card";
import { getSchoolNotices, getWikiPosts } from "@/lib/api/queries";
import type { Post } from "@/types/tekflow";

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
      <main>
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-14">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">TekFlow 个人知识库</h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  整理技术笔记、项目复盘、学习资料和学校事项；公开内容进入知识库，课程作业与考试安排进入事项板。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/wiki" className={buttonVariants()}>
                  <BookOpenIcon data-icon="inline-start" />
                  打开知识库
                </Link>
                <Link href="/school" className={buttonVariants({ variant: "outline" })}>
                  <GraduationCapIcon data-icon="inline-start" />
                  查看学校事项
                </Link>
              </div>
              <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <Signal icon={FileTextIcon} label="技术笔记归档" />
                <Signal icon={ClockIcon} label="学校事项提醒" />
                <Signal icon={BookOpenIcon} label="Markdown 阅读" />
              </div>
            </div>
            <WorkspacePreview />
          </div>
        </section>

        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10">
          <section className="grid gap-4 md:grid-cols-3">
            <EntryPanel href="/wiki" title="公开知识库" description="阅读技术笔记、教程、SOP 和项目复盘。" icon={BookOpenIcon} />
            <EntryPanel href="/school" title="学校事项" description="查看课程、作业、考试和截止时间。" icon={GraduationCapIcon} />
            <EntryPanel href="/login" title="管理后台" description="登录后整理文章、事项、草稿和附件。" icon={LayoutDashboardIcon} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <BookOpenIcon data-icon="inline-start" />
                <h2 className="text-lg font-semibold">这里可以看什么</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">访客可以直接阅读公开知识内容，也可以查看近期学校事项。</p>
              <div className="mt-5 grid gap-2">
              {[
                ["技术笔记", "框架、数据库、部署和工具经验"],
                ["项目复盘", "项目过程、问题记录和改进总结"],
                ["学习资料", "课程笔记、阅读整理和资料索引"],
                ["课程事项", "作业、考试、地点和截止时间"],
              ].map(([label, text]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <span className="font-semibold text-foreground">{label}</span>
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <FeedBlock icon={BookOpenIcon} title="最新公开内容" posts={wikiPosts} basePath="/wiki" />
              <FeedBlock icon={GraduationCapIcon} title="近期学校事项" posts={schoolPosts} basePath="/school" />
            </div>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}

function Signal({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-3">
      <Icon data-icon="inline-start" />
      <span>{label}</span>
    </div>
  );
}

function WorkspacePreview() {
  const workflowRows: Array<[string, string, LucideIcon]> = [
    ["资料备份笔记", "技术笔记", FileTextIcon],
    ["期末复习安排", "学校事项", GraduationCapIcon],
    ["登录流程整理", "公开文章", BookOpenIcon],
  ];

  return (
    <div className="rounded-lg border border-border bg-background p-3 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
      <div className="rounded-md border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <div className="text-sm font-semibold">管理后台</div>
            <div className="text-xs text-muted-foreground">文章、资料和学校事项整理</div>
          </div>
          <div className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">写作中</div>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-3">
            {[
              ["公开文章", "18", "知识库内容"],
              ["学校事项", "12", "课程与截止时间"],
              ["草稿整理", "7", "待完善资料"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-md border border-border bg-background p-3">
                <div className="text-xs font-semibold text-muted-foreground">{label}</div>
                <div className="mt-1 text-2xl font-semibold">{value}</div>
                <div className="text-xs text-muted-foreground">{note}</div>
              </div>
            ))}
          </div>
          <div className="rounded-md border border-border bg-background">
            <div className="border-b border-border px-3 py-2 text-sm font-semibold">近期整理</div>
            {workflowRows.map(([title, state, Icon]) => (
              <div key={title} className="flex items-center justify-between gap-3 border-b border-border px-3 py-3 last:border-0">
                <div className="flex min-w-0 items-center gap-2">
                  <Icon data-icon="inline-start" />
                  <span className="truncate text-sm">{title}</span>
                </div>
                <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">{state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EntryPanel({
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
    <Link href={href} className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/25">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <Icon data-icon="inline-start" />
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function FeedBlock({ icon: Icon, title, posts, basePath }: { icon: LucideIcon; title: string; posts: Post[]; basePath: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon data-icon="inline-start" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="grid gap-3">
        {posts.length > 0 ? posts.map((post) => <PostCard key={post.id} post={post} href={`${basePath}/${post.slug}`} />) : <div className="rounded-lg border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">有公开内容后会显示在这里。</div>}
      </div>
    </div>
  );
}
