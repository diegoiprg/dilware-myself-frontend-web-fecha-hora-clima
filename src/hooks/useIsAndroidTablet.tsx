import * as React from 'react';

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

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

export function useIsIPad() {
  const [isIPad, setIsIPad] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const isiPad =
      /iPad/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const mql = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`);
    const onChange = () => {
      setIsIPad(isiPad && window.innerWidth >= TABLET_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsIPad(isiPad && window.innerWidth >= TABLET_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isIPad;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const isLargeScreen = window.innerWidth >= DESKTOP_BREAKPOINT;
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = () => {
      setIsDesktop(!isMobile && window.innerWidth >= DESKTOP_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsDesktop(!isMobile && isLargeScreen);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isDesktop;
}
