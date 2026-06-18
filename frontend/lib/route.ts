export async function readSearchParams(searchParams?: Promise<Record<string, string | string[] | undefined>>) {
  return searchParams ? await searchParams : {};
}

export function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

