"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircleIcon, CheckCircle2Icon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownRichEditor } from "@/components/dashboard/markdown-rich-editor";
import { apiFetch } from "@/lib/api/client";
import { noticePriorityLabels, postTypeLabels, statusLabels, visibilityLabels } from "@/lib/post-display";
import { cn } from "@/lib/utils";
import type { Post, PostPayload, PostStatus, PostType, Taxonomy, Visibility } from "@/types/tekflow";

const types: PostType[] = ["tech_note", "ops_manual", "study_note", "project_record", "sop", "review", "tutorial", "school_notice"];
const visibilities: Visibility[] = ["private", "public", "school", "unlisted"];
const statuses: PostStatus[] = ["draft", "published", "archived"];

type Feedback = {
  type: "success" | "error";
  text: string;
};

export function PostForm({
  token,
  post,
  taxonomies,
  defaultType = "tech_note",
}: {
  token: string;
  post?: Post;
  taxonomies: { categories: Taxonomy[]; tags: Taxonomy[]; projects: Taxonomy[] };
  defaultType?: PostType;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = React.useState<Feedback | null>(null);
  const [pending, setPending] = React.useState(false);
  const [payload, setPayload] = React.useState<PostPayload>(() => ({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    summary: post?.summary ?? "",
    content: post?.content ?? "",
    type: post?.type ?? defaultType,
    visibility: post?.visibility ?? (defaultType === "school_notice" ? "school" : "private"),
    status: post?.status ?? "draft",
    categoryId: post?.category?.id ?? null,
    projectId: post?.project?.id ?? null,
    tagIds: post?.tags.map((tag) => tag.id) ?? [],
    eventDate: post?.eventDate ?? "",
    startTime: post?.startTime ?? "",
    endTime: post?.endTime ?? "",
    deadlineAt: post?.deadlineAt ? post.deadlineAt.slice(0, 16) : "",
    location: post?.location ?? "",
    courseName: post?.courseName ?? "",
    teacherName: post?.teacherName ?? "",
    noticePriority: post?.noticePriority ?? "normal",
    isNoticeDone: Boolean(post?.isNoticeDone),
  }));

  function update<K extends keyof PostPayload>(key: K, value: PostPayload[K]) {
    setPayload((current) => {
      const next = { ...current, [key]: value };
      if (key === "type" && value === "school_notice") {
        next.visibility = "school";
      } else if (key === "type" && next.visibility === "school") {
        next.visibility = "private";
      }
      if (key === "visibility" && value === "school") {
        next.type = "school_notice";
      } else if (key === "visibility" && next.type === "school_notice") {
        next.type = "tech_note";
      }
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);
    try {
      const body = JSON.stringify({
        ...payload,
        categoryId: payload.categoryId || null,
        projectId: payload.projectId || null,
        eventDate: payload.eventDate || null,
        startTime: payload.startTime || null,
        endTime: payload.endTime || null,
        deadlineAt: payload.deadlineAt || null,
      });
      const saved = post
        ? await apiFetch<Post>(`/api/v1/admin/posts/${post.id}`, { method: "PUT", body, token })
        : await apiFetch<Post>("/api/v1/admin/posts", { method: "POST", body, token });
      if (post && saved.id === post.id) {
        setFeedback({ type: "success", text: "保存成功，内容已更新。" });
        router.refresh();
      } else {
        router.push(`/dashboard/posts/${saved.id}`);
        router.refresh();
      }
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "保存失败，请检查内容后重试。" });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle>{post ? "编辑内容" : "新建内容"}</CardTitle>
          <CardDescription>Markdown 正文、摘要和基础发布字段。</CardDescription>
        </CardHeader>
        <CardContent className="pt-5 md:pt-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">标题</FieldLabel>
              <Input id="title" value={payload.title} onChange={(event) => update("title", event.target.value)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input id="slug" value={payload.slug} onChange={(event) => update("slug", event.target.value)} placeholder="留空时由标题生成" />
            </Field>
            <Field>
              <FieldLabel htmlFor="summary">摘要</FieldLabel>
              <Textarea id="summary" value={payload.summary} onChange={(event) => update("summary", event.target.value)} />
            </Field>
            <MarkdownRichEditor id="content" label="正文" value={payload.content ?? ""} onChange={(value) => update("content", value)} />
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border">
            <CardTitle>发布设置</CardTitle>
          </CardHeader>
          <CardContent className="pt-5 md:pt-5">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="type">类型</FieldLabel>
                <select id="type" className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={payload.type} onChange={(event) => update("type", event.target.value as PostType)}>
                  {types.map((item) => (
                    <option key={item} value={item}>
                      {postTypeLabels[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="visibility">可见性</FieldLabel>
                <select id="visibility" className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={payload.visibility} onChange={(event) => update("visibility", event.target.value as Visibility)}>
                  {visibilities.map((item) => (
                    <option key={item} value={item}>
                      {visibilityLabels[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="status">状态</FieldLabel>
                <select id="status" className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={payload.status} onChange={(event) => update("status", event.target.value as PostStatus)}>
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {statusLabels[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="category">分类</FieldLabel>
                <select id="category" className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={payload.categoryId ?? ""} onChange={(event) => update("categoryId", event.target.value ? Number(event.target.value) : null)}>
                  <option value="">无</option>
                  {taxonomies.categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="project">项目标签</FieldLabel>
                <select id="project" className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={payload.projectId ?? ""} onChange={(event) => update("projectId", event.target.value ? Number(event.target.value) : null)}>
                  <option value="">无</option>
                  {taxonomies.projects.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel>标签</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {taxonomies.tags.map((tag) => {
                    const checked = payload.tagIds?.includes(tag.id) ?? false;
                    return (
                      <label key={tag.id} className="flex min-h-11 items-center gap-2 rounded-md border border-border px-3 py-2 text-xs">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const next = new Set(payload.tagIds ?? []);
                            if (event.target.checked) {
                              next.add(tag.id);
                            } else {
                              next.delete(tag.id);
                            }
                            update("tagIds", Array.from(next));
                          }}
                        />
                        {tag.name}
                      </label>
                    );
                  })}
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {payload.type === "school_notice" ? (
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border">
              <CardTitle>学校事项</CardTitle>
            </CardHeader>
            <CardContent className="pt-5 md:pt-5">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="course">课程</FieldLabel>
                  <Input id="course" value={payload.courseName ?? ""} onChange={(event) => update("courseName", event.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="teacherName">老师</FieldLabel>
                  <Input id="teacherName" value={payload.teacherName ?? ""} onChange={(event) => update("teacherName", event.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="eventDate">事项日期</FieldLabel>
                  <Input id="eventDate" type="date" value={payload.eventDate ?? ""} onChange={(event) => update("eventDate", event.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="startTime">开始时间</FieldLabel>
                  <Input id="startTime" type="time" value={payload.startTime ?? ""} onChange={(event) => update("startTime", event.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="endTime">结束时间</FieldLabel>
                  <Input id="endTime" type="time" value={payload.endTime ?? ""} onChange={(event) => update("endTime", event.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="deadline">截止时间</FieldLabel>
                  <Input id="deadline" type="datetime-local" value={payload.deadlineAt ?? ""} onChange={(event) => update("deadlineAt", event.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="location">地点</FieldLabel>
                  <Input id="location" value={payload.location ?? ""} onChange={(event) => update("location", event.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="priority">优先级</FieldLabel>
                  <select id="priority" className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={payload.noticePriority ?? "normal"} onChange={(event) => update("noticePriority", event.target.value as "normal" | "important" | "urgent")}>
                    <option value="normal">{noticePriorityLabels.normal}</option>
                    <option value="important">{noticePriorityLabels.important}</option>
                    <option value="urgent">{noticePriorityLabels.urgent}</option>
                  </select>
                </Field>
                <Field>
                  <label className="flex min-h-11 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                    <input type="checkbox" checked={Boolean(payload.isNoticeDone)} onChange={(event) => update("isNoticeDone", event.target.checked)} />
                    已完成
                  </label>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        ) : null}

        {feedback ? <FormFeedback feedback={feedback} /> : null}

        <Button type="submit" disabled={pending}>
          <SaveIcon data-icon="inline-start" />
          {pending ? "保存中" : "保存"}
        </Button>
      </div>
    </form>
  );
}

function FormFeedback({ feedback }: { feedback: Feedback }) {
  const Icon = feedback.type === "success" ? CheckCircle2Icon : AlertCircleIcon;

  return (
    <div
      role={feedback.type === "error" ? "alert" : "status"}
      aria-live={feedback.type === "error" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-sm font-medium",
        feedback.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-destructive/30 bg-destructive/10 text-destructive",
      )}
    >
      <Icon data-icon="inline-start" className="mt-0.5 shrink-0" />
      <span>{feedback.text}</span>
    </div>
  );
}
