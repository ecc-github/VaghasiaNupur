document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.portfolio-header');
  const btn    = header?.querySelector('.menu-toggle');
  const nav    = header?.querySelector('nav');

  // 0) Bind hamburger toggle immediately
  if (btn && nav) {
    btn.addEventListener('click', () => {
      if (!header.classList.contains('open')) {
        header.classList.add('open');
      } else {
        header.classList.add('closing');
        function onDone() {
          header.classList.remove('open', 'closing');
          nav.removeEventListener('animationend', onDone);
        }
        nav.addEventListener('animationend', onDone);
      }
    });
  }

  // 1) Handle hello animation once
  const path           = document.querySelector('.hello');
  const helloContainer = document.getElementById('hello-container');
  const portfolio      = document.getElementById('portfolio');
  const playedFlag     = sessionStorage.getItem('helloPlayed');

  if (playedFlag) {
    if (helloContainer) helloContainer.remove();
    portfolio.classList.add('show');
    // no return here anymore — toggle is already bound
  }

  // 2) If not yet played, run the SVG draw
  if (!playedFlag && path) {
    const length = path.getTotalLength();
    path.style.setProperty('--path-length', length);

    path.addEventListener('animationstart', () => {
      setTimeout(
        () => portfolio.classList.add('show'),
        2000 - 100
      );
    });

    path.addEventListener('animationend', () => {
      sessionStorage.setItem('helloPlayed', 'true');
      helloContainer.style.transition = 'opacity 0.4s ease-in-out';
      helloContainer.style.opacity    = '0';
      helloContainer.addEventListener('transitionend', () => {
        helloContainer.remove();
        portfolio.classList.add('show');
      }, { once: true });
    });

  } else if (!path) {
    // no hello SVG → just show
    if (helloContainer) helloContainer.remove();
    portfolio.classList.add('show');
  }
});
