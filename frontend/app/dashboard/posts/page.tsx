import { auth } from "@/auth";
import { PostTable } from "@/components/dashboard/post-table";
import { Input } from "@/components/ui/input";
import { firstParam, readSearchParams } from "@/lib/route";
import { getAdminPosts } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function PostsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await auth();
  const params = await readSearchParams(searchParams);
  const keyword = firstParam(params.keyword);
  const posts = await getAdminPosts(session?.accessToken ?? "", {
    keyword,
    status: firstParam(params.status),
    visibility: firstParam(params.visibility),
    type: firstParam(params.type),
    page: firstParam(params.page) ?? 1,
    pageSize: 20,
  }).catch(() => ({ items: [], total: 0, page: 1, pageSize: 20 }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Posts</h1>
        <p className="mt-2 text-sm text-muted-foreground">管理全部状态和可见性的内容。</p>
      </div>
      <form className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4">
        <Input name="keyword" defaultValue={keyword} placeholder="搜索标题、摘要、正文" />
        <select name="visibility" defaultValue={firstParam(params.visibility) ?? ""} className="h-10 rounded-md border border-input bg-card px-3 text-sm">
          <option value="">全部可见性</option>
          <option value="private">private</option>
          <option value="public">public</option>
          <option value="school">school</option>
          <option value="unlisted">unlisted</option>
        </select>
        <select name="status" defaultValue={firstParam(params.status) ?? ""} className="h-10 rounded-md border border-input bg-card px-3 text-sm">
          <option value="">全部状态</option>
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </select>
        <select name="type" defaultValue={firstParam(params.type) ?? ""} className="h-10 rounded-md border border-input bg-card px-3 text-sm">
          <option value="">全部类型</option>
          <option value="tech_note">tech_note</option>
          <option value="ops_manual">ops_manual</option>
          <option value="study_note">study_note</option>
          <option value="project_record">project_record</option>
          <option value="school_notice">school_notice</option>
        </select>
      </form>
      <PostTable posts={posts.items} />
    </div>
  );
}

