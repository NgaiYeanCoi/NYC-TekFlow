"use client";

import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import type { PostStatus, PostType, Taxonomy, Visibility } from "@/types/tekflow";

const visibilityOptions: Visibility[] = ["private", "public", "school", "unlisted"];
const statusOptions: PostStatus[] = ["draft", "published", "archived"];
const typeOptions: PostType[] = ["tech_note", "ops_manual", "study_note", "project_record", "sop", "review", "tutorial", "school_notice"];

export function PostFilters({
  keyword,
  visibility,
  status,
  type,
  categoryId,
  projectId,
  tagId,
  taxonomies,
}: {
  keyword?: string;
  visibility?: string;
  status?: string;
  type?: string;
  categoryId?: string;
  projectId?: string;
  tagId?: string;
  taxonomies: { categories: Taxonomy[]; tags: Taxonomy[]; projects: Taxonomy[] };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pushFilter(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");
    const text = params.toString();
    router.push(text ? `${pathname}?${text}` : pathname);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    pushFilter({ keyword: String(formData.get("keyword") ?? "").trim() });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4 xl:grid-cols-7">
      <label className="flex flex-col gap-2 text-sm font-semibold">
        关键词
        <Input key={keyword ?? ""} name="keyword" defaultValue={keyword ?? ""} placeholder="搜索标题、摘要、正文" />
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold">
        可见性
        <select name="visibility" value={visibility ?? ""} className="h-11 rounded-md border border-input bg-card px-3 text-sm" onChange={(event) => pushFilter({ visibility: event.target.value })}>
          <option value="">全部可见性</option>
          {visibilityOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold">
        状态
        <select name="status" value={status ?? ""} className="h-11 rounded-md border border-input bg-card px-3 text-sm" onChange={(event) => pushFilter({ status: event.target.value })}>
          <option value="">全部状态</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold">
        类型
        <select name="type" value={type ?? ""} className="h-11 rounded-md border border-input bg-card px-3 text-sm" onChange={(event) => pushFilter({ type: event.target.value })}>
          <option value="">全部类型</option>
          {typeOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <TaxonomyFilter label="分类" name="categoryId" value={categoryId} items={taxonomies.categories} emptyLabel="全部分类" onChange={pushFilter} />
      <TaxonomyFilter label="标签" name="tagId" value={tagId} items={taxonomies.tags} emptyLabel="全部标签" onChange={pushFilter} />
      <TaxonomyFilter label="项目" name="projectId" value={projectId} items={taxonomies.projects} emptyLabel="全部项目" onChange={pushFilter} />
    </form>
  );
}

function TaxonomyFilter({
  label,
  name,
  value,
  items,
  emptyLabel,
  onChange,
}: {
  label: string;
  name: "categoryId" | "tagId" | "projectId";
  value?: string;
  items: Taxonomy[];
  emptyLabel: string;
  onChange: (next: Record<string, string>) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold">
      {label}
      <select name={name} value={value ?? ""} className="h-11 rounded-md border border-input bg-card px-3 text-sm" onChange={(event) => onChange({ [name]: event.target.value })}>
        <option value="">{emptyLabel}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}
