// 1) Compute total path length for the stroke
const path = document.querySelector('.hello');
const length = path.getTotalLength();
path.style.setProperty('--path-length', length);

// 2) Grab your containers & schedule “show” early
const helloContainer = document.getElementById('hello-container');
const portfolio      = document.getElementById('portfolio');
const drawDuration   = 2000;  // matches your 2s drawReverse
const earlyKick      = 100;   // ms before end to start showing

path.addEventListener('animationstart', () => {
  setTimeout(() => {
    portfolio.classList.add('show');
  }, drawDuration - earlyKick);
});

// 3) After animation (draw + pause + reverse) finishes, fade out and finalize view swap
path.addEventListener('animationend', () => {
  // faster fade-out now 0.4s instead of 0.8s
  helloContainer.style.transition = 'opacity 0.4s ease-in-out';
  helloContainer.style.opacity = '0';

  helloContainer.addEventListener('transitionend', () => {
    helloContainer.remove();
    portfolio.classList.add('show');
  }, { once: true });
});

// 4) Mobile hamburger toggle
const header = document.querySelector('.portfolio-header');
const btn    = header.querySelector('.menu-toggle');

btn.addEventListener('click', () => {
  if (!header.classList.contains('open')) {
    // opening
    header.classList.add('open');
  } else {
    // closing: kick off bounceUp
    header.classList.add('closing');
    // when animation on <nav> ends, clean up:
    const nav = header.querySelector('nav');
    function onDone() {
      header.classList.remove('open', 'closing');
      nav.removeEventListener('animationend', onDone);
    }
    nav.addEventListener('animationend', onDone);
  }
});
