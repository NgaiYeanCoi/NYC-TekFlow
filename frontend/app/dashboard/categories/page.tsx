import { auth } from "@/auth";
import { EntityManager } from "@/components/dashboard/entity-manager";
import { getTaxonomies } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const session = await auth();
  const data = await getTaxonomies(session?.accessToken ?? "").catch(() => ({ categories: [], tags: [], projects: [] }));
  return <EntityManager token={session?.accessToken ?? ""} kind="categories" title="分类" description="用于内容归类和列表筛选。" items={data.categories} />;
}

