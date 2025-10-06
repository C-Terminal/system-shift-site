export function scrollReveal(
  node: HTMLElement,
  options = { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.classList.add('visible');
          node.classList.add('animate-slide-in');
          observer.unobserve(node);
        }
      });
    },
    options
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
