import { useEffect, useState } from 'react';

import { createHttpClient, httpClient } from '../api';

import { useAuthToken } from './use-auth-token';

export const useAuthClient = () => {
  const { data: authToken, isValid } = useAuthToken();
  const [authClient, setAuthClient] = useState<typeof httpClient>();

  useEffect(() => {
    if (authToken && isValid) {
      setAuthClient(createHttpClient({ Authorization: `Bearer ${authToken.accessToken}` }));
    } else {
      setAuthClient(undefined);
    }
  }, [authToken, isValid]);

  return authClient;
};
