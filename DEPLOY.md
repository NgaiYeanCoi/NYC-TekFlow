# TekFlow 本地运行说明

## 环境要求

- Node.js 24+
- Bun 1.3+
- Java 21.0.4+
- 本机 MySQL 8.0.45

本项目不使用 Docker。以下命令默认在仓库根目录 `D:\MyGithubProject\NYC-TekFlow` 下执行，Windows 环境优先使用 PowerShell。

## 本地环境变量

本地联调统一使用仓库根目录的 `.env.local`。该文件保存本机数据库密码、JWT secret、NextAuth secret 和本地管理员初始化密码，不要提交到 Git。

首次创建：

```powershell
if (-not (Test-Path .env.local)) {
  Copy-Item .env.example .env.local
}
git check-ignore -v .env.local
```

`git check-ignore` 应显示 `.env.local` 被忽略；如果没有输出，先检查 `.gitignore`。

### 必填变量

`.env.local` 至少需要包含：

```text
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/tekflow?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your-local-mysql-password
TEKFLOW_JWT_SECRET=generated-local-secret
TEKFLOW_JWT_EXPIRES_MINUTES=1440
TEKFLOW_UPLOAD_DIR=./uploads
TEKFLOW_ADMIN_USERNAME=admin
TEKFLOW_ADMIN_PASSWORD=your-local-admin-password
AUTH_SECRET=generated-local-secret
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

不要把真实密码或真实 secret 写入 `.env.example`、`DEPLOY.md` 或其他会提交的文件。

### 生成 Secret

分别运行两次，为 `AUTH_SECRET` 和 `TEKFLOW_JWT_SECRET` 生成不同值：

```powershell
$bytes = New-Object byte[] 48
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

### 加载 `.env.local`

后端和前端都可以复用同一段 PowerShell，在当前终端会话中加载根目录 `.env.local`：

```powershell
$envFile = Join-Path (Get-Location) ".env.local"
Get-Content -LiteralPath $envFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -and -not $line.StartsWith("#")) {
    $parts = $line -split "=", 2
    if ($parts.Count -eq 2) {
      $key = $parts[0].Trim()
      $value = $parts[1].Trim()
      if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
        $value = $value.Substring(1, $value.Length - 2)
      }
      Set-Item -Path "Env:$key" -Value $value
    }
  }
}
```

环境变量只对当前 PowerShell 会话生效。后端和前端如果使用两个终端启动，需要在两个终端里分别加载一次。

加载后可只检查变量是否存在，不要打印 secret 或密码：

```powershell
@(
  "SPRING_DATASOURCE_URL",
  "SPRING_DATASOURCE_USERNAME",
  "SPRING_DATASOURCE_PASSWORD",
  "TEKFLOW_JWT_SECRET",
  "TEKFLOW_ADMIN_USERNAME",
  "TEKFLOW_ADMIN_PASSWORD",
  "AUTH_SECRET",
  "AUTH_URL",
  "NEXT_PUBLIC_API_BASE_URL"
) | ForEach-Object {
  if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($_))) {
    Write-Error "Missing env var: $_"
  }
}
```

## 数据库

先加载 `.env.local`，再检查 MySQL 是否能连接。默认数据库名为 `tekflow`；如果你修改了 `SPRING_DATASOURCE_URL` 中的库名，请同步修改下面的 `--database` 值。

```powershell
$env:MYSQL_PWD = $env:SPRING_DATASOURCE_PASSWORD
mysql -u $env:SPRING_DATASOURCE_USERNAME --database=tekflow --execute="SELECT VERSION(), DATABASE();"
Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
```

如果目标库还不存在，先导入 schema。`docs/schema.sql` 会创建并切换到 `tekflow` 数据库：

```powershell
$env:MYSQL_PWD = $env:SPRING_DATASOURCE_PASSWORD
mysql -u $env:SPRING_DATASOURCE_USERNAME --execute="source docs/schema.sql"
mysql -u $env:SPRING_DATASOURCE_USERNAME --execute="source docs/seed-demo.sql"
Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
```

`docs/seed-demo.sql` 中的管理员密码 hash 是占位值。真实本地登录使用 `.env.local` 的 `TEKFLOW_ADMIN_USERNAME` 和 `TEKFLOW_ADMIN_PASSWORD`，后端启动时会创建或更新本地管理员密码。

## 后端

在同一个 PowerShell 会话中先加载 `.env.local`，再启动后端：

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

默认后端地址：

```text
http://localhost:8080
```

Swagger UI：

```text
http://localhost:8080/swagger-ui.html
```

如果启动失败，先确认：

- `.env.local` 已加载到当前 PowerShell 会话。
- MySQL 正在运行。
- `SPRING_DATASOURCE_USERNAME` 和 `SPRING_DATASOURCE_PASSWORD` 可连接本机 MySQL。
- `tekflow` 数据库已导入 schema。
- `TEKFLOW_JWT_SECRET` 长度至少 32 个字符。

## 前端

Next.js 默认读取前端工程目录内的 `frontend/.env.local`。本项目本地联调优先使用根目录 `.env.local`，因此需要在同一个 PowerShell 会话中先加载根目录 `.env.local`，再启动前端。

```powershell
cd frontend
bun install
bun dev
```

默认前端地址：

```text
http://localhost:3000
```

如果你选择使用 `frontend/.env.local`，至少需要包含：

```text
AUTH_SECRET=generated-local-secret
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

不要把 `frontend/.env.local` 提交到 Git。

## 联调检查

后端和前端都启动后，按以下顺序验收：

- 打开 `http://localhost:8080/swagger-ui.html`，确认 Swagger UI 可访问。
- 打开 `http://localhost:3000/login`，使用 `.env.local` 的管理员账号登录。
- 进入 `/dashboard/posts/new` 创建一篇 `public + published` 内容，确认 `/wiki` 和 `/wiki/[slug]` 可访问。
- 创建一篇 `school_notice + school + published` 内容，填写 event date、start time、end time、deadline、course、teacher、priority，确认 `/school` 和 `/school/[slug]` 可访问。
- 创建一篇 `unlisted + published` 内容，确认 `/share/[slug]` 可访问，但不会出现在 `/wiki`、`/school` 或首页公开列表中。
- 创建一篇 `private` 内容，确认游客公开页面无法访问。
- 在 `/dashboard/attachments` 给 Post 上传附件，确认附件统一通过 `/api/v1/attachments/{id}` 受控访问。

如果 `.env.local` 无法连接 MySQL，暂停联调，先修正数据库地址、用户名、密码或库初始化状态。

## 验证

后端：

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd package
```

前端：

```powershell
cd frontend
bun run typecheck
bun run lint
bun run build
```

敏感信息检查：

```powershell
rg "client[-]secret|secret[-]key|DB_PASSW[O]RD|MAIL_PASSW[O]RD|ACCESS[_]KEY|生产密[码]|真实[ ]IP|真实I[P]" AGENTS.md docs DEPLOY.md
git status --short -- .env.local frontend/.env.local backend/.env
git check-ignore -v .env.local
```

`git status --short -- .env.local frontend/.env.local backend/.env` 不应显示需要提交的本地环境文件。

## 访问策略

- `/dashboard` 需要管理员登录。
- `/wiki` 只展示 public + published 内容。
- `/school` 只展示 school + published + school_notice 内容。
- `/share/[slug]` 只展示 unlisted + published 内容。
- 附件统一通过 `/api/v1/attachments/{id}` 访问，后端按所属 Post 权限判断。
