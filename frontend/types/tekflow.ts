export type Visibility = "private" | "public" | "school" | "unlisted";
export type PostStatus = "draft" | "published" | "archived";
export type PostType =
  | "tech_note"
  | "ops_manual"
  | "study_note"
  | "project_record"
  | "sop"
  | "review"
  | "tutorial"
  | "school_notice";

export type Taxonomy = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

export type Attachment = {
  id: number;
  postId: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  type: PostType;
  visibility: Visibility;
  status: PostStatus;
  category?: Taxonomy | null;
  project?: Taxonomy | null;
  tags: Taxonomy[];
  attachments: Attachment[];
  eventDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  deadlineAt?: string | null;
  location?: string | null;
  courseName?: string | null;
  teacherName?: string | null;
  noticePriority?: "normal" | "important" | "urgent" | null;
  noticeStatus?: "upcoming" | "ongoing" | "done" | "expired" | null;
  isNoticeDone?: boolean | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
};

export type PageResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type TaxonomyBundle = {
  categories: Taxonomy[];
  tags: Taxonomy[];
  projects: Taxonomy[];
};

export type PostSummary = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  privatePosts: number;
  publicPosts: number;
  schoolPosts: number;
  unlistedPosts: number;
  schoolNoticePosts: number;
  attachments: number;
  categories: number;
  tags: number;
  projects: number;
};

export type ApiEnvelope<T> = {
  code: number;
  msg: string;
  data: T;
};

export type UserSummary = {
  id: number;
  username: string;
  name: string;
  email?: string | null;
  role: string;
};

export type LoginResponse = {
  token: string;
  expiresAt: number;
  user: UserSummary;
};

export type PostShare = {
  postId: number;
  token?: string | null;
  status: "none" | "active" | "revoked";
  active: boolean;
  hasAccessCode: boolean;
  expiresAt?: string | null;
  expired: boolean;
  accessCount: number;
  attachmentDownloadCount: number;
  lastAccessedAt?: string | null;
  revokedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ShareMeta = {
  status: "active" | "revoked" | "expired";
  requiresAccessCode: boolean;
  expiresAt?: string | null;
  expired: boolean;
  revoked: boolean;
  title: string;
};

export type PostSharePayload = {
  accessCode?: string;
  clearAccessCode?: boolean;
  expiresAt?: string | null;
  neverExpires?: boolean;
};

export type PostPayload = {
  title: string;
  slug?: string;
  summary?: string;
  content?: string;
  type: PostType;
  visibility: Visibility;
  status: PostStatus;
  categoryId?: number | null;
  projectId?: number | null;
  tagIds?: number[];
  eventDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  deadlineAt?: string | null;
  location?: string;
  courseName?: string;
  teacherName?: string;
  noticePriority?: "normal" | "important" | "urgent" | null;
  isNoticeDone?: boolean;
};
