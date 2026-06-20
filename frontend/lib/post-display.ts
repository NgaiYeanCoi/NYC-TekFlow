import type { Post, PostStatus, PostType, Visibility } from "@/types/tekflow";

export const visibilityLabels: Record<Visibility, string> = {
  private: "私有",
  public: "公开",
  school: "学校事项",
  unlisted: "持链接访问",
};

export const statusLabels: Record<PostStatus, string> = {
  draft: "草稿",
  published: "已发布",
  archived: "已归档",
};

export const postTypeLabels: Record<PostType, string> = {
  tech_note: "技术笔记",
  ops_manual: "运维手册",
  study_note: "学习资料",
  project_record: "项目记录",
  sop: "SOP",
  review: "复盘",
  tutorial: "教程",
  school_notice: "学校事项",
};

export const noticePriorityLabels: Record<NonNullable<Post["noticePriority"]>, string> = {
  normal: "普通",
  important: "重要",
  urgent: "紧急",
};

export function publicPostHref(post: Pick<Post, "slug" | "status" | "visibility">) {
  if (post.status !== "published") {
    return null;
  }
  if (post.visibility === "public") {
    return `/wiki/${post.slug}`;
  }
  if (post.visibility === "school") {
    return `/school/${post.slug}`;
  }
  return null;
}
