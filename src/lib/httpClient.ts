/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
  body?: any;
  withCredentials?: boolean; // on/off cookie
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

function buildUrl(endpoint: string, params?: Record<string, string | number>) {
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
  }
  return url.toString();
}

function getToken() {
  if (typeof document === 'undefined') return null;
  const value = document.cookie.split('; ').find((row) => row.startsWith('accessToken='));
  return value ? value.split('=')[1] : null;
}

async function request<T>(method: HttpMethod, endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    params,
    body,
    headers: customHeaders,
    withCredentials = false, // whether to include cookies
    ...rest
  } = options;

  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };

  console.log('Login request:', { body: JSON.stringify(body) });

  const res = await fetch(buildUrl(endpoint, params), {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
    credentials: withCredentials ? 'include' : 'omit',
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
