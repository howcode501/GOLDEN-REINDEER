import { supabase } from "./supabase";
const RAW_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://golden-reindeer-api.vercel.app"
    : "http://localhost:8000");
const BASE = RAW_BASE.replace(/\/+$/, "");

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE}${cleanPath}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || res.statusText);
  }

  return res.json();
}
