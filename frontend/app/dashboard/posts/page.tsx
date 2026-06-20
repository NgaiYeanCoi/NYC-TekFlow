import { auth } from "@/auth";
import { PaginationControls } from "@/components/common/pagination-controls";
import { PostFilters } from "@/components/dashboard/post-filters";
import { PostTable } from "@/components/dashboard/post-table";
import { firstParam, readSearchParams } from "@/lib/route";
import { getAdminPosts, getTaxonomies } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function PostsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await auth();
  const params = await readSearchParams(searchParams);
  const keyword = firstParam(params.keyword);
  const status = firstParam(params.status);
  const visibility = firstParam(params.visibility);
  const type = firstParam(params.type);
  const categoryId = firstParam(params.categoryId);
  const projectId = firstParam(params.projectId);
  const tagId = firstParam(params.tagId);
  const page = Number(firstParam(params.page) ?? 1) || 1;
  const pageSize = 20;
  const token = session?.accessToken ?? "";
  const [posts, taxonomies] = await Promise.all([
    getAdminPosts(token, {
      keyword,
      status,
      visibility,
      type,
      categoryId,
      projectId,
      tagId,
      page,
      pageSize,
    }).catch(() => ({ items: [], total: 0, page: 1, pageSize })),
    getTaxonomies(token).catch(() => ({ categories: [], tags: [], projects: [] })),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">管理全部状态和可见性的内容。</p>
      </div>
      <PostFilters
        keyword={keyword}
        visibility={visibility}
        status={status}
        type={type}
        categoryId={categoryId}
        projectId={projectId}
        tagId={tagId}
        taxonomies={taxonomies}
      />
      <PostTable posts={posts.items} />
      <PaginationControls
        pathname="/dashboard/posts"
        params={{ keyword, status, visibility, type, categoryId, projectId, tagId, pageSize }}
        page={posts.page}
        pageSize={posts.pageSize}
        total={posts.total}
      />
    </div>
  );
}
