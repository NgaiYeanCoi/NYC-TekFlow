import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import type { Post } from "@/types/tekflow";

export function PostCard({ post, href }: { post: Post; href: string }) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-primary/50">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {post.category ? <Badge variant="outline">{post.category.name}</Badge> : null}
          {post.project ? <Badge variant="outline">{post.project.name}</Badge> : null}
        </div>
        <h3 className="text-base font-semibold leading-7">
          <Link href={href} className="hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/25">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{post.summary || "暂无摘要"}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>更新于 {formatDateTime(post.updatedAt)}</span>
          <Link href={href} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 font-semibold text-primary hover:bg-accent">
            查看
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </div>
      </div>
    </article>
  );
}
