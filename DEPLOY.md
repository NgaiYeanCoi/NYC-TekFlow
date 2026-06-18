# TekFlow 本地运行说明

## 环境要求

- Node.js 24+
- Bun 1.3+
- Java 21.0.4+
- 本机 MySQL 8.0.45

本项目不使用 Docker。

## 数据库

创建并初始化本机 MySQL 数据库：

```bash
mysql -u root -p < docs/schema.sql
mysql -u root -p < docs/seed-demo.sql
```

`docs/seed-demo.sql` 中的管理员密码 hash 是占位值。真实本地登录建议通过后端环境变量初始化：

```bash
set TEKFLOW_ADMIN_USERNAME=admin
set TEKFLOW_ADMIN_PASSWORD=your-local-password
```

## 后端

Windows：

```bash
cd backend
set SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/tekflow?useUnicode=true^&characterEncoding=utf8^&useSSL=false^&serverTimezone=Asia/Shanghai^&allowPublicKeyRetrieval=true
set SPRING_DATASOURCE_USERNAME=root
set SPRING_DATASOURCE_PASSWORD=your-local-mysql-password
set TEKFLOW_JWT_SECRET=change-this-local-development-secret-at-least-32-chars
set TEKFLOW_UPLOAD_DIR=./uploads
mvnw.cmd spring-boot:run
```

默认后端地址：

```text
http://localhost:8080
```

Swagger UI：

```text
http://localhost:8080/swagger-ui.html
```

## 前端

```bash
cd frontend
bun install
set AUTH_SECRET=change-this-nextauth-local-secret-at-least-32-chars
set AUTH_URL=http://localhost:3000
set NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
bun dev
```

默认前端地址：

```text
http://localhost:3000
```

## 验证

后端：

```bash
cd backend
mvnw.cmd test
mvnw.cmd package
```

前端：

```bash
cd frontend
bun run typecheck
bun run lint
bun run build
```

敏感信息检查：

```bash
rg "client[-]secret|secret[-]key|DB_PASSW[O]RD|MAIL_PASSW[O]RD|ACCESS[_]KEY|生产密[码]|真实[ ]IP|真实I[P]" AGENTS.md docs
```

## 访问策略

- `/dashboard` 需要管理员登录。
- `/wiki` 只展示 public + published 内容。
- `/school` 只展示 school + published + school_notice 内容。
- `/share/[slug]` 只展示 unlisted + published 内容。
- 附件统一通过 `/api/v1/attachments/{id}` 访问，后端按所属 Post 权限判断。
