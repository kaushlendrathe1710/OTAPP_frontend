import { useEffect, useState } from "react";

/**
 *
 * @param {Object} listRef - ref of the list in which your all messages rendered
 * @param {Object} messageRef - ref of the message
 * @param {Object} options - options
 */
export const useIntersectionObserver = (listRef, messageRef, options) => {
  const [intersection, setIntersection] = useState({
    isIntersecting: false,
    intersectionRation: 0,
  });

  useEffect(() => {
    if (!listRef.current || !messageRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIntersection({
            isIntersecting: entry.isIntersecting,
            intersectionRation: entry.intersectionRatio,
          });
        });
      },
      {
        ...options,
        threshold: 0.5,
        root: listRef.current,
      }
    );
    observer.observe(messageRef.current);
    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, []);
  return intersection;
};
