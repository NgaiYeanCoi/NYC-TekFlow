import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { ArticleView } from "@/components/public/article-view";
import { NoticeStatusBadge, PriorityBadge } from "@/components/common/status-badge";
import { formatDate, formatDateTime } from "@/lib/format";
import { getSchoolNotice } from "@/lib/api/queries";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/tekflow";

export const dynamic = "force-dynamic";

export default async function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getSchoolNotice(slug).catch(() => null);
  if (!post) {
    notFound();
  }
  return (
    <PublicShell>
      <ArticleView post={post} details={<SchoolNoticeDetails post={post} />} />
    </PublicShell>
  );
}

function SchoolNoticeDetails({ post }: { post: Post }) {
  return (
    <section className="rounded-lg border border-border bg-background p-4">
      <div className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
        <InfoItem label="课程" value={post.courseName || "-"} />
        <InfoItem label="老师" value={post.teacherName || "-"} />
        <InfoItem label="事项日期" value={formatDate(post.eventDate)} />
        <InfoItem label="截止时间" value={formatDateTime(post.deadlineAt)} />
        <InfoItem label="地点" value={post.location || "-"} />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">状态</span>
          <div className="flex flex-wrap gap-2">
            <PriorityBadge value={post.noticePriority} />
            <NoticeStatusBadge value={post.noticeStatus} />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="break-words text-foreground">{value}</span>
    </div>
  );
}
