import { auth } from "@/auth";
import { EntityManager } from "@/components/dashboard/entity-manager";
import { getTaxonomies } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const session = await auth();
  const data = await getTaxonomies(session?.accessToken ?? "").catch(() => ({ categories: [], tags: [], projects: [] }));
  return <EntityManager token={session?.accessToken ?? ""} kind="projects" title="项目标签" description="用于把内容归属到项目记录。" items={data.projects} />;
}

