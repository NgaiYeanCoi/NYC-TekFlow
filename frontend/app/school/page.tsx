import { PaginationControls } from "@/components/common/pagination-controls";
import { PublicShell } from "@/components/layout/public-shell";
import { SchoolBoard } from "@/components/public/school-board";
import { SchoolFilters } from "@/components/public/school-filters";
import { getSchoolNotices } from "@/lib/api/queries";
import { firstParam, readSearchParams } from "@/lib/route";

export const dynamic = "force-dynamic";

export default async function SchoolPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await readSearchParams(searchParams);
  const courseName = firstParam(params.courseName);
  const noticeStatus = firstParam(params.noticeStatus);
  const noticePriority = firstParam(params.noticePriority);
  const fromDate = firstParam(params.fromDate);
  const toDate = firstParam(params.toDate);
  const page = Number(firstParam(params.page) ?? 1) || 1;
  const pageSize = 20;
  const result = await getSchoolNotices({ courseName, noticeStatus, noticePriority, fromDate, toDate, page, pageSize }).catch(() => null);
  return (
    <PublicShell>
      <SchoolBoard
        posts={result?.items ?? []}
        total={result?.total}
        filters={<SchoolFilters courseName={courseName} noticeStatus={noticeStatus} noticePriority={noticePriority} fromDate={fromDate} toDate={toDate} />}
        pagination={
          result ? (
            <PaginationControls
              pathname="/school"
              params={{ courseName, noticeStatus, noticePriority, fromDate, toDate, pageSize }}
              page={result.page}
              pageSize={result.pageSize}
              total={result.total}
            />
          ) : null
        }
      />
    </PublicShell>
  );
}
