-- TekFlow V1.0.0 minimum demo seed
-- Run after docs/schema.sql in a local demo database.
-- Replace password_hash before using the admin account for a real login demo.

USE tekflow;

INSERT INTO users (id, username, name, email, password_hash, role, enabled)
VALUES (
  1,
  'admin',
  'TekFlow Admin',
  NULL,
  '$2a$10$REPLACE_WITH_LOCAL_DEMO_BCRYPT_HASH',
  'admin',
  TRUE
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  enabled = VALUES(enabled),
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO categories (id, name, slug, description)
VALUES
  (1, '技术沉淀', 'tech-notes', '公开或私有的技术知识沉淀'),
  (2, '学校事项', 'school', '课程、作业、考试和通知'),
  (3, '运维手册', 'ops', '服务器、NAS、Cloudflare、PM2 等运维记录')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO tags (id, name, slug)
VALUES
  (1, 'Next.js', 'nextjs'),
  (2, 'Spring Boot', 'spring-boot'),
  (3, 'MySQL', 'mysql'),
  (4, 'Deadline', 'deadline')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO projects (id, name, slug, description)
VALUES
  (1, 'TekFlow', 'tekflow', 'TekFlow 个人知识工作台'),
  (2, 'Coursework', 'coursework', '学校课程和作业事项')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO posts (
  id,
  title,
  slug,
  summary,
  content,
  type,
  visibility,
  status,
  category_id,
  project_id,
  published_at
)
VALUES
  (
    1,
    'TekFlow 公开知识库示例',
    'tekflow-public-wiki-demo',
    '用于验证 /wiki public published 展示。',
    '## Public Demo\n\n这是一篇脱敏后的公开知识文章，用于验证 wiki 列表、详情和附件访问。',
    'tech_note',
    'public',
    'published',
    1,
    1,
    CURRENT_TIMESTAMP
  ),
  (
    2,
    'TekFlow 私有运维记录示例',
    'tekflow-private-ops-demo',
    '只应在后台可见的 private 内容。',
    '## Private Demo\n\n这是一篇私有运维记录，用于验证公开页面和附件访问不会泄露 private 内容。',
    'ops_manual',
    'private',
    'published',
    3,
    1,
    CURRENT_TIMESTAMP
  ),
  (
    3,
    'TekFlow unlisted 分享示例',
    'tekflow-unlisted-share-demo',
    '只通过 /share/[slug] 访问，不进入公开列表。',
    '## Unlisted Demo\n\n这是一篇持链接访问内容，用于验证 unlisted 不进入 wiki、school 或首页公开列表。',
    'study_note',
    'unlisted',
    'published',
    1,
    1,
    CURRENT_TIMESTAMP
  )
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  summary = VALUES(summary),
  content = VALUES(content),
  status = VALUES(status),
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO posts (
  id,
  title,
  slug,
  summary,
  content,
  type,
  visibility,
  status,
  category_id,
  project_id,
  event_date,
  start_time,
  end_time,
  deadline_at,
  location,
  course_name,
  teacher_name,
  notice_priority,
  notice_status,
  is_notice_done,
  published_at
)
VALUES (
  4,
  '概率统计期末复习提醒',
  'probability-final-review-demo',
  '用于验证 /school school notice 分区和详情展示。',
  '## School Notice Demo\n\n请按课程要求完成复习并确认考试地点。',
  'school_notice',
  'school',
  'published',
  2,
  2,
  DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY),
  '09:00:00',
  '11:00:00',
  DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY),
  'Teaching Building A301',
  'Probability and Statistics',
  'Demo Teacher',
  'urgent',
  'upcoming',
  FALSE,
  CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  summary = VALUES(summary),
  content = VALUES(content),
  event_date = VALUES(event_date),
  deadline_at = VALUES(deadline_at),
  notice_priority = VALUES(notice_priority),
  notice_status = VALUES(notice_status),
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO post_tags (post_id, tag_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 3),
  (3, 1),
  (4, 4)
ON DUPLICATE KEY UPDATE
  post_id = VALUES(post_id);

INSERT INTO attachments (id, post_id, filename, original_name, mime_type, size, path)
VALUES
  (1, 1, 'demo-public-note.txt', 'demo-public-note.txt', 'text/plain', 160, '../docs/demo-attachments/demo-public-note.txt'),
  (2, 2, 'demo-private-runbook.txt', 'demo-private-runbook.txt', 'text/plain', 170, '../docs/demo-attachments/demo-private-runbook.txt'),
  (3, 3, 'demo-unlisted-note.md', 'demo-unlisted-note.md', 'text/markdown', 150, '../docs/demo-attachments/demo-unlisted-note.md'),
  (4, 4, 'demo-school-notice.txt', 'demo-school-notice.txt', 'text/plain', 140, '../docs/demo-attachments/demo-school-notice.txt')
ON DUPLICATE KEY UPDATE
  filename = VALUES(filename),
  original_name = VALUES(original_name),
  mime_type = VALUES(mime_type),
  size = VALUES(size),
  path = VALUES(path);
