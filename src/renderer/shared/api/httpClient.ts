import { resolveUrl } from '@/shared/utils';

// FIXME
export const BASE_URL = '';

export const httpClient = {
  get: <T = unknown>(url: string) => __fetch<T, void>('get', url),
  post: <T = unknown, D = unknown>(url: string, body: D) => __fetch<T, D>('post', url, body),
  put: <T = unknown, D = unknown>(url: string, body: D) => __fetch<T, D>('put', url, body),
  delete: <T = unknown>(url: string) => __fetch<T, void>('delete', url),
};

const __fetch = async <T = unknown, D = unknown>(method: string, path: string, body?: D) => {
  const response = await fetch(resolveUrl(BASE_URL, path), {
    method,
    // @note: body가 undefined이면, stringify 된 값도 undefined이므로 body는 전송되지 않는다.
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error();
    const text = await response.text();
    error.message = text;
    error.name = response.statusText;
    throw error;
  }

  if (response.headers.get('Content-length') === '0') {
    return {} as T;
  }

  const data = await response.json();
  return data as T;
};
