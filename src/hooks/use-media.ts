import { useEffect, useState } from "react";

/** SSR-safe media query; false until mounted. */
function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

export const useIsTouch = () => useMedia("(pointer: coarse)");
export const useIsMobile = () => useMedia("(max-width: 767px)");
