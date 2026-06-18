# AGENTS.md

本文件给代码代理提供本仓库的项目背景、工作约定和常用命令。内容以当前代码实际状态为准；当工程、脚本或技术栈后续落地后，必须同步更新本文件。

## 项目概述

`NYC-TekFlow` 是 TekFlow 个人知识工作台的项目仓库。TekFlow 用于管理技术沉淀、运维手册、学校通知、学习资料和项目记录，并支持私有内容、公开知识库、学校事项板和链接访问四类内容边界。

项目中文名：NYC的TekFlow 个人知识工作台。


前端技术栈:

- 前端：Next.js 16（App Router）
- UI：React 19、TypeScript strict mode、Tailwind CSS v4、shadcn/ui 风格基础组件、lucide-react
- 前端数据：统一 API client、React Query、Redux Toolkit + redux-persist
- 前端认证：NextAuth v5 beta Credentials，用于封装登录态、路由保护和后端 JWT 持久化

UI 设计规范和前端目录约定详见 `docs/design/readme.md`。

后端技术栈:
- 后端：Java 21.0.4、Spring Boot 3.5.x（初始目标 3.5.15）、Spring Security、Spring AOP、MyBatis-Plus
- API 风格：RESTful API
- 数据库：MySQL 8.0.45
- 附件：服务端本地文件存储，数据库保存附件元数据

构建工具：前端 Bun 包管理；后端 Maven Wrapper

以上为已确认技术栈；仓库已创建 `frontend/` Next.js 工程和 `backend/` Spring Boot 工程，并维护 PRD、设计文档、API 摘要、数据库 schema 和最小演示 seed 文档。

## 常用命令

前端工程位于 `frontend/`，默认使用 Bun：

```bash
cd frontend
bun install
bun dev
bun run build
bun run lint
bun run typecheck
```

Java 后端工程位于 `backend/`，优先使用项目内 Wrapper，避免依赖全局 Maven：

```bash
cd backend
./mvnw spring-boot:run
./mvnw test
./mvnw package
```

Windows 环境使用：

```bash
cd backend
mvnw.cmd spring-boot:run
mvnw.cmd test
mvnw.cmd package
```

数据库使用本机 MySQL 8.0.45；本仓库不使用 Docker。首次本地演示可导入：

```bash
mysql -u root -p < docs/schema.sql
mysql -u root -p < docs/seed-demo.sql
```

## 架构

### 路由结构

规划级路由：

- `/`：首页或产品入口。
- `/login`：登录入口。
- `/dashboard`：管理员后台首页。
- `/dashboard/posts`：内容列表。
- `/dashboard/posts/new`：新建内容。
- `/dashboard/posts/[id]`：编辑内容。
- `/dashboard/school`：School Notice 管理。
- `/dashboard/categories`：分类管理。
- `/dashboard/tags`：标签管理。
- `/dashboard/projects`：项目标签管理。
- `/dashboard/attachments`：附件管理。
- `/dashboard/settings`：设置。
- `/wiki`：公开知识库列表。
- `/wiki/[slug]`：公开知识文章详情。
- `/school`：学校事项板首页。
- `/school/[slug]`：学校通知详情。
- `/share/[slug]`：unlisted 内容持链接访问详情。

### 目录约定

前端工程采用：

- `app/`：Next.js App Router 页面、布局和路由分组。
- `components/ui/`：基础 UI 组件。
- `components/layout/`：导航、侧边栏、页脚、页面框架。
- `components/dashboard/`：后台工作台组件。
- `components/wiki/`：公开知识库组件。
- `components/school/`：学校事项板组件。
- `lib/api/`：统一 API client 和接口封装。
- `lib/hooks/`：React Query hooks、Redux hooks 和复用逻辑。
- `lib/utils/`：格式化、时间、状态、slug 等工具。
- `store/`：Redux Toolkit store、slice 和 redux-persist 配置。
- `types/`：前端共享类型。
- `public/`：公开静态资源。

后端工程采用：

- `controller/`：REST API 控制器。
- `service/`：业务逻辑。
- `mapper/`：MyBatis-Plus 数据访问。
- `entity/`：数据库实体。
- `dto/`：请求和响应对象。
- `common/`：统一响应、错误码、常量和枚举。
- `config/`：Spring Security、JWT、跨域、OpenAPI、文件上传配置。
- `aspect/`：Spring AOP 切面，用于日志、审计、性能监控和少量业务横切守卫。
- `utils/`：密码、时间、slug、文件处理工具。
- `resources/mapper/`：XML mapper，若最终采用 XML。

文档目录：

