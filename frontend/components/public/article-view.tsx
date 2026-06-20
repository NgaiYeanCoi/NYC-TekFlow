import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";
import { DownloadIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { attachmentUrl } from "@/lib/api/client";
import { formatBytes, formatDateTime } from "@/lib/format";
import type { Post } from "@/types/tekflow";

export function ArticleView({ post, unlisted = false, details }: { post: Post; unlisted?: boolean; details?: ReactNode }) {
  const content = normalizeMarkdown(post.content);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <article className="flex flex-col gap-7 rounded-lg border border-border bg-card px-5 py-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:px-10 md:py-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {unlisted ? <Badge variant="warning">分享阅读</Badge> : null}
            {post.category ? <Badge variant="outline">{post.category.name}</Badge> : null}
            {post.project ? <Badge variant="outline">{post.project.name}</Badge> : null}
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-5xl break-words text-3xl font-semibold leading-tight md:text-4xl">{post.title}</h1>
            {post.summary ? <p className="max-w-4xl break-words text-base leading-7 text-muted-foreground">{post.summary}</p> : null}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>发布 {formatDateTime(post.publishedAt)}</span>
            <span>更新 {formatDateTime(post.updatedAt)}</span>
            {post.project ? <span>项目 {post.project.name}</span> : null}
          </div>
          {details}
        </div>

        <Separator />

        <div className="markdown max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "暂无正文"}</ReactMarkdown>
        </div>

        {post.attachments.length > 0 ? (
          <section className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
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
          </section>
        ) : null}
      </article>
    </main>
  );
}

function normalizeMarkdown(value?: string | null) {
  if (!value) {
    return "";
  }
  if (!value.includes("\n") && value.includes("\\n")) {
    return value.replace(/\\n/g, "\n");
  }
  return value;
}
