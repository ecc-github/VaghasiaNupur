document.addEventListener('DOMContentLoaded', () => {
  const burger  = document.getElementById('burger') || document.querySelector('.menu-toggle');
  const overlay = document.getElementById('mobile-overlay');
  const sheet   = document.getElementById('overlay-sheet');
  const bg      = document.getElementById('overlay-bg');
  const header  = document.querySelector('.portfolio-header') || document.querySelector('header .portfolio-header') || document.querySelector('header');

  let isOpen = false;

  function positionSheet() {
    if (!header || !sheet) return;
    const h = header.getBoundingClientRect().height;
    sheet.style.top = `${h}px`;            // sheet starts right under header
    sheet.style.maxHeight = `calc(100dvh - ${h}px)`; // scrollable if long
    sheet.style.overflowY = 'auto';
  }

  function openOverlay() {
    if (isOpen) return;
    isOpen = true;
    positionSheet();
    overlay.classList.remove('hidden');
    // animate in
    requestAnimationFrame(() => {
      bg.classList.remove('opacity-0');
      bg.classList.add('opacity-100');
      sheet.classList.remove('opacity-0', 'translate-y-[-8px]');
      sheet.classList.add('opacity-100', 'translate-y-0');
    });
    // lock background scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    burger?.setAttribute('aria-expanded', 'true');
  }

  function closeOverlay() {
    if (!isOpen) return;
    isOpen = false;
    // animate out
    bg.classList.remove('opacity-100');
    bg.classList.add('opacity-0');
    sheet.classList.remove('opacity-100', 'translate-y-0');
    sheet.classList.add('opacity-0', 'translate-y-[-8px]');
    // after animations, hide
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 220); // slightly > backdrop duration
    // unlock scroll
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    burger?.setAttribute('aria-expanded', 'false');
  }

  function toggleOverlay() {
    isOpen ? closeOverlay() : openOverlay();
  }

  // Events
  burger?.addEventListener('click', toggleOverlay);
  bg?.addEventListener('click', closeOverlay);               // tap backdrop to close
  overlay?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeOverlay();            // close on link tap
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });
  window.addEventListener('resize', () => {
    if (isOpen) positionSheet();
  });
});
