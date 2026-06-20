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

- 后端：`cd backend` 后执行 `mvn test`、`mvn package`。
- 前端：`bun install`、`bun run lint`、`bun run build`。
- 安全检查：运行文档中的敏感信息扫描命令。
- 手工验收：使用本机已有 MySQL，导入 `docs/schema.sql` 和 `docs/seed-demo.sql`，启动后端和前端，按 PRD 演示脚本验证登录、内容创建、公开展示、school 展示、unlisted 链接访问、private 隐藏和附件权限。

## 当前状态

已完成第一轮纵向闭环实施，并完成一次自检：

- 后端测试和打包通过；当前后端命令约定已调整为全局 `mvn`。
- 前端 `bun run typecheck`、`bun run lint`、`bun run build` 通过。
- 前端 `http://127.0.0.1:3000` 可访问，首页、Wiki、School、登录页和未登录后台重定向已做浏览器验证。
- `localhost:8080` 当前未检测到 TekFlow 后端监听；之前 Swagger 503 来自本机代理，不是后端服务。

本轮继续补齐的执行项：

- 后台 Post 表单补齐 School Notice 的老师、开始时间、结束时间和完成状态字段。
- 附件管理页从手填 Post ID 调整为选择已有 Post。

剩余事项：接入用户本机 MySQL 环境启动后端，验证 `http://localhost:8080/swagger-ui.html`、登录、内容创建、公开展示、School 展示、unlisted 链接访问和附件权限。

2026-06-19 追加：

- 已更新 `DEPLOY.md`，曾补充根目录 `.env.local` 的创建、secret 生成、PowerShell 加载方式、MySQL 连接检查、前后端启动、联调检查和本地环境文件不提交检查。
- 后续本地配置约定已再次调整：根目录 `.env.local` 废弃，后端使用 `application-dev.yml`，前端使用 `frontend/.env.local`。

2026-06-19 继续实施结果：

- 已按设计文档将前端全局字体从 Fira 系列修正为 Inter + Geist Mono 回退栈。
- 已收口后台 Post 表单的 school notice/type/visibility 联动，避免提交 `school_notice` 与非 `school` visibility、或非 school 类型与 `school` visibility 的非法组合。
- 已增强附件管理页：上传和下载按钮增加 pending 禁用状态，附件列表增加空状态，后台附件下载改为携带 Bearer token，确保管理员可访问 private 附件且游客仍被拒绝。
- `.env.local` 已通过本机 MySQL 8.0.45 联通检查，`tekflow` 数据库、schema 和 seed 已导入。
- 后端 `http://localhost:8080/swagger-ui.html` 返回 200；API 闭环验证通过：登录、public/wiki、school notice、unlisted/share、private 隐藏、private 附件游客拒绝和管理员下载。
- 前端 `http://localhost:3000`、`/school` 和移动端 `/login` 已做浏览器渲染检查，页面非空且控制台无错误。

2026-06-19 Post 编辑器体验修复：

- 已修复后台 Post 表单主内容卡片中“标题”字段与卡片分隔线过近的问题，局部增加内容区域顶部间距。
- 已新增 Markdown-first 正文编辑器，保留 `Post.content` Markdown 字符串存储，不引入 HTML 存储、不新增 API、不改变公开文章渲染链路。
- 编辑器已支持富文本式 Markdown 工具栏和预览切换，覆盖标题、粗体、斜体、引用、列表、代码、链接和表格等常用写作动作。

2026-06-19 接口文档中文化与筛选修复：

- 已将后端运行时 OpenAPI/Swagger 改为中文为主，补充中文标题、接口分组、接口说明、参数说明、统一响应、分页和核心 DTO 字段说明。
- 已修复 Dashboard 统计卡片数值区域、Login 表单字段区域与卡片分隔线过近的问题。
- 已将 `/dashboard/posts` 的可见性、状态、类型筛选改为切换后立即更新 URL 并触发筛选，关键词仍通过提交触发查询。

2026-06-19 本地配置约定调整：

- 已废弃根目录 `.env.local` 作为联调主配置的做法。
- 后端本地配置改为 Spring Boot 惯例的 `backend/src/main/resources/application-dev.yml`，本地启动使用 `mvn spring-boot:run -Dspring-boot.run.profiles=dev`。
- 前端本地配置改为 `frontend/.env.local`，由 Next.js 自动读取，启动方式保持 `bun dev`。

2026-06-20 PRD 闭环复核与 P1 筛选迭代：

- 按用户要求保留 `backend/src/main/resources/application-dev.yml` 当前内容不变，本轮不做 dev 配置模板化或迁移。
- 已新增公开筛选字典接口 `/api/v1/taxonomies`，用于 Wiki 分类、标签和项目标签筛选。
- 已新增后台统计接口 `/api/v1/admin/posts/summary`，Dashboard 和 Settings 不再用当前页数据估算全局统计。
- 已扩展 `/api/v1/school/notices`，支持课程、状态、优先级、日期范围、分页筛选；School Notice 状态筛选按请求时间实时计算。
- 已补齐 `/wiki`、`/school` 和 `/dashboard/posts` 的 URL search params 筛选与分页。
- 已新增 `docs/demo-attachments/` 小型演示附件，并更新 `docs/seed-demo.sql` 的附件路径，使 seed 后的 public、school、unlisted 附件可通过受控接口下载，private 附件仍随 Post 权限拒绝游客访问。
- 已清理首页预览中偏内部实现栈的访客可见文案。

2026-06-20 Dashboard 返回首页与 UX 闭环：

- 已补齐公开区与后台区的导航闭环：公共首页和 header 进入 `/dashboard`，后台顶栏提供返回首页入口。
- 已将后台侧栏、概览页、内容列表、学校事项管理、设置页和 Post 表单中的主要用户可见英文改为中文。
- 已新增前端枚举显示映射，Post 类型、可见性、状态和学校事项优先级展示中文 label，API payload 和 URL query 仍保持原枚举值。
- 已为新建/编辑内容页增加返回内容列表入口，编辑已发布的 public、school、unlisted 内容时提供对应展示页入口。
- 已增强后台内容表格和附件空状态：筛选无结果可重置筛选，无内容可新建内容，无附件可触发上传。

2026-06-20 受控链接分享补齐：

- 将 unlisted 分享从 `/share/[slug]` 升级为独立 `post_shares` token 模型，支持可选访问码、默认 7 天过期、撤销、重新生成 token、成功访问计数和附件下载计数。
- 已新增后台分享管理接口：查询、开启/更新、撤销、重新生成；新增公开分享门禁接口和打开分享接口。
- 已调整 unlisted 附件访问：普通 `/api/v1/attachments/{id}` 不再直接允许游客访问 unlisted 附件，分享页通过 `/api/v1/share/posts/{token}/attachments/{id}` 校验 token、访问码、过期和撤销状态后下载。
- 已新增后台编辑页“链接分享”卡片和内容表格“分享”入口，分享页改为 token 门禁页，支持访问码输入、过期/撤销提示和分享附件下载。
- 已更新 `docs/schema.sql`、`docs/seed-demo.sql`、`docs/API.md`、`docs/PRD.md`，并新增 `docs/migrations/2026-06-20-post-shares.sql` 供已有本地数据库升级。
