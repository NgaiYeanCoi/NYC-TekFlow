import { auth } from "@/auth";
import { PostForm } from "@/components/dashboard/post-form";
import { firstParam, readSearchParams } from "@/lib/route";
import { getTaxonomies } from "@/lib/api/queries";
import type { PostType } from "@/types/tekflow";

export const dynamic = "force-dynamic";

export default async function NewPostPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await auth();
  const params = await readSearchParams(searchParams);
  const taxonomies = await getTaxonomies(session?.accessToken ?? "").catch(() => ({ categories: [], tags: [], projects: [] }));
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">新建内容</h1>
        <p className="mt-2 text-sm text-muted-foreground">创建普通 Post 或 School Notice。</p>
      </div>
      <PostForm token={session?.accessToken ?? ""} taxonomies={taxonomies} defaultType={(firstParam(params.type) as PostType) || "tech_note"} />
    </div>
  );
}

