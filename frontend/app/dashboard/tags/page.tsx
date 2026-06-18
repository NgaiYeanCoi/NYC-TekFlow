import { auth } from "@/auth";
import { EntityManager } from "@/components/dashboard/entity-manager";
import { getTaxonomies } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const session = await auth();
  const data = await getTaxonomies(session?.accessToken ?? "").catch(() => ({ categories: [], tags: [], projects: [] }));
  return <EntityManager token={session?.accessToken ?? ""} kind="tags" title="标签" description="用于一篇内容关联多个主题。" items={data.tags} />;
}

