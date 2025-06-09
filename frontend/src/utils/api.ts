export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }
  return res.json();
}
