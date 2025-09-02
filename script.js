document.addEventListener('DOMContentLoaded', () => {
  const burger   = document.getElementById('burger');
  const overlay  = document.getElementById('mobile-overlay');
  const sheet    = document.getElementById('overlay-sheet');
  const bg       = document.getElementById('overlay-bg');
  const header   = document.querySelector('.portfolio-header');

  // keep overlay sized under the header
  function setHeaderVar(){
    if (!header) return;
    const h = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }

  function lockScroll(){ document.body.style.overflow = 'hidden'; }
  function unlockScroll(){ document.body.style.overflow = ''; }

  function openOverlay(){
    setHeaderVar();
    overlay.classList.remove('hidden');   // was display:none
    overlay.classList.add('is-open');     // triggers your CSS animation
    burger?.setAttribute('aria-expanded','true');
    lockScroll();
  }

  function closeOverlay(){
    overlay.classList.remove('is-open');
    // wait for CSS transition to finish before hiding
    setTimeout(() => overlay.classList.add('hidden'), 300);
    burger?.setAttribute('aria-expanded','false');
    unlockScroll();
  }

  burger?.addEventListener('click', () => {
    overlay.classList.contains('is-open') ? closeOverlay() : openOverlay();
  });

  // close when tapping the dim background
  bg?.addEventListener('click', closeOverlay);

  // close after choosing a link in the sheet
  sheet?.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) closeOverlay();
  });

  // maintain correct top offset while open
  window.addEventListener('resize', () => {
    if (overlay.classList.contains('is-open')) setHeaderVar();
  }, { passive:true });
  window.addEventListener('scroll', () => {
    if (overlay.classList.contains('is-open')) setHeaderVar();
  }, { passive:true });
});