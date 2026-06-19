import Link from "next/link";
import { ArrowRightIcon, CalendarClockIcon, MapPinIcon } from "lucide-react";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { NoticeStatusBadge, PriorityBadge } from "@/components/common/status-badge";
import { formatDate, formatDateTime } from "@/lib/format";
import type { Post } from "@/types/tekflow";

function groupNotices(posts: Post[]) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);
  const weekEndKey = weekEnd.toISOString().slice(0, 10);

  return {
    upcoming: posts.filter((post) => post.deadlineAt && post.noticeStatus !== "expired" && post.noticeStatus !== "done"),
    today: posts.filter((post) => post.eventDate === today),
    week: posts.filter((post) => post.eventDate && post.eventDate > today && post.eventDate <= weekEndKey),
    expired: posts.filter((post) => post.noticeStatus === "expired"),
    all: posts,
  };
}

export function SchoolBoard({ posts }: { posts: Post[] }) {
  const groups = groupNotices(posts);
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold">学校事项</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">按截止时间、今日事项和本周安排查看学校通知。</p>
        </div>
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          {posts.length} 项事项
        </div>
      </div>
      {posts.length === 0 ? (
        <Empty>
          <EmptyTitle>暂无学校事项</EmptyTitle>
          <EmptyDescription>有课程、作业或考试安排后会显示在这里。</EmptyDescription>
        </Empty>
      ) : (
        <div className="flex flex-col gap-8">
          <NoticeSection title="即将截止" posts={groups.upcoming} />
          <NoticeSection title="今日事项" posts={groups.today} />
          <NoticeSection title="本周事项" posts={groups.week} />
          <NoticeSection title="全部通知" posts={groups.all} />
          <NoticeSection title="已过期" posts={groups.expired} />
        </div>
      )}
    </div>
  );
}

function NoticeSection({ title, posts }: { title: string; posts: Post[] }) {
  if (posts.length === 0) {
    return null;
  }
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{posts.length} 项</span>
      </div>
      <div className="grid gap-3">
        {posts.map((post) => (
          <article key={`${title}-${post.id}`} className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap gap-2">
                  <PriorityBadge value={post.noticePriority} />
                  <NoticeStatusBadge value={post.noticeStatus} />
                </div>
                <h3 className="truncate text-base font-semibold leading-7">
                  <Link href={`/school/${post.slug}`} className="hover:text-primary">{post.title}</Link>
                </h3>
              </div>
              <Link href={`/school/${post.slug}`} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-sm font-semibold text-primary hover:bg-accent">
                查看
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </div>
            <div className="mt-3 flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:flex-wrap">
              <div className="flex flex-wrap gap-3">
                <span>{post.courseName || "未填写课程"}</span>
                <span>{post.teacherName || "未填写老师"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarClockIcon data-icon="inline-start" />
                <span>{formatDate(post.eventDate)} / 截止 {formatDateTime(post.deadlineAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon data-icon="inline-start" />
                <span>{post.location || "未填写地点"}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
