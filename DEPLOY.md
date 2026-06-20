# TekFlow 本地运行说明

## 环境要求

- Node.js 24+
- Bun 1.3+
- Java 21.0.4+
- Maven 3.9+
- 本机 MySQL 8.0.45

本项目不使用 Docker。以下命令默认在仓库根目录 `D:\MyGithubProject\NYC-TekFlow` 下执行，Windows 环境优先使用 PowerShell。

## 本地配置文件

后端和前端配置分开维护，不再使用根目录 `.env.local`。

- 后端：`backend/src/main/resources/application-dev.yml`
- 前端：`frontend/.env.local`

根目录 `.env.example` 仅保留迁移提示，不再作为本地运行配置模板。

## 后端配置

后端使用 Spring Boot profile 配置。`backend/src/main/resources/application-dev.yml` 是提交到仓库的本地开发占位模板；本机联调前需要把其中占位值改成你的本机配置，但不要提交真实数据库密码、真实 secret 或真实管理员密码。

必填配置项：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tekflow?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: your-local-mysql-password

tekflow:
  jwt-secret: change-this-local-development-secret-at-least-32-chars
  jwt-expires-minutes: 1440
  upload-dir: ./uploads
  admin-username: admin
  admin-password: your-local-admin-password
```

生成 `tekflow.jwt-secret`：

```powershell
$bytes = New-Object byte[] 48
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

## 前端配置

前端使用 Next.js 默认环境文件。首次本地运行前创建 `frontend/.env.local`：

```powershell
Copy-Item frontend\.env.example frontend\.env.local
```

`frontend/.env.local` 至少包含：

```text
AUTH_SECRET=generated-local-secret
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

生成 `AUTH_SECRET`：

```powershell
$bytes = New-Object byte[] 48
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

不要提交 `frontend/.env.local`。

## 数据库

默认数据库名为 `tekflow`。首次本地演示可导入 schema 和 seed：

```powershell
mysql -u root -p --execute="source docs/schema.sql"
mysql -u root -p --execute="source docs/seed-demo.sql"
```

检查连接：

```powershell
mysql -u root -p --database=tekflow --execute="SELECT VERSION(), DATABASE();"
```

`docs/seed-demo.sql` 中的管理员密码 hash 是占位值。真实本地登录使用 `application-dev.yml` 的 `tekflow.admin-username` 和 `tekflow.admin-password`，后端启动时会创建或更新本地管理员密码。

## 后端启动

当前后端是单模块 Maven 工程，在 `backend/` 目录直接使用全局 Maven：

```powershell
cd backend
mvn spring-boot:run -D spring-boot.run.profiles=dev
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

- `application-dev.yml` 已填写本机 MySQL 密码、JWT secret 和管理员初始化密码。
- MySQL 正在运行。
- `tekflow` 数据库已导入 schema。
- `tekflow.jwt-secret` 长度至少 32 个字符。

## 前端启动

前端不需要启动脚本，直接使用 Bun：

```powershell
cd frontend
bun install
bun dev
```

默认前端地址：

```text
http://localhost:3000
```

## 联调检查

后端和前端都启动后，按以下顺序验收：

- 打开 `http://localhost:8080/swagger-ui.html`，确认 Swagger UI 可访问。
- 打开 `http://localhost:3000/login`，使用 `application-dev.yml` 的管理员账号登录。
- 进入 `/dashboard/posts/new` 创建一篇 `public + published` 内容，确认 `/wiki` 和 `/wiki/[slug]` 可访问。
- 创建一篇 `school_notice + school + published` 内容，确认 `/school` 和 `/school/[slug]` 可访问。
- 创建一篇 `unlisted + published` 内容，确认 `/share/[slug]` 可访问，但不会出现在 `/wiki`、`/school` 或首页公开列表中。
- 创建一篇 `private` 内容，确认游客公开页面无法访问。
- 在 `/dashboard/attachments` 给 Post 上传附件，确认附件统一通过 `/api/v1/attachments/{id}` 受控访问。
- 重新导入 `docs/seed-demo.sql` 后，示例附件路径指向 `docs/demo-attachments/`。按 `cd backend` 方式启动后端时，public、school 和 unlisted 示例附件应可通过受控接口下载，private 示例附件游客访问应返回拒绝或不存在。

## 验证

后端：

```powershell
cd backend
mvn test
mvn package
```

如果 Windows 上 `mvn package` 提示无法重命名 `target/*.jar`，通常是旧的后端进程或文件索引器占用了产物。先停止正在运行的 TekFlow 后端，再重试打包。

前端：

```powershell
cd frontend
bun run typecheck
bun run lint
bun run build
```

如果 Windows 上 `bun run build` 提示无法删除 `.next` 下的文件，通常是旧的 Next.js dev/build 进程占用了缓存。先停止前端进程；必要时只清理被 `.gitignore` 忽略的 `frontend/.next/` 后再重试。

敏感信息检查：

```powershell
rg "client[-]secret|secret[-]key|DB_PASSW[O]RD|MAIL_PASSW[O]RD|ACCESS[_]KEY|生产密[码]|真实[ ]IP|真实I[P]" AGENTS.md docs DEPLOY.md backend/src/main/resources/application-dev.yml frontend/.env.example
git status --short -- .env.local frontend/.env.local backend/.env backend/.env.local
git check-ignore -v frontend/.env.local
```

`git status --short -- .env.local frontend/.env.local backend/.env backend/.env.local` 不应显示需要提交的本地环境文件。

## 访问策略

- `/dashboard` 需要管理员登录。
- `/wiki` 只展示 public + published 内容。
- `/school` 只展示 school + published + school_notice 内容。
- `/share/[slug]` 只展示 unlisted + published 内容。
- 附件统一通过 `/api/v1/attachments/{id}` 访问，后端按所属 Post 权限判断。
