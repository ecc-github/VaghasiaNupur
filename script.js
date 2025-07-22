// 1) Compute total path length for the stroke
const path = document.querySelector('.hello');
const length = path.getTotalLength();
path.style.setProperty('--path-length', length);

// 2) After animation (draw + pause + reverse) finishes, swap views
path.addEventListener('animationend', () => {
  // fade out the SVG container
  const helloContainer = document.getElementById('hello-container');
  helloContainer.style.transition = 'opacity 0.8s ease-in-out';
  helloContainer.style.opacity = '0';

  // once it's hidden, remove it and show portfolio
  helloContainer.addEventListener('transitionend', () => {
    helloContainer.remove();
    const portfolio = document.getElementById('portfolio');
    portfolio.classList.add('show');
  }, { once: true });
});
