"use client";

import * as React from "react";
import { LockKeyholeIcon, ShieldAlertIcon } from "lucide-react";
import { ArticleView } from "@/components/public/article-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { openSharePost } from "@/lib/api/queries";
import { formatDateTime } from "@/lib/format";
import type { Post, ShareMeta } from "@/types/tekflow";

export function ShareGate({ token, meta }: { token: string; meta: ShareMeta }) {
  const [accessCode, setAccessCode] = React.useState("");
  const [post, setPost] = React.useState<Post | null>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const openedRef = React.useRef(false);

  const blocked = meta.revoked || meta.expired || meta.status !== "active";

  const open = React.useCallback(async (code: string) => {
    setPending(true);
    setError("");
    try {
      const next = await openSharePost(token, code);
      setPost(next);
    } catch (openError) {
      openedRef.current = false;
      setError(openError instanceof Error ? openError.message : "分享内容暂时无法打开。");
    } finally {
      setPending(false);
    }
  }, [token]);

  React.useEffect(() => {
    if (blocked || meta.requiresAccessCode || openedRef.current) {
      return;
    }
    openedRef.current = true;
    void open("");
  }, [blocked, meta.requiresAccessCode, open]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openedRef.current = true;
    await open(accessCode);
  }

  if (post) {
    return <ArticleView post={post} unlisted shareAccess={{ token, accessCode }} />;
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-10">
      <Card className="w-full overflow-hidden">
        <CardHeader className="border-b border-border">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              {blocked ? <ShieldAlertIcon data-icon="inline-start" /> : <LockKeyholeIcon data-icon="inline-start" />}
            </span>
            <div>
              <CardTitle>{blocked ? "分享不可用" : meta.title}</CardTitle>
              <CardDescription>
                {blocked ? blockedDescription(meta) : meta.requiresAccessCode ? "输入访问码后可以继续阅读。" : "正在打开分享内容。"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 md:pt-5">
          {blocked ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {meta.expiresAt ? `该分享的过期时间为 ${formatDateTime(meta.expiresAt)}。` : "请联系分享者确认链接状态。"}
            </p>
          ) : meta.requiresAccessCode ? (
            <form onSubmit={submit}>
              <FieldGroup>
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="shareAccessCode">访问码</FieldLabel>
                  <Input
                    id="shareAccessCode"
                    value={accessCode}
                    onChange={(event) => setAccessCode(event.target.value)}
                    aria-invalid={Boolean(error)}
                    required
                  />
                </Field>
                {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
                <Button type="submit" disabled={pending}>
                  {pending ? "打开中" : "打开分享"}
                </Button>
              </FieldGroup>
            </form>
          ) : (
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>{pending ? "正在打开，请稍候。" : "分享内容会自动打开。"}</p>
              {error ? <p className="text-destructive" role="alert">{error}</p> : null}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function blockedDescription(meta: ShareMeta) {
  if (meta.revoked) {
    return "分享者已撤销这个链接。";
  }
  if (meta.expired) {
    return "这个分享链接已经过期。";
  }
  return "这个分享链接暂时无法访问。";
}
