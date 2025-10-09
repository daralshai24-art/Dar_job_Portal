// hooks/usePageTransition.js
import { useRouter } from "next/navigation";
import { useState } from "react";

export const usePageTransition = () => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (path, options = {}) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (options.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    }, options.delay || 300);

    // Reset after navigation (you might want to handle this differently)
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  return { navigate, isTransitioning };
};