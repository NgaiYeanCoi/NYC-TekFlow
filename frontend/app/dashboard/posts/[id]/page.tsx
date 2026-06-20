import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { auth } from "@/auth";
import { PostForm } from "@/components/dashboard/post-form";
import { ShareManager } from "@/components/dashboard/share-manager";
import { buttonVariants } from "@/components/ui/button";
import { publicPostHref } from "@/lib/post-display";
import { getAdminPost, getAdminShare, getTaxonomies } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const token = session?.accessToken ?? "";
  const [post, taxonomies, share] = await Promise.all([
    getAdminPost(token, Number(id)).catch(() => null),
    getTaxonomies(token).catch(() => ({ categories: [], tags: [], projects: [] })),
    getAdminShare(token, Number(id)).catch(() => null),
  ]);
  if (!post) {
    notFound();
  }
  const publicHref = publicPostHref(post);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold">编辑内容</h1>
          <p className="mt-2 text-sm text-muted-foreground">修改正文、分类、状态和可见性。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/posts" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeftIcon data-icon="inline-start" />
            返回列表
          </Link>
          {publicHref ? (
            <Link href={publicHref} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <ExternalLinkIcon data-icon="inline-start" />
              查看展示页
            </Link>
          ) : null}
        </div>
      </div>
      <PostForm token={token} post={post} taxonomies={taxonomies} />
      <ShareManager
        token={token}
        post={post}
        initialShare={
          share ?? {
            postId: post.id,
            token: null,
            status: "none",
            active: false,
            hasAccessCode: false,
            expiresAt: null,
            expired: false,
            accessCount: 0,
            attachmentDownloadCount: 0,
            lastAccessedAt: null,
            revokedAt: null,
            createdAt: null,
            updatedAt: null,
          }
        }
      />
    </div>
  );
}
