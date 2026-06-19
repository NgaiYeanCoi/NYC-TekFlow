import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DownloadIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { attachmentUrl } from "@/lib/api/client";
import { formatBytes, formatDateTime } from "@/lib/format";
import type { Post } from "@/types/tekflow";

export function ArticleView({ post, unlisted = false }: { post: Post; unlisted?: boolean }) {
  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {unlisted ? <Badge variant="warning">分享阅读</Badge> : null}
          {post.category ? <Badge variant="outline">{post.category.name}</Badge> : null}
          {post.project ? <Badge variant="outline">{post.project.name}</Badge> : null}
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">{post.title}</h1>
          {post.summary ? <p className="max-w-3xl text-base leading-7 text-muted-foreground">{post.summary}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>发布 {formatDateTime(post.publishedAt)}</span>
          <span>更新 {formatDateTime(post.updatedAt)}</span>
          {post.project ? <span>项目 {post.project.name}</span> : null}
        </div>
      </div>
      <Separator />
      <div className="markdown max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content || "暂无正文"}</ReactMarkdown>
      </div>
      {post.attachments.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col gap-3 pt-5">
            <h2 className="text-base font-semibold">附件</h2>
            <div className="flex flex-col gap-2">
              {post.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachmentUrl(attachment.id)}
                  className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
                >
                  <span className="truncate">{attachment.originalName}</span>
                  <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                    {formatBytes(attachment.size)}
                    <DownloadIcon data-icon="inline-end" />
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </article>
  );
}
