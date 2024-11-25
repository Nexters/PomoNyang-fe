import { useEffect, useState } from 'react';

export const useMinimize = () => {
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const run = async () => {
      const realMinimized = await window.electronAPI.getMinimized();
      if (realMinimized !== minimized) {
        await window.electronAPI.setMinimized(minimized);
        setMinimized(minimized);
      }
    };

    run();
  }, [minimized]);

  return { minimized, setMinimized };
};
