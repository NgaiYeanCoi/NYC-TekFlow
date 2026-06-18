"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, LogInIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [pending, setPending] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setPending(false);
    if (result?.error) {
      setError("用户名或密码错误");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="border-b border-border">
        <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <ShieldCheckIcon data-icon="inline-start" />
        </div>
        <CardTitle>登录 TekFlow</CardTitle>
        <CardDescription>使用管理员 username 和密码进入后台。</CardDescription>
      </CardHeader>
      <CardContent className="pt-5 md:pt-5">
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input id="password" className="pr-11" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                <button
                  type="button"
                  className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/25"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? <EyeOffIcon data-icon="inline-start" /> : <EyeIcon data-icon="inline-start" />}
                </button>
              </div>
            </Field>
            {error ? <FieldDescription className="text-destructive" role="alert">{error}</FieldDescription> : null}
            <Button type="submit" disabled={pending}>
              <LogInIcon data-icon="inline-start" />
              {pending ? "登录中" : "登录"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
