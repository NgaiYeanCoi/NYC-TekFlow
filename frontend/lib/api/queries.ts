import { apiFetch } from "@/lib/api/client";
import type { PageResponse, Post, PostShare, PostSummary, ShareMeta, Taxonomy, TaxonomyBundle } from "@/types/tekflow";

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

export async function getShareMeta(token: string) {
  return apiFetch<ShareMeta>(`/api/v1/share/posts/${token}/meta`);
}

export async function openSharePost(token: string, accessCode?: string) {
  return apiFetch<Post>(`/api/v1/share/posts/${token}/open`, {
    method: "POST",
    body: JSON.stringify({ accessCode: accessCode || "" }),
  });
}

export async function getSchoolNotices(params: Record<string, string | number | null | undefined>) {
  return apiFetch<PageResponse<Post>>(`/api/v1/school/notices${queryString(params)}`);
}

export async function getSchoolNotice(slug: string) {
  return apiFetch<Post>(`/api/v1/school/notices/${slug}`);
}

export async function getPublicTaxonomies() {
  return apiFetch<TaxonomyBundle>("/api/v1/taxonomies");
}

export async function getAdminPosts(token: string, params: Record<string, string | number | null | undefined>) {
  return apiFetch<PageResponse<Post>>(`/api/v1/admin/posts${queryString(params)}`, { token });
}

export async function getAdminPost(token: string, id: number) {
  return apiFetch<Post>(`/api/v1/admin/posts/${id}`, { token });
}

export async function getAdminShare(token: string, postId: number) {
  return apiFetch<PostShare>(`/api/v1/admin/posts/${postId}/share`, { token });
}

export async function getAdminSummary(token: string) {
  return apiFetch<PostSummary>("/api/v1/admin/posts/summary", { token });
}

export async function getTaxonomies(token: string) {
  const [categories, tags, projects] = await Promise.all([
    apiFetch<Taxonomy[]>("/api/v1/admin/categories", { token }),
    apiFetch<Taxonomy[]>("/api/v1/admin/tags", { token }),
    apiFetch<Taxonomy[]>("/api/v1/admin/projects", { token }),
  ]);
  return { categories, tags, projects };
}
