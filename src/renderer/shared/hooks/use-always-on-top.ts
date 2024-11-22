import { useEffect, useState } from 'react';

export const useAlwaysOnTop = () => {
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

  useEffect(() => {
    const run = async () => {
      const realAlwaysOnTop = await window.electronAPI.getAlwaysOnTop();
      if (realAlwaysOnTop !== alwaysOnTop) {
        await window.electronAPI.setAlwaysOnTop(alwaysOnTop);
        setAlwaysOnTop(alwaysOnTop);
      }
    };

    run();
  }, [alwaysOnTop]);

  return { alwaysOnTop, setAlwaysOnTop };
};
