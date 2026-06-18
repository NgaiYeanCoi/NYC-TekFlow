import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { PublicShell } from "@/components/layout/public-shell";
import { PostCard } from "@/components/public/post-card";
import { firstParam, readSearchParams } from "@/lib/route";
import { getWikiPosts } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function WikiPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await readSearchParams(searchParams);
  const keyword = firstParam(params.keyword);
  const result = await getWikiPosts({ keyword, page: firstParam(params.page) ?? 1, pageSize: 12 }).catch(() => null);
  const posts = result?.items ?? [];

  return (
    <PublicShell>
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Wiki</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">公开知识库只展示 public + published 内容。</p>
          </div>
          <form className="flex flex-col gap-3">
            <Input name="keyword" defaultValue={keyword} placeholder="搜索公开内容" />
          </form>
        </aside>
        <section className="grid gap-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} href={`/wiki/${post.slug}`} />)
          ) : (
            <Empty>
              <EmptyTitle>暂无公开内容</EmptyTitle>
              <EmptyDescription>后端可用且存在 public published 内容后会显示在这里。</EmptyDescription>
            </Empty>
          )}
        </section>
      </main>
    </PublicShell>
  );
}

