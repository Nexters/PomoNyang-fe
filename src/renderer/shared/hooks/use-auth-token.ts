import { useQuery } from '@tanstack/react-query';

import { __localStorage } from '../utils/storage';

type AuthToken = {
  accessToken: string;
  accessTokenExpiredAt: string;
  refreshToken: string;
  refreshTokenExpiredAt: string;
};
type AuthTokenMeta = {
  command: 'refresh-all' | 'refresh-access';
  refreshToken: string;
};

export const useAuthToken = (enabled?: boolean) => {
  const query = useQuery<AuthToken | null>({
    queryKey: ['authToken'],
    queryFn: async ({ meta }) => {
      const { command = 'refresh-all', refreshToken = '' } = (meta as AuthTokenMeta) ?? {};
      console.log('command:', command, 'refreshToken:', refreshToken);
      if (command === 'refresh-access' || refreshToken !== '') {
        return await refreshAuthToken(refreshToken);
      }
      return await fetchAuthToken(await window.electronAPI.getMachineId());
    },
    initialData: () => {
      const prevAuthToken = __localStorage.getItem<AuthToken>('authToken');
      if (!prevAuthToken) return null;
      if (new Date(prevAuthToken.accessTokenExpiredAt) < new Date()) return null;
      return prevAuthToken;
    },
    refetchInterval: (query) => {
      const currAuthToken = query.state.data;
      if (!currAuthToken) return 1000;

      // 다음 access token, refresh token 만료 시점까지 남은 시간 계산
      const accessTokenDiff = getDiffFromNow(new Date(currAuthToken.accessTokenExpiredAt));
      const refreshTokenDiff = getDiffFromNow(new Date(currAuthToken.refreshTokenExpiredAt));

      // 만약 access token 만료가 더 가깝다면, access token 갱신
      if (accessTokenDiff < refreshTokenDiff) {
        query.options.meta = {
          ...query.options.meta,
          command: 'refresh-access',
          refreshToken: currAuthToken.refreshToken,
        };
        return accessTokenDiff;
      }

      // 그렇지 않다면(= refresh token 만료가 더 가깝다면), refresh token 갱신
      query.options.meta = {
        ...query.options.meta,
        command: 'refresh-all',
      };
      return refreshTokenDiff;
    },
    meta: {
      command: 'refresh-all',
      refreshToken: '',
    } as AuthTokenMeta,
    enabled,
  });

  return query;
};

const fetchAuthToken = async (deviceId: string): Promise<AuthToken> => {
  const response = await fetch('https://dev.api.pomonyang.com/papi/v1/tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deviceId }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch token');
  }

  return await response.json();
};
const refreshAuthToken = async (refreshToken: string): Promise<AuthToken> => {
  const response = await fetch('https://dev.api.pomonyang.com/papi/v1/tokens/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return await response.json();
};
const getDiffFromNow = (date: Date) => {
  const now = new Date();
  return Math.max(0, date.getTime() - now.getTime());
};
