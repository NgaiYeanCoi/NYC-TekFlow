"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api/client";
import { formatBytes } from "@/lib/format";
import type { Attachment } from "@/types/tekflow";

export function ShareAttachmentDownload({
  attachment,
  token,
  accessCode,
}: {
  attachment: Attachment;
  token: string;
  accessCode?: string;
}) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  async function download() {
    setPending(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/share/posts/${token}/attachments/${attachment.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode: accessCode || "" }),
      });
      if (!response.ok) {
        throw new Error("附件下载失败");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = attachment.originalName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "附件下载失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border px-3 py-2 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate">{attachment.originalName}</span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-muted-foreground">{formatBytes(attachment.size)}</span>
          <Button type="button" variant="ghost" size="sm" onClick={download} disabled={pending}>
            <DownloadIcon data-icon="inline-start" />
            {pending ? "下载中" : "下载"}
          </Button>
        </div>
      </div>
      {error ? <p className="text-xs text-destructive" role="alert">{error}</p> : null}
    </div>
  );
}
