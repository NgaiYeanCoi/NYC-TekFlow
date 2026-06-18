import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PostForm } from "@/components/dashboard/post-form";
import { getAdminPost, getTaxonomies } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const token = session?.accessToken ?? "";
  const [post, taxonomies] = await Promise.all([
    getAdminPost(token, Number(id)).catch(() => null),
    getTaxonomies(token).catch(() => ({ categories: [], tags: [], projects: [] })),
  ]);
  if (!post) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">编辑内容</h1>
        <p className="mt-2 text-sm text-muted-foreground">修改正文、分类、状态和可见性。</p>
      </div>
      <PostForm token={token} post={post} taxonomies={taxonomies} />
    </div>
  );
}

