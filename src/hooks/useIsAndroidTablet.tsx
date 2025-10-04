import * as React from 'react';

const TABLET_BREAKPOINT = 768;

export function useIsAndroidTablet() {
  const [isAndroidTablet, setIsAndroidTablet] = React.useState<
    boolean | undefined
  >(undefined);

  React.useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isTablet = window.innerWidth >= TABLET_BREAKPOINT;
    const mql = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`);
    const onChange = () => {
      setIsAndroidTablet(isAndroid && window.innerWidth >= TABLET_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsAndroidTablet(isAndroid && isTablet);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isAndroidTablet;
}
