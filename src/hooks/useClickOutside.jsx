import { useRef } from "react";
import { useEffect } from "react";

export const useClickOutside = (handler, secondRef) => {
  let domNode = useRef();
  useEffect(() => {
    function clickOutside(e) {
      if (domNode.current) {
        if (secondRef) {
          if (
            !domNode.current.contains(e.target) &&
            !secondRef.current.contains(e.target)
          ) {
            // outside click
            handler();
          }
        } else if(!secondRef){
          if (!domNode.current.contains(e.target)) {
            // outside click
            handler();
          }
        }

        // inside click
      }
    }
    document.addEventListener("mousedown", clickOutside);
    document.addEventListener("touchstart", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
      document.removeEventListener("touchstart", clickOutside);
    };
  }, [handler]);
  return domNode;
};
