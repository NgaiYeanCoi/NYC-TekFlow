import { auth } from "@/auth";
import { AttachmentManager } from "@/components/dashboard/attachment-manager";
import { apiFetch } from "@/lib/api/client";
import type { Attachment } from "@/types/tekflow";

export const dynamic = "force-dynamic";

export default async function AttachmentsPage() {
  const session = await auth();
  const token = session?.accessToken ?? "";
  const items = await apiFetch<Attachment[]>("/api/v1/admin/attachments", { token }).catch(() => []);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">附件管理</h1>
        <p className="mt-2 text-sm text-muted-foreground">上传、查看并通过受控接口访问附件。</p>
      </div>
      <AttachmentManager token={token} items={items} />
    </div>
  );
}

