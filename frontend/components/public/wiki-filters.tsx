import Link from "next/link";
import { RotateCcwIcon, SearchIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Taxonomy } from "@/types/tekflow";

type WikiFiltersProps = {
  keyword?: string;
  categoryId?: string;
  tagId?: string;
  projectId?: string;
  taxonomies: {
    categories: Taxonomy[];
    tags: Taxonomy[];
    projects: Taxonomy[];
  };
};

export function WikiFilters({ keyword, categoryId, tagId, projectId, taxonomies }: WikiFiltersProps) {
  return (
    <form className="rounded-lg border border-border bg-card p-3">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="wiki-keyword">搜索</FieldLabel>
          <Input id="wiki-keyword" name="keyword" defaultValue={keyword ?? ""} placeholder="搜索公开内容" />
        </Field>
        <TaxonomySelect id="wiki-category" name="categoryId" label="分类" value={categoryId} items={taxonomies.categories} emptyLabel="全部分类" />
        <TaxonomySelect id="wiki-tag" name="tagId" label="标签" value={tagId} items={taxonomies.tags} emptyLabel="全部标签" />
        <TaxonomySelect id="wiki-project" name="projectId" label="项目标签" value={projectId} items={taxonomies.projects} emptyLabel="全部项目" />
        <div className="flex gap-2">
          <button type="submit" className={buttonVariants({ size: "sm" })}>
            <SearchIcon data-icon="inline-start" />
            筛选
          </button>
          <Link href="/wiki" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <RotateCcwIcon data-icon="inline-start" />
            重置
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}

function TaxonomySelect({
  id,
  name,
  label,
  value,
  items,
  emptyLabel,
}: {
  id: string;
  name: string;
  label: string;
  value?: string;
  items: Taxonomy[];
  emptyLabel: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} name={name} defaultValue={value ?? ""} className="h-11 rounded-md border border-input bg-card px-3 text-sm">
        <option value="">{emptyLabel}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </Field>
  );
}
