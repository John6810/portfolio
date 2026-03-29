// Animate skill bars when they scroll into view
const fills = document.querySelectorAll<HTMLElement>('.skill-bar-fill');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

fills.forEach(fill => observer.observe(fill));
