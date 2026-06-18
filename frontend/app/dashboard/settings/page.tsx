import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">当前账号和 V1.0.0 系统边界摘要。</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>账号信息</CardTitle>
          <CardDescription>当前登录管理员。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div>名称：{session?.user.name}</div>
          <div>Username：{session?.user.username}</div>
          <div>角色：{session?.user.role}</div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>系统配置摘要</CardTitle>
          <CardDescription>V1.0.0 固定边界。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div>附件上限：20MB</div>
          <div>主题：浅色主题</div>
          <div>认证：NextAuth Credentials + 后端 JWT</div>
          <div>附件访问：统一受控接口</div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
