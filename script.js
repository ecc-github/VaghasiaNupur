document.addEventListener('DOMContentLoaded', () => {
  const path           = document.querySelector('.hello');
  const helloContainer = document.getElementById('hello-container');
  const portfolio      = document.getElementById('portfolio');
  const playedFlag     = sessionStorage.getItem('helloPlayed');

  // If we’ve already played, skip straight to showing the portfolio
  if (playedFlag) {
    if (helloContainer) helloContainer.remove();
    portfolio.classList.add('show');
    return;
  }

  // Otherwise run your existing animation…
  if (path) {
    const length = path.getTotalLength();
    path.style.setProperty('--path-length', length);

    path.addEventListener('animationstart', () => {
      setTimeout(() => portfolio.classList.add('show'),
                 2000 - 100 /* drawDuration - earlyKick */);
    });

    path.addEventListener('animationend', () => {
      // mark as played so clicking the logo won’t replay
      sessionStorage.setItem('helloPlayed', 'true');

      helloContainer.style.transition = 'opacity 0.4s ease-in-out';
      helloContainer.style.opacity    = '0';
      helloContainer.addEventListener('transitionend', () => {
        helloContainer.remove();
        portfolio.classList.add('show');
      }, { once: true });
    });
  } else {
    if (helloContainer) helloContainer.remove();
    portfolio.classList.add('show');
  }
  // 4) Mobile hamburger toggle (identical to your original)
  const header = document.querySelector('.portfolio-header');
  const btn    = header?.querySelector('.menu-toggle');
  const nav    = header?.querySelector('nav');

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
});
