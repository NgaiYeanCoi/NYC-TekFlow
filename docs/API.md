# TekFlow REST API 摘要

本文档记录 TekFlow V1.0.0 的 API 契约摘要。运行时完整接口以后端 OpenAPI/Swagger 为准；本文只维护认证、响应结构、分页、权限和核心接口矩阵。

## 1. 基础规则

| 项目 | 规则 |
|---|---|
| API 前缀 | `/api/v1` |
| API 风格 | RESTful API |
| 成功响应 | HTTP 200 + `{ code: 200, msg, data }` |
| 失败响应 | 使用合适 HTTP 状态 + 非 200 业务 `code` |
| 客户端判断 | 依赖 `code`、枚举字段和状态字段，不依赖中文 `msg` |
| 列表分页 | `data={ items, total, page, pageSize }` |
| 接口文档 | 后端运行时中文 OpenAPI/Swagger，默认地址 `http://localhost:8080/swagger-ui.html` |

常见 HTTP 状态建议：

| HTTP 状态 | 场景 |
|---|---|
| 400 | 参数格式错误、字段校验失败 |
| 401 | 未登录或登录态失效 |
| 403 | 已登录但无权限 |
| 404 | 资源不存在，或为避免泄露 private 内容存在性而返回不存在 |
| 409 | slug、username 等唯一字段冲突 |
| 500 | 服务端异常 |

## 2. 认证规则

- 后端使用 Spring Security 作为真实认证和授权主链路。
- V1.0.0 采用 JWT 无状态认证；登录成功后后端返回 JWT、用户信息和过期时间。
- JWT 由后端 JWT Filter 从 `Authorization: Bearer <token>` 解析，并写入 Spring Security SecurityContext。
- 前端使用 NextAuth v5 beta Credentials 调用后端登录接口。
- 登录成功后，NextAuth 封装前端会话并持久化后端 JWT。
- 业务请求统一通过前端 API client 携带 `Authorization: Bearer <token>`。
- 管理员登录使用 `username` 和密码；`email` 仅作为可选资料字段。
- 未登录访问后台接口返回 401；已登录但无权限访问受保护资源返回 403。
- 为避免泄露 private 内容存在性，部分资源无权限或不存在时可统一返回 404。

## 3. 权限规则

| Visibility | 列表展示 | 详情访问 | 附件访问 |
|---|---|---|---|
| `private` | 只在后台 | 仅管理员 | 仅管理员 |
| `public` | `/wiki` 和首页最新公开内容 | 游客访问 `/wiki/[slug]` | 受控接口按 Post 权限校验 |
| `school` | `/school` | 游客访问 `/school/[slug]` | 受控接口按 Post 权限校验 |
| `unlisted` | 不进入公开列表 | 持链接访问 `/share/[slug]` | 受控接口按 Post 权限校验 |

补充规则：

- 所有公开侧查询只返回 `status = published` 且未软删除的内容。
- `type = school_notice` 必须绑定 `visibility = school`。
- `/share/[slug]` 只允许访问 `unlisted + published` 内容。
- 附件统一通过 `/api/v1/attachments/{id}` 下载或预览，不提供静态公开附件路径。

## 4. 接口矩阵

| 场景 | 方法 | 路径 | 角色 | 用途 |
|---|---|---|---|---|
| 登录 | POST | `/api/v1/auth/login` | 管理员 | 使用 username/password 登录并获取 JWT、用户信息和过期时间 |
| 当前用户 | GET | `/api/v1/auth/me` | 管理员 | 获取当前用户信息 |
| 后台内容列表 | GET | `/api/v1/admin/posts` | 管理员 | 查询全部未软删除 Post，支持分页和筛选 |
| 后台内容统计 | GET | `/api/v1/admin/posts/summary` | 管理员 | 查询 Dashboard 和 Settings 使用的内容、附件和基础字典统计 |
| 新建内容 | POST | `/api/v1/admin/posts` | 管理员 | 创建 Post |
| 内容详情 | GET | `/api/v1/admin/posts/{id}` | 管理员 | 获取后台 Post 详情 |
| 编辑内容 | PUT | `/api/v1/admin/posts/{id}` | 管理员 | 更新 Post |
| 删除内容 | DELETE | `/api/v1/admin/posts/{id}` | 管理员 | 归档或软删除 Post |
| 公开列表 | GET | `/api/v1/wiki/posts` | 游客 | 查询 public published 内容 |
| 公开详情 | GET | `/api/v1/wiki/posts/{slug}` | 游客 | 查询 public published 详情 |
| 公开筛选字典 | GET | `/api/v1/taxonomies` | 游客 | 查询公开页面筛选使用的分类、标签和项目标签 |
| 链接访问详情 | GET | `/api/v1/share/posts/{slug}` | 链接访问者 | 查询 unlisted published 详情 |
| School 列表 | GET | `/api/v1/school/notices` | 学校内容访问者 | 查询 school published notice，支持分区和筛选 |
| School 详情 | GET | `/api/v1/school/notices/{slug}` | 学校内容访问者 | 查询 school published notice 详情 |
| 分类管理 | CRUD | `/api/v1/admin/categories` | 管理员 | 管理分类 |
| 标签管理 | CRUD | `/api/v1/admin/tags` | 管理员 | 管理标签 |
| 项目标签管理 | CRUD | `/api/v1/admin/projects` | 管理员 | 管理项目标签 |
| 附件上传 | POST | `/api/v1/admin/attachments` | 管理员 | 上传并关联附件 |
| 附件访问 | GET | `/api/v1/attachments/{id}` | 按权限 | 下载或预览附件 |

常用查询参数：

| 接口 | 参数 |
|---|---|
| `/api/v1/wiki/posts` | `keyword`、`categoryId`、`tagId`、`projectId`、`page`、`pageSize` |
| `/api/v1/school/notices` | `courseName`、`noticeStatus`、`noticePriority`、`fromDate`、`toDate`、`page`、`pageSize` |
| `/api/v1/admin/posts` | `keyword`、`type`、`visibility`、`status`、`categoryId`、`tagId`、`projectId`、`page`、`pageSize` |

School Notice 的 `noticeStatus` 筛选按请求时间实时计算：已完成优先为 `done`；截止时间已过为 `expired`；事项日期为今天为 `ongoing`；其余为 `upcoming`。

## 5. 字段与校验

| 场景 | 校验规则 |
|---|---|
| slug | 根据标题自动生成，管理员可编辑，后端全局唯一 |
| 创建草稿 | 至少需要标题、slug、类型、状态、可见性 |
| 发布 public | 正文必须非空，发布前显示人工脱敏提醒 |
| 发布 unlisted | 正文必须非空，只通过 `/share/[slug]` 访问 |
| 发布 school | `type = school_notice`、`visibility = school`、event_date 或 deadline_at 至少一个存在、notice_priority 必填 |
| 附件上传 | 常用图片、PDF、Office、Markdown/TXT、ZIP，单文件默认上限 20MB |
