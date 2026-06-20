import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { auth } from "@/auth";
import { PostForm } from "@/components/dashboard/post-form";
import { buttonVariants } from "@/components/ui/button";
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
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold">新建内容</h1>
          <p className="mt-2 text-sm text-muted-foreground">创建普通内容或学校事项。</p>
        </div>
        <Link href="/dashboard/posts" className={buttonVariants({ variant: "outline", size: "sm" })}>
          <ArrowLeftIcon data-icon="inline-start" />
          返回列表
        </Link>
      </div>
      <PostForm token={session?.accessToken ?? ""} taxonomies={taxonomies} defaultType={(firstParam(params.type) as PostType) || "tech_note"} />
    </div>
  );
}
