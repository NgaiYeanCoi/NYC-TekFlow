import type { ApiEnvelope } from "@/types/tekflow";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type ApiFetchOptions = RequestInit & {
  token?: string;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, headers, ...init } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: init.cache ?? "no-store",
  });

  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || envelope.code !== 200) {
    throw new Error(envelope.msg || "请求失败");
  }
  return envelope.data;
}

export async function apiUpload<T>(path: string, formData: FormData, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || envelope.code !== 200) {
    throw new Error(envelope.msg || "上传失败");
  }
  return envelope.data;
}

export function attachmentUrl(id: number) {
  return `${API_BASE_URL}/api/v1/attachments/${id}`;
}

