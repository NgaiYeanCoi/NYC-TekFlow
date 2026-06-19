import { auth } from "@/auth";
import { AttachmentManager } from "@/components/dashboard/attachment-manager";
import { apiFetch } from "@/lib/api/client";
import { getAdminPosts } from "@/lib/api/queries";
import type { Attachment } from "@/types/tekflow";

export const dynamic = "force-dynamic";

export default async function AttachmentsPage() {
  const session = await auth();
  const token = session?.accessToken ?? "";
  const [items, postsPage] = await Promise.all([
    apiFetch<Attachment[]>("/api/v1/admin/attachments", { token }).catch(() => []),
    getAdminPosts(token, { page: 1, pageSize: 100 }).catch(() => null),
  ]);
  const posts = postsPage?.items ?? [];
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-semibold">附件管理</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">上传、归档并查看与内容关联的附件资料。</p>
      </div>
      <AttachmentManager token={token} items={items} posts={posts} />
    </div>
  );
}
