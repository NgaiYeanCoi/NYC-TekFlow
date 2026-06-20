import { Badge, type BadgeProps } from "@/components/ui/badge";
import { noticePriorityLabels, statusLabels, visibilityLabels } from "@/lib/post-display";
import type { PostStatus, Visibility } from "@/types/tekflow";

export function VisibilityBadge({ value }: { value: Visibility }) {
  const variant: BadgeProps["variant"] =
    value === "public" ? "default" : value === "school" ? "secondary" : value === "unlisted" ? "warning" : "muted";
  return <Badge variant={variant}>{visibilityLabels[value]}</Badge>;
}

export function StatusBadge({ value }: { value: PostStatus }) {
  const variant: BadgeProps["variant"] = value === "published" ? "success" : value === "archived" ? "muted" : "secondary";
  return <Badge variant={variant}>{statusLabels[value]}</Badge>;
}

export function PriorityBadge({ value }: { value?: string | null }) {
  if (!value) {
    return null;
  }
  const variant: BadgeProps["variant"] = value === "urgent" ? "destructive" : value === "important" ? "warning" : "success";
  return <Badge variant={variant}>{noticePriorityLabels[value as keyof typeof noticePriorityLabels] ?? value}</Badge>;
}

export function NoticeStatusBadge({ value }: { value?: string | null }) {
  if (!value) {
    return null;
  }
  const variant: BadgeProps["variant"] =
    value === "expired" ? "destructive" : value === "done" ? "muted" : value === "ongoing" ? "success" : "default";
  const label = value === "expired" ? "已过期" : value === "done" ? "已完成" : value === "ongoing" ? "进行中" : "即将";
  return <Badge variant={variant}>{label}</Badge>;
}
