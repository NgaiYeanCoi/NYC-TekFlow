import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationControlsProps = {
  pathname: string;
  params: Record<string, string | number | null | undefined>;
  page: number;
  pageSize: number;
  total: number;
};

function hrefFor(pathname: string, params: Record<string, string | number | null | undefined>, page: number) {
  const search = new URLSearchParams();
  Object.entries({ ...params, page }).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const text = String(value);
      if (text) {
        search.set(key, text);
      }
    }
  });
  const text = search.toString();
  return text ? `${pathname}?${text}` : pathname;
}

export function PaginationControls({ pathname, params, page, pageSize, total }: PaginationControlsProps) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="flex flex-col gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        第 {page} / {totalPages} 页，共 {total} 项
      </span>
      <div className="flex gap-2">
        <Link
          href={hasPrevious ? hrefFor(pathname, params, page - 1) : hrefFor(pathname, params, page)}
          aria-disabled={!hasPrevious}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), !hasPrevious && "pointer-events-none opacity-50")}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          上一页
        </Link>
        <Link
          href={hasNext ? hrefFor(pathname, params, page + 1) : hrefFor(pathname, params, page)}
          aria-disabled={!hasNext}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), !hasNext && "pointer-events-none opacity-50")}
        >
          下一页
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </div>
    </nav>
  );
}
