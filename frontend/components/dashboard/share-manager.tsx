"use client";

import * as React from "react";
import { CopyIcon, LinkIcon, RefreshCcwIcon, ShieldOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api/client";
import { formatDateTime } from "@/lib/format";
import type { Post, PostShare, PostSharePayload } from "@/types/tekflow";

type Feedback = {
  type: "success" | "error";
  text: string;
};

export function ShareManager({ token, post, initialShare }: { token: string; post: Post; initialShare: PostShare }) {
  const shareable = post.visibility === "unlisted" && post.status === "published";
  const [share, setShare] = React.useState(initialShare);
  const [accessCode, setAccessCode] = React.useState("");
  const [clearAccessCode, setClearAccessCode] = React.useState(false);
  const [neverExpires, setNeverExpires] = React.useState(false);
  const [expiresAt, setExpiresAt] = React.useState(() => toDateTimeLocal(initialShare.expiresAt) || defaultExpiryInput());
  const [pending, setPending] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<Feedback | null>(null);

  const sharePath = share.token ? `/share/${share.token}` : "";

  async function saveShare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("save");
    setFeedback(null);
    try {
      const payload: PostSharePayload = {
        accessCode: accessCode || undefined,
        clearAccessCode,
        expiresAt: neverExpires ? null : expiresAt || null,
        neverExpires,
      };
      const next = await apiFetch<PostShare>(`/api/v1/admin/posts/${post.id}/share`, {
        method: "POST",
        token,
        body: JSON.stringify(payload),
      });
      setShare(next);
      setAccessCode("");
      setClearAccessCode(false);
      setFeedback({ type: "success", text: "分享设置已保存。" });
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "分享设置保存失败。" });
    } finally {
      setPending(null);
    }
  }

  async function revokeShare() {
    if (!window.confirm("撤销后旧分享链接和附件访问会立即失效。确认撤销？")) {
      return;
    }
    setPending("revoke");
    setFeedback(null);
    try {
      const next = await apiFetch<PostShare>(`/api/v1/admin/posts/${post.id}/share`, { method: "DELETE", token });
      setShare(next);
      setFeedback({ type: "success", text: "分享已撤销。" });
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "撤销分享失败。" });
    } finally {
      setPending(null);
    }
  }

  async function rotateShare() {
    if (!window.confirm("重新生成后旧分享链接会立即失效。确认继续？")) {
      return;
    }
    setPending("rotate");
    setFeedback(null);
    try {
      const next = await apiFetch<PostShare>(`/api/v1/admin/posts/${post.id}/share/rotate`, { method: "POST", token });
      setShare(next);
      setFeedback({ type: "success", text: "分享链接已重新生成。" });
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "重新生成分享失败。" });
    } finally {
      setPending(null);
    }
  }

  async function copyShareUrl() {
    if (!share.token) {
      return;
    }
    const shareUrl = `${window.location.origin}/share/${share.token}`;
    await navigator.clipboard.writeText(shareUrl);
    setFeedback({ type: "success", text: "分享链接已复制。" });
  }

  return (
    <Card id="share" className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>链接分享</CardTitle>
            <CardDescription>为持链接访问内容生成可撤销的受控分享链接。</CardDescription>
          </div>
          <ShareStatusBadge share={share} />
        </div>
      </CardHeader>
      <CardContent className="pt-5 md:pt-5">
        {!shareable ? (
          <div className="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            需要先将内容保存为“持链接访问”并发布，才能开启分享。
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {share.token ? (
              <div className="flex flex-col gap-2 rounded-md border border-border bg-background p-3">
                <span className="text-xs font-semibold text-muted-foreground">当前分享链接</span>
                <div className="flex flex-col gap-2 md:flex-row">
                  <Input value={sharePath} readOnly />
                  <Button type="button" variant="outline" onClick={copyShareUrl} disabled={!share.token}>
                    <CopyIcon data-icon="inline-start" />
                    复制
                  </Button>
                </div>
              </div>
            ) : null}

            <form onSubmit={saveShare}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="shareAccessCode">访问码</FieldLabel>
                  <Input
                    id="shareAccessCode"
                    value={accessCode}
                    onChange={(event) => setAccessCode(event.target.value)}
                    placeholder={share.hasAccessCode ? "留空保持原访问码" : "可选"}
                  />
                  <FieldDescription>设置后访客需要输入访问码才能打开内容和附件。</FieldDescription>
                </Field>
                {share.hasAccessCode ? (
                  <Field>
                    <label className="flex min-h-11 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                      <input type="checkbox" checked={clearAccessCode} onChange={(event) => setClearAccessCode(event.target.checked)} />
                      清除当前访问码
                    </label>
                  </Field>
                ) : null}
                <Field data-disabled={neverExpires}>
                  <FieldLabel htmlFor="shareExpiresAt">过期时间</FieldLabel>
                  <Input
                    id="shareExpiresAt"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(event) => setExpiresAt(event.target.value)}
                    disabled={neverExpires}
                  />
                  <FieldDescription>新分享默认 7 天后过期，可按需要调整。</FieldDescription>
                </Field>
                <Field>
                  <label className="flex min-h-11 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                    <input type="checkbox" checked={neverExpires} onChange={(event) => setNeverExpires(event.target.checked)} />
                    永不过期
                  </label>
                </Field>
                {feedback ? (
                  <p className={feedback.type === "error" ? "text-sm text-destructive" : "text-sm text-success"} role={feedback.type === "error" ? "alert" : "status"}>
                    {feedback.text}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={pending !== null}>
                    <LinkIcon data-icon="inline-start" />
                    {pending === "save" ? "保存中" : share.token ? "保存分享设置" : "开启分享"}
                  </Button>
                  {share.token ? (
                    <>
                      <Button type="button" variant="outline" onClick={rotateShare} disabled={pending !== null}>
                        <RefreshCcwIcon data-icon="inline-start" />
                        {pending === "rotate" ? "生成中" : "重新生成"}
                      </Button>
                      <Button type="button" variant="destructive" onClick={revokeShare} disabled={pending !== null || share.status !== "active"}>
                        <ShieldOffIcon data-icon="inline-start" />
                        {pending === "revoke" ? "撤销中" : "撤销分享"}
                      </Button>
                    </>
                  ) : null}
                </div>
              </FieldGroup>
            </form>

            <div className="grid gap-3 text-sm md:grid-cols-4">
              <ShareMetric label="成功访问" value={share.accessCount} />
              <ShareMetric label="附件下载" value={share.attachmentDownloadCount} />
              <ShareMetric label="过期时间" value={share.expiresAt ? formatDateTime(share.expiresAt) : "永不过期"} />
              <ShareMetric label="最后访问" value={share.lastAccessedAt ? formatDateTime(share.lastAccessedAt) : "-"} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ShareMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words font-semibold">{value}</div>
    </div>
  );
}

function ShareStatusBadge({ share }: { share: PostShare }) {
  if (share.status === "none") {
    return <Badge variant="muted">未开启</Badge>;
  }
  if (share.status === "revoked") {
    return <Badge variant="destructive">已撤销</Badge>;
  }
  if (share.expired) {
    return <Badge variant="warning">已过期</Badge>;
  }
  return <Badge variant="success">分享中</Badge>;
}

function toDateTimeLocal(value?: string | null) {
  return value ? value.slice(0, 16) : "";
}

function defaultExpiryInput() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
