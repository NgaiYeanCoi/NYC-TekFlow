import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/auth";
import { PostTable } from "@/components/dashboard/post-table";
import { getAdminPosts } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function SchoolAdminPage() {
  const session = await auth();
  const posts = await getAdminPosts(session?.accessToken ?? "", {
    type: "school_notice",
    visibility: "school",
    page: 1,
    pageSize: 30,
  }).catch(() => ({ items: [], total: 0, page: 1, pageSize: 30 }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">School Notice 管理</h1>
          <p className="mt-2 text-sm text-muted-foreground">维护课程、截止时间、地点和优先级。</p>
        </div>
        <Link href="/dashboard/posts/new?type=school_notice" className={buttonVariants()}>
          新建 School Notice
        </Link>
      </div>
      <PostTable posts={posts.items} title="School Notices" />
    </div>
  );
}

