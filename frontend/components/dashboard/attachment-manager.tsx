"use client";

import * as React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { apiFetch, apiUpload, attachmentUrl } from "@/lib/api/client";
import { formatBytes, formatDateTime } from "@/lib/format";
import type { Attachment } from "@/types/tekflow";

export function AttachmentManager({ token, items }: { token: string; items: Attachment[] }) {
  const [list, setList] = React.useState(items);
  const [postId, setPostId] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState("");

  async function refresh() {
    setList(await apiFetch<Attachment[]>("/api/v1/admin/attachments", { token }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!file || !postId) {
      setMessage("请填写 Post ID 并选择文件");
      return;
    }
    const formData = new FormData();
    formData.set("postId", postId);
    formData.set("file", file);
    try {
      await apiUpload<Attachment>("/api/v1/admin/attachments", formData, token);
      setFile(null);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "上传失败");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>上传附件</CardTitle>
          <CardDescription>附件权限跟随所属 Post，访问统一走受控接口。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="postId">Post ID</FieldLabel>
                <Input id="postId" value={postId} onChange={(event) => setPostId(event.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor="file">文件</FieldLabel>
                <Input id="file" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
              </Field>
              {message ? <p className="text-sm text-destructive">{message}</p> : null}
              <Button type="submit">
                <UploadIcon data-icon="inline-start" />
                上传
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>附件列表</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {list.map((item) => (
            <a key={item.id} href={attachmentUrl(item.id)} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
              <span className="truncate">{item.originalName}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                Post #{item.postId} / {formatBytes(item.size)} / {formatDateTime(item.createdAt)}
              </span>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