- `docs/PRD.md`：产品需求文档。
- `docs/API.md`：REST API 核心契约、认证规则、接口矩阵和 Swagger/OpenAPI 入口说明。
- `docs/schema.sql`：MySQL 建表脚本。
- `docs/seed-demo.sql`：最小演示数据 seed，不写真实密码或生产密钥。
- `DEPLOY.md`：后续补充运行和部署说明。

## 关键模式

- Next.js App Router 使用 Server Components 作为默认模式；只有交互、浏览器 API、表单状态或客户端 hooks 需要 `"use client"`。
- 后台表格筛选、公开列表搜索和 School 分区筛选优先通过 URL search params 表达，便于刷新恢复和分享。
- 前端统一通过 `lib/api/` 调用后端，不在页面组件里散落 fetch 细节。
- API 使用 RESTful 风格，统一响应结构为 `{ code, msg, data }`。成功使用 HTTP 200 + `code = 200`；认证、权限、校验和服务错误使用合适 HTTP 状态和非 200 业务 code。
- 列表接口统一分页结构为 `data={ items, total, page, pageSize }`。
- 客户端业务判断依赖 `code`、枚举字段和状态字段，不依赖中文 `msg`。
- React Query 负责服务端数据请求、缓存、刷新和错误状态。
- Redux Toolkit + redux-persist 只保存必要的客户端偏好或跨页面 UI 状态，不替代服务端数据缓存。
- NextAuth v5 beta Credentials 负责封装前端登录态、路由保护和后端 JWT 持久化。
- Java 后端使用 Spring Security + JWT 作为真实认证和授权主链路。
- Spring Security 使用 Filter Chain、JWT Filter 和 Method Security；后台接口要求管理员认证，公开接口仍必须在 Service 层按 `status`、`visibility` 和 `deleted_at` 做资源级过滤。
- Spring AOP 优先用于 API 访问日志、操作审计、权限拒绝记录、性能监控和少量横切业务守卫；不要把核心认证主链路或核心业务校验藏进切面。
- 管理员登录使用 `username` 和密码；User 模型中 `username` 必填唯一，`email` 仅作为可选资料字段。
- Post slug 由标题自动生成，管理员可编辑，后端做全局唯一校验。
- `type = school_notice` 必须绑定 `visibility = school`，school 内容发布前 event_date 或 deadline_at 至少一个存在。
- unlisted 内容通过 `/share/[slug]` 访问，不进入 `/wiki`、`/school` 或首页公开列表。
- 附件统一通过 `/api/v1/attachments/{id}` 受控访问，不提供绕过权限的静态公开附件路径。
- 固定状态和类型使用集中枚举或常量，不散落字符串。
- Tailwind 主题、颜色、间距和状态色后续集中维护在全局样式或设计 token 中。

## 内容、接口与状态

核心对象：

- `User`：管理员用户。
- `Post`：内容主体，包含普通文章和 School Notice 扩展字段。
- `Category`：分类。
- `Tag`：标签。
- `PostTag`：Post 与 Tag 多对多关系。
- `Project`：项目标签。
- `Attachment`：附件元数据。

核心枚举：

- `visibility`：`private`、`public`、`school`、`unlisted`。
- `type`：`tech_note`、`ops_manual`、`study_note`、`project_record`、`sop`、`review`、`tutorial`、`school_notice`。
- `status`：`draft`、`published`、`archived`。
- `notice_priority`：`normal`、`important`、`urgent`。
- `notice_status`：`upcoming`、`ongoing`、`done`、`expired`。

接口默认规则：

- RESTful API 统一前缀为 `/api/v1`。
- API 统一返回 `{ code, msg, data }`。
- Java 后端使用 Spring Security 完成真实认证和授权，登录成功后签发 JWT。
- 前端使用 NextAuth v5 beta Credentials 封装登录态、路由保护和后端 JWT 持久化。
- 前端业务请求通过统一 API client 携带 `Authorization: Bearer <token>`。
- 服务端必须再次校验权限和可见性，不能只靠前端隐藏入口。

AOP 默认规则：

- `controller..*Controller.*(..)` 切入点用于 API 访问日志、响应状态和异常摘要。
- `service..*Service.*(..)` 切入点用于业务耗时统计和关键操作审计。
- 自定义注解如 `@AuditAction`、`@PerfMonitor`、`@VisibilityGuard` 可用于精确控制审计、性能和资源访问记录。
- `@Before` 记录操作者、路径、资源 ID 或 slug；`@AfterReturning` 记录成功结果；`@AfterThrowing` 记录异常和权限拒绝；`@Around` 统计耗时；`@After` 清理 MDC/TraceId。
- AOP 可记录 public 发布、unlisted 访问、private 拒绝、附件下载、附件拒绝、后台写操作和慢接口，但不能替代 Spring Security 或 Service 层业务校验。

