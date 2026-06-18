import { apiFetch } from "@/lib/api/client";
import type { PageResponse, Post, Taxonomy } from "@/types/tekflow";

export function queryString(params: Record<string, string | number | null | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const text = search.toString();
  return text ? `?${text}` : "";
}

export async function getWikiPosts(params: Record<string, string | number | null | undefined>) {
  return apiFetch<PageResponse<Post>>(`/api/v1/wiki/posts${queryString(params)}`);
}

export async function getWikiPost(slug: string) {
  return apiFetch<Post>(`/api/v1/wiki/posts/${slug}`);
}

export async function getSharePost(slug: string) {
  return apiFetch<Post>(`/api/v1/share/posts/${slug}`);
}

export async function getSchoolNotices(params: Record<string, string | number | null | undefined>) {
  return apiFetch<PageResponse<Post>>(`/api/v1/school/notices${queryString(params)}`);
}

export async function getSchoolNotice(slug: string) {
  return apiFetch<Post>(`/api/v1/school/notices/${slug}`);
}

export async function getAdminPosts(token: string, params: Record<string, string | number | null | undefined>) {
  return apiFetch<PageResponse<Post>>(`/api/v1/admin/posts${queryString(params)}`, { token });
}

export async function getAdminPost(token: string, id: number) {
  return apiFetch<Post>(`/api/v1/admin/posts/${id}`, { token });
}

export async function getTaxonomies(token: string) {
  const [categories, tags, projects] = await Promise.all([
    apiFetch<Taxonomy[]>("/api/v1/admin/categories", { token }),
    apiFetch<Taxonomy[]>("/api/v1/admin/tags", { token }),
    apiFetch<Taxonomy[]>("/api/v1/admin/projects", { token }),
  ]);
  return { categories, tags, projects };
}

