import { useState, useRef, useCallback, useEffect } from "react";

const useInfiniteScroll = (fetchMore: () => void) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setIsFetching(true);
          fetchMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, fetchMore]
  );

  useEffect(() => {
    setIsFetching(false);
  }, [isFetching]);

  return [lastElementRef, isFetching] as const;
};

export default useInfiniteScroll;
