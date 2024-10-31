import { useEffect, useState } from "react";

function usePosition(ref) {
  const [position, setPosition] = useState({ top: undefined, left: undefined });

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ top: rect.top, left: rect.left });
    }
  }, [ref]);

  return position;
}

export default usePosition;
