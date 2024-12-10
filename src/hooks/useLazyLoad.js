import { useEffect } from "react";

const useLazyLoad = (ref, callback) => {
  useEffect(() => {
    const currentRef = ref.current; // Capture the ref value in a variable

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry.target); // Trigger the callback when the element is in view
            observer.unobserve(entry.target); // Stop observing once it's loaded
          }
        });
      },
      {
        rootMargin: "100px", // Trigger slightly before the element comes into view
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (currentRef) {
      observer.observe(currentRef); // Start observing the element
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // Clean up the observer when component is unmounted
      }
    };
  }, [callback, ref]);
};

export default useLazyLoad;
