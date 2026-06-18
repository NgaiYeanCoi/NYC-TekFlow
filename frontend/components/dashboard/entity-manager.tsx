"use client";

import * as React from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api/client";
import type { Taxonomy } from "@/types/tekflow";

type EntityKind = "categories" | "tags" | "projects";

export function EntityManager({
  token,
  kind,
  title,
  description,
  items,
}: {
  token: string;
  kind: EntityKind;
  title: string;
  description: string;
  items: Taxonomy[];
}) {
  const [list, setList] = React.useState(items);
  const [editing, setEditing] = React.useState<Taxonomy | null>(null);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [itemDescription, setItemDescription] = React.useState("");
  const [message, setMessage] = React.useState("");

  function beginEdit(item: Taxonomy) {
    setEditing(item);
    setName(item.name);
    setSlug(item.slug);
    setItemDescription(item.description ?? "");
  }

  function reset() {
    setEditing(null);
    setName("");
    setSlug("");
    setItemDescription("");
  }

  async function refresh() {
    setList(await apiFetch<Taxonomy[]>(`/api/v1/admin/${kind}`, { token }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      await apiFetch<Taxonomy>(editing ? `/api/v1/admin/${kind}/${editing.id}` : `/api/v1/admin/${kind}`, {
        method: editing ? "PUT" : "POST",
        token,
        body: JSON.stringify({ name, slug, description: itemDescription }),
      });
      reset();
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
    }
  }

  async function remove(id: number) {
    setMessage("");
    try {
      await apiFetch<void>(`/api/v1/admin/${kind}/${id}`, { method: "DELETE", token });
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除失败");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>{editing ? "编辑" : "新建"} {title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">名称</FieldLabel>
                <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="留空时由名称生成" />
              </Field>
              {kind !== "tags" ? (
                <Field>
                  <FieldLabel htmlFor="description">描述</FieldLabel>
                  <Textarea id="description" value={itemDescription} onChange={(event) => setItemDescription(event.target.value)} />
                </Field>
              ) : null}
              {message ? <p className="text-sm text-destructive">{message}</p> : null}
              <div className="flex gap-2">
                <Button type="submit">
                  <PlusIcon data-icon="inline-start" />
                  保存
                </Button>
                {editing ? (
                  <Button type="button" variant="outline" onClick={reset}>
                    取消
                  </Button>
                ) : null}
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle>{title}列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <Empty className="m-4">
              <EmptyTitle>暂无数据</EmptyTitle>
              <EmptyDescription>创建后会显示在这里。</EmptyDescription>
            </Empty>
          ) : (
            <div className="flex flex-col">
              {list.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-muted/40">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{item.name}</div>
                    <div className="truncate font-mono text-xs text-muted-foreground">/{item.slug}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => beginEdit(item)}>
                      <PencilIcon data-icon="inline-start" />
                      编辑
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => remove(item.id)}>
                      <TrashIcon data-icon="inline-start" />
                      删除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
