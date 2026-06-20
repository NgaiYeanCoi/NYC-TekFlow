"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RotateCcwIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const statusOptions = [
  ["upcoming", "即将"],
  ["ongoing", "今日"],
  ["done", "已完成"],
  ["expired", "已过期"],
] as const;

const priorityOptions = [
  ["urgent", "紧急"],
  ["important", "重要"],
  ["normal", "普通"],
] as const;

function optionLabel(options: readonly (readonly [string, string])[], value?: string) {
  return options.find(([item]) => item === value)?.[1] ?? value;
}

export function SchoolFilters({
  courseName,
  noticeStatus,
  noticePriority,
  fromDate,
  toDate,
}: {
  courseName?: string;
  noticeStatus?: string;
  noticePriority?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const activeFilters = [
    courseName ? `课程：${courseName}` : null,
    noticeStatus ? `状态：${optionLabel(statusOptions, noticeStatus)}` : null,
    noticePriority ? `优先级：${optionLabel(priorityOptions, noticePriority)}` : null,
    fromDate || toDate ? `日期：${fromDate || "不限"} 至 ${toDate || "不限"}` : null,
  ].filter(Boolean);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["courseName", "noticeStatus", "noticePriority", "fromDate", "toDate"]) {
      const value = formData.get(key);
      if (typeof value === "string" && value.trim()) {
        params.set(key, value.trim());
      }
    }
    const query = params.toString();
    router.push(query ? `/school?${query}` : "/school");
    setOpen(false);
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-3 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(true)} aria-controls="school-filter-drawer" aria-expanded={open}>
            <SlidersHorizontalIcon data-icon="inline-start" />
            筛选{activeFilters.length ? `（${activeFilters.length}）` : ""}
          </Button>
          {activeFilters.map((filter) => (
            <span key={filter} className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {filter}
            </span>
          ))}
        </div>
        {activeFilters.length ? (
          <Link href="/school" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "self-start md:self-auto")}>
            <RotateCcwIcon data-icon="inline-start" />
            重置
          </Link>
        ) : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/45" aria-label="关闭筛选" onClick={() => setOpen(false)} />
          <aside
            id="school-filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="school-filter-title"
            className="absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
              }
            }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border p-4">
              <div>
                <h2 id="school-filter-title" className="text-base font-semibold">
                  筛选学校事项
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">按课程、状态、优先级和日期范围缩小结果。</p>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="关闭筛选" onClick={() => setOpen(false)}>
                <XIcon data-icon="inline-start" />
              </Button>
            </div>

            <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="courseName">课程</FieldLabel>
                  <Input id="courseName" name="courseName" defaultValue={courseName ?? ""} placeholder="搜索课程" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="noticeStatus">状态</FieldLabel>
                  <select id="noticeStatus" name="noticeStatus" defaultValue={noticeStatus ?? ""} className="h-11 rounded-md border border-input bg-card px-3 text-sm">
                    <option value="">全部状态</option>
                    {statusOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="noticePriority">优先级</FieldLabel>
                  <select id="noticePriority" name="noticePriority" defaultValue={noticePriority ?? ""} className="h-11 rounded-md border border-input bg-card px-3 text-sm">
                    <option value="">全部优先级</option>
                    {priorityOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="fromDate">开始日期</FieldLabel>
                  <Input id="fromDate" name="fromDate" type="date" defaultValue={fromDate ?? ""} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="toDate">结束日期</FieldLabel>
                  <Input id="toDate" name="toDate" type="date" defaultValue={toDate ?? ""} />
                </Field>
              </FieldGroup>

              <div className="mt-auto flex gap-2 border-t border-border pt-4">
                <Link href="/school" className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                  <RotateCcwIcon data-icon="inline-start" />
                  重置
                </Link>
                <button type="submit" className={cn(buttonVariants(), "flex-1")}>
                  <SearchIcon data-icon="inline-start" />
                  应用筛选
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </>
  );
}
