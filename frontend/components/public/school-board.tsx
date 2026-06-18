import Link from "next/link";
import { CalendarClockIcon, MapPinIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">School Board</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">按截止时间、今日事项和本周安排查看学校通知。</p>
      </div>
      {posts.length === 0 ? (
        <Empty>
          <EmptyTitle>暂无学校事项</EmptyTitle>
          <EmptyDescription>后端可用且存在 school published notice 后会显示在这里。</EmptyDescription>
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
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={`${title}-${post.id}`} className="transition-colors hover:border-primary/40">
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <PriorityBadge value={post.noticePriority} />
                <NoticeStatusBadge value={post.noticeStatus} />
              </div>
              <CardTitle className="leading-7">
                <Link href={`/school/${post.slug}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

