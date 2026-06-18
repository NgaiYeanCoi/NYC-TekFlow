-- TekFlow V1.0.0 MySQL schema
-- Target: MySQL 8.0.45
-- This file contains table structure only. Demo data is kept in docs/seed-demo.sql.

CREATE DATABASE IF NOT EXISTS tekflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tekflow;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'admin',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT uk_users_username UNIQUE (username),
  CONSTRAINT uk_users_email UNIQUE (email),
  CONSTRAINT ck_users_role CHECK (role IN ('admin'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  description VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT uk_categories_slug UNIQUE (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tags (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT uk_tags_slug UNIQUE (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  description VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT uk_projects_slug UNIQUE (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  summary VARCHAR(500) NULL,
  content MEDIUMTEXT NULL,
  type VARCHAR(32) NOT NULL,
  visibility VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  category_id BIGINT NULL,
  project_id BIGINT NULL,
  event_date DATE NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  deadline_at DATETIME NULL,
  location VARCHAR(200) NULL,
  course_name VARCHAR(200) NULL,
  teacher_name VARCHAR(120) NULL,
  notice_priority VARCHAR(20) NULL,
  notice_status VARCHAR(20) NULL,
  is_notice_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at DATETIME NULL,
  deleted_at DATETIME NULL,
  CONSTRAINT uk_posts_slug UNIQUE (slug),
  CONSTRAINT fk_posts_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT fk_posts_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT,
  CONSTRAINT ck_posts_type CHECK (
    type IN (
      'tech_note',
      'ops_manual',
      'study_note',
      'project_record',
      'sop',
      'review',
      'tutorial',
      'school_notice'
    )
  ),
  CONSTRAINT ck_posts_visibility CHECK (visibility IN ('private', 'public', 'school', 'unlisted')),
  CONSTRAINT ck_posts_status CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT ck_posts_notice_priority CHECK (
    notice_priority IS NULL OR notice_priority IN ('normal', 'important', 'urgent')
  ),
  CONSTRAINT ck_posts_notice_status CHECK (
    notice_status IS NULL OR notice_status IN ('upcoming', 'ongoing', 'done', 'expired')
  ),
  CONSTRAINT ck_posts_school_binding CHECK (
    (type = 'school_notice' AND visibility = 'school')
    OR (type <> 'school_notice' AND visibility <> 'school')
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS post_tags (
  post_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  CONSTRAINT fk_post_tags_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attachments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size BIGINT NOT NULL,
  path VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_attachments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE RESTRICT,
  CONSTRAINT ck_attachments_size CHECK (size > 0 AND size <= 20971520)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_posts_status_visibility ON posts (status, visibility, deleted_at);
CREATE INDEX idx_posts_type ON posts (type);
CREATE INDEX idx_posts_category ON posts (category_id);
CREATE INDEX idx_posts_project ON posts (project_id);
CREATE INDEX idx_posts_deadline ON posts (deadline_at);
CREATE INDEX idx_posts_event_date ON posts (event_date);
CREATE INDEX idx_attachments_post ON attachments (post_id, deleted_at);
