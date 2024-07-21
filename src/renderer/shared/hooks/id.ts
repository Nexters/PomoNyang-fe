import { useEffect, useState } from 'react';

export const useMachineId = () => {
  const [machineId, setMachineId] = useState<string>();

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getMachineId().then((id) => setMachineId(id));
    }
  }, []);

  return machineId;
};
