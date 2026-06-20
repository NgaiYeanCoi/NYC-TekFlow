import Link from "next/link";
import { RotateCcwIcon, SearchIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const statusOptions = [
  ["upcoming", "即将"],
  ["ongoing", "今日"],
  ["done", "已完成"],
  ["expired", "已过期"],
];

const priorityOptions = [
  ["urgent", "urgent"],
  ["important", "important"],
  ["normal", "normal"],
];

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
  return (
    <form className="rounded-lg border border-border bg-card p-3">
      <FieldGroup>
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
        <div className="flex gap-2">
          <button type="submit" className={buttonVariants({ size: "sm" })}>
            <SearchIcon data-icon="inline-start" />
            筛选
          </button>
          <Link href="/school" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <RotateCcwIcon data-icon="inline-start" />
            重置
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
