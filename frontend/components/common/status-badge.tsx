import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { PostStatus, Visibility } from "@/types/tekflow";

const visibilityLabel: Record<Visibility, string> = {
  private: "Private",
  public: "Public",
  school: "School",
  unlisted: "Unlisted",
};

const statusLabel: Record<PostStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function VisibilityBadge({ value }: { value: Visibility }) {
  const variant: BadgeProps["variant"] =
    value === "public" ? "default" : value === "school" ? "secondary" : value === "unlisted" ? "warning" : "muted";
  return <Badge variant={variant}>{visibilityLabel[value]}</Badge>;
}

export function StatusBadge({ value }: { value: PostStatus }) {
  const variant: BadgeProps["variant"] = value === "published" ? "success" : value === "archived" ? "muted" : "secondary";
  return <Badge variant={variant}>{statusLabel[value]}</Badge>;
}

export function PriorityBadge({ value }: { value?: string | null }) {
  if (!value) {
    return null;
  }
  const variant: BadgeProps["variant"] = value === "urgent" ? "destructive" : value === "important" ? "warning" : "success";
  return <Badge variant={variant}>{value}</Badge>;
}

export function NoticeStatusBadge({ value }: { value?: string | null }) {
  if (!value) {
    return null;
  }
  const variant: BadgeProps["variant"] =
    value === "expired" ? "destructive" : value === "done" ? "muted" : value === "ongoing" ? "success" : "default";
  return <Badge variant={variant}>{value}</Badge>;
}

