"use client";

import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <Button variant="ghost" size="sm" className={cn(className)} onClick={() => signOut({ callbackUrl: "/login" })}>
      <LogOutIcon data-icon="inline-start" />
      退出
    </Button>
  );
}
