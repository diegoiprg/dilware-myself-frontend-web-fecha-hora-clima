import * as React from 'react';

const TABLET_BREAKPOINT = 768;

export function useIsAndroidTabletPortrait() {
  const [isAndroidTabletPortrait, setIsAndroidTabletPortrait] = React.useState<
    boolean | undefined
  >(undefined);

  React.useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isTablet = window.innerWidth >= TABLET_BREAKPOINT;
    const isPortrait = window.innerHeight > window.innerWidth;
    const mql = window.matchMedia(
      `(min-width: ${TABLET_BREAKPOINT}px) and (orientation: portrait)`
    );
    const onChange = () => {
      const currentIsPortrait = window.innerHeight > window.innerWidth;
      setIsAndroidTabletPortrait(
        isAndroid && window.innerWidth >= TABLET_BREAKPOINT && currentIsPortrait
      );
    };
    mql.addEventListener('change', onChange);
    setIsAndroidTabletPortrait(isAndroid && isTablet && isPortrait);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isAndroidTabletPortrait;
}
