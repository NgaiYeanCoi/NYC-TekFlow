import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSummary } from "@/lib/api/queries";

export default async function SettingsPage() {
  const session = await auth();
  const summary = await getAdminSummary(session?.accessToken ?? "").catch(() => null);
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-semibold">设置</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">当前账号和工作台使用概览。</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>账号信息</CardTitle>
          <CardDescription>当前登录管理员。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div>名称：{session?.user.name}</div>
          <div>用户名：{session?.user.username}</div>
          <div>角色：{session?.user.role}</div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>工作台概览</CardTitle>
          <CardDescription>当前版本的基础使用信息和内容统计。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div>内容总数：{summary?.totalPosts ?? "-"}</div>
          <div>公开内容：{summary?.publicPosts ?? "-"}</div>
          <div>学校事项：{summary?.schoolNoticePosts ?? "-"}</div>
          <div>附件数量：{summary?.attachments ?? "-"}</div>
          <div>分类 / 标签 / 项目：{summary ? `${summary.categories} / ${summary.tags} / ${summary.projects}` : "-"}</div>
          <div>附件上限：20MB</div>
          <div>主题：浅色主题</div>
          <div>写作：Markdown 内容整理</div>
          <div>事项：学校事项提醒</div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
