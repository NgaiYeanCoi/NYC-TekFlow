import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { PaginationControls } from "@/components/common/pagination-controls";
import { PublicShell } from "@/components/layout/public-shell";
import { PostCard } from "@/components/public/post-card";
import { WikiFilters } from "@/components/public/wiki-filters";
import { firstParam, readSearchParams } from "@/lib/route";
import { getPublicTaxonomies, getWikiPosts } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function WikiPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await readSearchParams(searchParams);
  const keyword = firstParam(params.keyword);
  const categoryId = firstParam(params.categoryId);
  const tagId = firstParam(params.tagId);
  const projectId = firstParam(params.projectId);
  const page = Number(firstParam(params.page) ?? 1) || 1;
  const pageSize = 12;
  const [result, taxonomies] = await Promise.all([
    getWikiPosts({ keyword, categoryId, tagId, projectId, page, pageSize }).catch(() => null),
    getPublicTaxonomies().catch(() => ({ categories: [], tags: [], projects: [] })),
  ]);
  const posts = result?.items ?? [];

  return (
    <PublicShell>
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h1 className="text-2xl font-semibold">公开知识库</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">阅读整理后的技术笔记、学习资料和项目复盘。</p>
          </div>
          <WikiFilters keyword={keyword} categoryId={categoryId} tagId={tagId} projectId={projectId} taxonomies={taxonomies} />
        </aside>
        <section className="grid gap-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} href={`/wiki/${post.slug}`} />)
          ) : (
            <Empty>
              <EmptyTitle>暂无公开内容</EmptyTitle>
              <EmptyDescription>有公开文章后会显示在这里。</EmptyDescription>
            </Empty>
          )}
          {result ? (
            <PaginationControls
              pathname="/wiki"
              params={{ keyword, categoryId, tagId, projectId, pageSize }}
              page={result.page}
              pageSize={result.pageSize}
              total={result.total}
            />
          ) : null}
        </section>
      </main>
    </PublicShell>
  );
}
