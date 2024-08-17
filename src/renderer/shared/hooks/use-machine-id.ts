import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../constants';

export const useMachineId = () => {
  const { data: machineId } = useQuery({
    queryKey: QUERY_KEY.MACHINE_ID,
    queryFn: () => window.electronAPI.getMachineId(),
  });

  return machineId;
};
