"use client";

import * as React from "react";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { apiFetch, apiUpload, attachmentUrl } from "@/lib/api/client";
import { formatBytes, formatDateTime } from "@/lib/format";
import type { Attachment, Post } from "@/types/tekflow";

export function AttachmentManager({ token, items, posts }: { token: string; items: Attachment[]; posts: Post[] }) {
  const [list, setList] = React.useState(items);
  const [postId, setPostId] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [downloadingId, setDownloadingId] = React.useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function refresh() {
    setList(await apiFetch<Attachment[]>("/api/v1/admin/attachments", { token }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!file || !postId) {
      setMessage("请选择所属内容并选择文件");
      return;
    }
    const formData = new FormData();
    formData.set("postId", postId);
    formData.set("file", file);
    setPending(true);
    try {
      await apiUpload<Attachment>("/api/v1/admin/attachments", formData, token);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "上传失败");
    } finally {
      setPending(false);
    }
  }

  async function download(item: Attachment) {
    setMessage("");
    setDownloadingId(item.id);
    try {
      const response = await fetch(attachmentUrl(item.id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("附件下载失败");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = item.originalName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "附件下载失败");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>上传附件</CardTitle>
          <CardDescription>选择所属内容后上传截图、文档或压缩包等资料。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="postId">所属内容</FieldLabel>
                <select
                  id="postId"
                  className="h-10 rounded-md border border-input bg-card px-3 text-sm"
                  value={postId}
                  onChange={(event) => setPostId(event.target.value)}
                  disabled={posts.length === 0}
                >
                  <option value="">选择一篇内容</option>
                  {posts.map((post) => (
                    <option key={post.id} value={post.id}>
                      #{post.id} {post.title}
                    </option>
                  ))}
                </select>
                {posts.length === 0 ? <FieldDescription>创建内容后可选择所属内容。</FieldDescription> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="file">文件</FieldLabel>
                <Input id="file" ref={fileInputRef} type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
              </Field>
              {message ? <p className="text-sm text-destructive" role="alert">{message}</p> : null}
              <Button type="submit" disabled={pending || posts.length === 0}>
                <UploadIcon data-icon="inline-start" />
                {pending ? "上传中" : "上传"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle>附件列表</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col p-0">
          {list.length === 0 ? (
            <Empty className="m-4">
              <EmptyTitle>暂无附件</EmptyTitle>
              <EmptyDescription>{posts.length === 0 ? "创建内容后可上传关联附件。" : "上传附件后会显示在这里。"}</EmptyDescription>
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={posts.length === 0}>
                <UploadIcon data-icon="inline-start" />
                上传附件
              </Button>
            </Empty>
          ) : (
            list.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm last:border-0">
                <span className="min-w-0 truncate">{item.originalName}</span>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-xs text-muted-foreground md:inline">
                    Post #{item.postId} / {formatBytes(item.size)} / {formatDateTime(item.createdAt)}
                  </span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => download(item)} disabled={downloadingId === item.id}>
                    <DownloadIcon data-icon="inline-start" />
                    {downloadingId === item.id ? "下载中" : "下载"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
