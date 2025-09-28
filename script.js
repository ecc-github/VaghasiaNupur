
document.addEventListener('DOMContentLoaded', function () {
  var burger  = document.getElementById('burger');
  var overlay = document.getElementById('mobile-overlay');
  var sheet   = document.getElementById('overlay-sheet');
  var bg      = document.getElementById('overlay-bg');
  var header  = document.querySelector('.portfolio-header');
  if (!burger || !overlay) return;

  function setHeaderVar(){
    if (!header) return;
    var h = Math.round(header.getBoundingClientRect().height || 56);
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }

  // iOS-safe scroll lock
  var prevScrollY = 0;
  function lockScroll(){
    prevScrollY = window.scrollY || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + prevScrollY + 'px';
    document.body.style.left = '0'; document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  function unlockScroll(){
    document.body.style.position = '';
    document.body.style.top = ''; document.body.style.left = ''; document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, prevScrollY);
  }

  function openOverlay(){
    setHeaderVar();
    // force reflow so opening transition always plays
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    burger.setAttribute('aria-expanded','true');
    lockScroll();
  }

  function closeOverlay(){
    overlay.classList.remove('is-open');   // this animates closed
    burger.setAttribute('aria-expanded','false');
    unlockScroll();
  }

  burger.addEventListener('click', function(){
    overlay.classList.contains('is-open') ? closeOverlay() : openOverlay();
  });

  if (bg) bg.addEventListener('click', closeOverlay);
  if (sheet) sheet.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) closeOverlay();
  });

  function maybeUpdate(){ if (overlay.classList.contains('is-open')) setHeaderVar(); }
  window.addEventListener('resize', maybeUpdate, { passive: true });
  window.addEventListener('scroll', maybeUpdate, { passive: true });
});
