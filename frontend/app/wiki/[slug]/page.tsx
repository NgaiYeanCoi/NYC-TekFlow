import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { ArticleView } from "@/components/public/article-view";
import { getWikiPost } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function WikiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getWikiPost(slug).catch(() => null);
  if (!post) {
    notFound();
  }
  return (
    <PublicShell>
      <ArticleView post={post} />
    </PublicShell>
  );
}

