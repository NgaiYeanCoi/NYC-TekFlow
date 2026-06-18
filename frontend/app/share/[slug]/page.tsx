import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { ArticleView } from "@/components/public/article-view";
import { getSharePost } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getSharePost(slug).catch(() => null);
  if (!post) {
    notFound();
  }
  return (
    <PublicShell>
      <ArticleView post={post} unlisted />
    </PublicShell>
  );
}

