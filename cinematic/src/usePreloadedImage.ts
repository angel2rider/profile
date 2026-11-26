import { useEffect, useState } from 'react';

/**
 * Starts from a locally preloaded copy so nothing ever renders as a skeleton.
 * If a remote asset is supplied, it is warmed in the background and swapped in
 * once decoded, keeping the profile dynamic without a visible loading state.
 */
export function usePreloadedImage(remote: string | undefined, local: string): string {
  const [src, setSrc] = useState(local);

  useEffect(() => {
    if (!remote || remote === local) {
      setSrc(local);
      return;
    }
    let cancelled = false;
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => { if (!cancelled) setSrc(remote); };
    image.onerror = () => { if (!cancelled) setSrc(local); };
    image.src = remote;
    return () => { cancelled = true; };
  }, [remote, local]);

  return src;
}