## 内容可见性规则

- `private`：只有管理员在后台可见，不允许通过公开 URL 访问。
- `public`：游客可见，只展示在 `/wiki` 和公开详情页。
- `school`：游客可访问，只展示在 `/school` 和学校通知详情页；无论是否公开，不能混入 private 内容。
- `unlisted`：有链接可访问，详情路由为 `/share/[slug]`，但不出现在 `/wiki`、`/school` 或首页公开列表中。
- 附件权限跟随所属 Post；所有附件访问统一走受控接口，不能让 private 附件通过静态公开 URL 泄露。

## 设计规范

- 产品气质：知识工作台，克制、清晰、长期可用。
- 布局优先级：后台信息密度高但不拥挤，公开页更适合阅读，School 页突出时间紧急程度。
- 响应式：移动端优先保证浏览、搜索、查看详情和后台基础编辑可用。
- V1.0.0 使用浅色主题，不实现暗色模式。
- UI 组件：优先使用明确控件，按钮、输入、筛选、分段控制、标签和状态徽标保持一致。
- 图标：优先使用 lucide-react。
- 卡片圆角控制在 8px 左右，避免过度装饰。
- 不使用营销式大面积 hero 作为后台首页。

## 安全规则

- 后台必须登录。
- private 内容不能通过 URL 直接访问。
- public 页面不能暴露 private 内容。
- school 页面不能显示 private 内容。
- 附件权限必须跟随 Post。
- 上传文件限制类型和大小；V1.0.0 默认允许常用图片、PDF、Office、Markdown/TXT、ZIP，单文件上限 20MB。
- 后台不要暴露错误堆栈。
- 密码必须 hash 存储。
- 不提交 `.env`、密钥、数据库密码或生产配置。
- 发布 public 内容前必须人工脱敏。

## 编码规范

- 先按 `docs/PRD.md` 实现，不要自由扩展未确认功能。
- 优先沿用后续工程中已经建立的组件、hooks、API client、服务层、数据访问层和目录组织。
- 修改接口、数据库、路由、权限或验收标准时，同步更新相关文档。
- 不要随意重构无关文件。
- 遇到未跟踪或已修改文件，默认认为是用户改动，不要回滚。
- 注释只写必要上下文，不写显而易见的解释。

## Plan Record Rules

- 仅当任务处于计划模式、用户明确要求先做计划、或需要输出 `<proposed_plan>` 级别的正式实施计划时，才必须在 `docs/plans/` 下创建或更新计划记录。
- 普通问答、简单解释、单步修复、环境检查、直接执行型小任务不强制创建计划文件。
- 计划文件命名规则：

```text
docs/plans/YYYY-MM-DD-task-name-plan.md
```

- `YYYY-MM-DD` 使用当前日期，例如 `2026-05-17`。
- `task-name` 使用本次对话或任务的简短英文 / 拼音 / kebab-case 描述。
- 示例：

```text
docs/plans/2026-05-17-server-api-integration-plan.md
docs/plans/2026-05-17-android-login-page-plan.md
docs/plans/2026-05-17-database-schema-update-plan.md
```

- 计划记录至少包含：
  - 任务标题
  - 当前背景
  - 目标
  - 计划改动
  - 涉及文件
  - 验证方式
  - 当前状态
- 如果后续对同一计划任务继续讨论或开发，应优先更新已有计划文件，不要重复创建多个相同任务计划。
- 如果是全新的计划模式任务，则创建新的计划文件。
- 计划内容或实施方案发生明显变化时，必须同步更新对应 `docs/plans/` 计划记录。

## 交付前检查

当前文档阶段：

```bash
rg "client[-]secret|secret[-]key|DB_PASSW[O]RD|MAIL_PASSW[O]RD|ACCESS[_]KEY|生产密[码]|真实[ ]IP|真实I[P]" AGENTS.md docs
```

工程阶段命令：

```bash
cd frontend
bun run typecheck
bun run lint
bun run build
```

```bash
cd backend
mvnw.cmd test
mvnw.cmd package
```

## 部署提示

部署和运行说明维护在 `DEPLOY.md`，至少说明：

- 前端运行地址。
- 后端运行端口。
- MySQL 数据库名和环境变量名。
- 附件上传目录。
- 管理员初始化方式。
- 受控附件接口访问策略；V1.0.0 不提供静态公开附件路径。
