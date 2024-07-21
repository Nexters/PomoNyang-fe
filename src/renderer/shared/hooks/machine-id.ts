import { useQuery } from '@tanstack/react-query';

export const useMachineId = () => {
  const { data: machineId } = useQuery({
    queryKey: ['machineId'],
    queryFn: () => window.electronAPI.getMachineId(),
  });

  return machineId;
};
