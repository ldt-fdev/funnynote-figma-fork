// /* eslint-disable @typescript-eslint/no-explicit-any */
// const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

// type ApiRequestOptions = {
//   method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
//   endpoint: string;
//   body?: any;
//   token?: string;
//   params?: Record<string, string | number>;
//   headers?: HeadersInit;
// };

// export async function apiRequest<T = any>({
//   method = 'GET',
//   endpoint,
//   body,
//   token,
//   params,
//   headers = {},
// }: ApiRequestOptions): Promise<T> {
//   const url = new URL(`${API_BASE_URL}${endpoint}`);

//   // Thêm query string nếu có
//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       url.searchParams.append(key, String(value));
//     });
//   }

//   const res = await fetch(url.toString(), {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...headers,
//     },
//     body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
//   });

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error.message || `API error: ${res.status}`);
//   }

//   return res.json();
// }
