import { PublicShell } from "@/components/layout/public-shell";
import { SchoolBoard } from "@/components/public/school-board";
import { getSchoolNotices } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function SchoolPage() {
  const result = await getSchoolNotices({ page: 1, pageSize: 50 }).catch(() => null);
  return (
    <PublicShell>
      <SchoolBoard posts={result?.items ?? []} />
    </PublicShell>
  );
}

