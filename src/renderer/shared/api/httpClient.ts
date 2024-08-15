import { resolveUrl } from '@/shared/utils';

export const BASE_URL = import.meta.env.VITE_API_SERVER_URL ?? '';

export const createHttpClient = (defaultHeader?: object) => {
  const mergeHeaders = (headers?: object) => {
    return {
      ...defaultHeader,
      ...headers,
    };
  };

  return {
    get: <T = unknown>(url: string, headers?: object) =>
      __fetch<T, void>('get', url, { headers: mergeHeaders(headers) }),
    post: <T = unknown, D = unknown>(url: string, body: D, headers?: object) =>
      __fetch<T, D>('post', url, { body, headers: mergeHeaders(headers) }),
    put: <T = unknown, D = unknown>(url: string, body: D, headers?: object) =>
      __fetch<T, D>('put', url, { body, headers: mergeHeaders(headers) }),
    patch: <T = unknown, D = unknown>(url: string, body: D, headers?: object) =>
      __fetch<T, D>('patch', url, { body, headers: mergeHeaders(headers) }),
    delete: <T = unknown>(url: string, headers?: object) =>
      __fetch<T, void>('delete', url, { headers: mergeHeaders(headers) }),
  };
};

export const httpClient = createHttpClient();

const __fetch = async <T = unknown, D = unknown>(
  method: string,
  path: string,
  init?: { body?: D; headers?: object },
) => {
  const response = await fetch(resolveUrl(BASE_URL, path), {
    method,
    // @note: body가 undefined이면, stringify 된 값도 undefined이므로 body는 전송되지 않는다.
    body: JSON.stringify(init?.body),
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
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
