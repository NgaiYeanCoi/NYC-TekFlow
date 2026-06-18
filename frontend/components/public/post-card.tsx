import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, VisibilityBadge } from "@/components/common/status-badge";
import { formatDateTime } from "@/lib/format";
import type { Post } from "@/types/tekflow";

export function PostCard({ post, href }: { post: Post; href: string }) {
  return (
    <Card className="transition-colors hover:border-primary/40">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <VisibilityBadge value={post.visibility} />
          <StatusBadge value={post.status} />
          {post.category ? <Badge variant="outline">{post.category.name}</Badge> : null}
        </div>
        <CardTitle className="leading-7">
          <Link href={href}>{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{post.summary || "暂无摘要"}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>更新于 {formatDateTime(post.updatedAt)}</span>
          <Link href={href} className="inline-flex items-center gap-1 font-medium text-primary">
            查看
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

