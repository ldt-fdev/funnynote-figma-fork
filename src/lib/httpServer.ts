/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies, headers as serverHeaders } from 'next/headers';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number>;
  body?: any;
  withCredentials?: boolean;
}

const API_BASE = process.env.API_URL || 'http://localhost:8081/api';

function buildUrl(endpoint: string, params?: Record<string, string | number>) {
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
  }
  return url.toString();
}

async function getServerToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  return token || null;
}

async function getUserAgent() {
  const headersList = await serverHeaders();
  return headersList.get('user-agent') || '';
}

async function request<T>(method: HttpMethod, endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, withCredentials = true, headers: customHeaders, ...rest } = options;

  const token = withCredentials ? await getServerToken() : null;

  const userAgent = await getUserAgent();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'User-Agent': userAgent,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const res = await fetch(buildUrl(endpoint, params), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    ...rest,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || res.statusText || 'Request failed');
    (error as any).status = res.status;
    (error as any).statusText = res.statusText;
    (error as any).body = data;
    throw error;
  }

  return data;
}

// Public API
export const http = {
  get: <T>(url: string, options?: RequestOptions) => request<T>('GET', url, options),
  post: <T>(url: string, body?: any, options?: RequestOptions) => request<T>('POST', url, { ...options, body }),
  put: <T>(url: string, body?: any, options?: RequestOptions) => request<T>('PUT', url, { ...options, body }),
  patch: <T>(url: string, body?: any, options?: RequestOptions) => request<T>('PATCH', url, { ...options, body }),
  delete: <T>(url: string, options?: RequestOptions) => request<T>('DELETE', url, options),
};
