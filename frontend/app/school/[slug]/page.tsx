import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { ArticleView } from "@/components/public/article-view";
import { Card, CardContent } from "@/components/ui/card";
import { NoticeStatusBadge, PriorityBadge } from "@/components/common/status-badge";
import { formatDate, formatDateTime } from "@/lib/format";
import { getSchoolNotice } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getSchoolNotice(slug).catch(() => null);
  if (!post) {
    notFound();
  }
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 pt-8">
        <Card>
          <CardContent className="grid gap-3 pt-5 text-sm md:grid-cols-2">
            <div>课程：{post.courseName || "-"}</div>
            <div>老师：{post.teacherName || "-"}</div>
            <div>事项日期：{formatDate(post.eventDate)}</div>
            <div>截止时间：{formatDateTime(post.deadlineAt)}</div>
            <div>地点：{post.location || "-"}</div>
            <div className="flex gap-2">
              <PriorityBadge value={post.noticePriority} />
              <NoticeStatusBadge value={post.noticeStatus} />
            </div>
          </CardContent>
        </Card>
      </div>
      <ArticleView post={post} />
    </PublicShell>
  );
}

