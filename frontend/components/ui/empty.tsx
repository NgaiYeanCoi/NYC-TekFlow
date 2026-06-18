import * as React from "react";
import { cn } from "@/lib/utils";

function Empty({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/70 p-8 text-center", className)}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold", className)} {...props} />;
}

function EmptyDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("max-w-md text-sm leading-6 text-muted-foreground", className)} {...props} />;
}

export { Empty, EmptyDescription, EmptyTitle };
