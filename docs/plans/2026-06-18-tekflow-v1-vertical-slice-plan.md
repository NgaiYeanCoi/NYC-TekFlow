# TekFlow V1.0.0 纵向闭环实施计划

## 当前背景

仓库已初始化 Git，当前已有 `AGENTS.md`、PRD、API 摘要、数据库 schema、seed 和设计文档。本轮正在新增 `frontend/`、`backend/` 和本地运行说明。

## 目标

实施第一轮真实全栈闭环：Next.js 前端、Spring Boot 后端、MySQL 数据库、JWT 登录、后台保护、公开知识库、学校事项板、unlisted 链接访问和附件受控访问。

## 计划改动

- 新增 `backend/`，使用 Java 21、Spring Boot 3.5.x、Spring Security JWT、Spring AOP、MyBatis-Plus、MySQL、OpenAPI/Swagger。
- 新增 `frontend/`，使用 Next.js 16 App Router、React 19、TypeScript strict mode、Tailwind CSS v4、shadcn/ui 风格组件、lucide-react、React Query、Redux Toolkit、redux-persist、NextAuth v5 Credentials。
- 后端基础包名使用 `xyz.nyc.tekflow`。
- 数据库使用用户本机 MySQL；本项目不引入 Docker 配置。
- API 统一 `/api/v1` 前缀和 `{ code, msg, data }` 响应结构。
- 列表接口统一 `data={ items, total, page, pageSize }`。
- 权限和 visibility 过滤在后端 Service 层兜底。
- 前端视觉沿用 `docs/design`，不额外生成概念图。

## 涉及文件

- `backend/`
- `frontend/`
- `.gitignore`
- `.env.example`
- `DEPLOY.md`

## 验证方式

- 后端：`backend\mvnw.cmd test`、`backend\mvnw.cmd package`。
- 前端：`bun install`、`bun run lint`、`bun run build`。
- 安全检查：运行文档中的敏感信息扫描命令。
- 手工验收：使用本机已有 MySQL，导入 `docs/schema.sql` 和 `docs/seed-demo.sql`，启动后端和前端，按 PRD 演示脚本验证登录、内容创建、公开展示、school 展示、unlisted 链接访问、private 隐藏和附件权限。

## 当前状态

已完成第一轮纵向闭环实施；后续需要接入本机 MySQL 环境做真实数据手工验收。
