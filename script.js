document.addEventListener('DOMContentLoaded', function () {

  // --- Overlay / Menu Logic ---
  var burger  = document.getElementById('burger');
  var overlay = document.getElementById('mobile-overlay');
  var sheet   = document.getElementById('overlay-sheet');
  var bg      = document.getElementById('overlay-bg');
  var header  = document.querySelector('.portfolio-header');

  function setHeaderVar(){
    if (!header) return;
    var h = Math.round(header.getBoundingClientRect().height || 56);
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }

  function lockScroll(){ document.body.style.overflow = 'hidden'; }
  function unlockScroll(){ document.body.style.overflow = ''; }

  function openOverlay(){
    setHeaderVar();
    if(overlay) {
      overlay.classList.remove('hidden');
      void overlay.offsetWidth;
      overlay.classList.add('is-open');
    }
    if(burger) burger.setAttribute('aria-expanded','true');
    lockScroll();
  }

  function closeOverlay(){
    if(overlay) {
      overlay.classList.remove('is-open');
      setTimeout(function(){ overlay.classList.add('hidden'); }, 300);
    }
    if(burger) burger.setAttribute('aria-expanded','false');
    unlockScroll();
  }

  if (burger && overlay) {
    burger.addEventListener('click', function(){
      overlay.classList.contains('is-open') ? closeOverlay() : openOverlay();
    });
  }

  if (bg) bg.addEventListener('click', closeOverlay);
  if (sheet) sheet.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) closeOverlay();
  });

  function maybeUpdate(){ if (overlay && overlay.classList.contains('is-open')) setHeaderVar(); }
  window.addEventListener('resize', maybeUpdate, { passive: true });
  window.addEventListener('scroll', maybeUpdate, { passive: true });

  // --- Active Nav Link Highlighting & Sliding Indicator ---
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  var desktopIndicator = document.getElementById('desktop-indicator');

  // Suppresses the observer while scrolling to a clicked destination
  var bookingClicked = false;
  var scrollDebounceTimer = null;

  function hideIndicator() {
    navLinks.forEach(function(nav) { nav.classList.remove('is-active'); });
    if (desktopIndicator) desktopIndicator.style.opacity = '0';
  }

  function moveIndicator(link) {
    if (!desktopIndicator || !link.closest('#desktop-nav')) return;
    var leftPos = link.offsetLeft;
    var width = link.offsetWidth;
    desktopIndicator.style.opacity = '1';
    desktopIndicator.style.left = (leftPos + width * 0.15) + 'px';
    desktopIndicator.style.width = (width * 0.70) + 'px';
    desktopIndicator.style.top = (link.offsetTop - 4) + 'px';
  }

  // Unified Click Handler
  document.querySelectorAll('a[data-scroll], a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');

      var isTopLink = (href === '#' || href === '#top' || href === '');

      if (href === '#booking') {
        bookingClicked = true;
        hideIndicator();
      } else if (isTopLink) {
        // Logo/header click: reset lock, clear all highlights, debounce observer
        bookingClicked = false;
        hideIndicator();

        clearTimeout(scrollDebounceTimer);
        scrollDebounceTimer = setTimeout(function() {
          scrollDebounceTimer = null;
        }, 1000);
      } else {
        // Reset the booking lock so the indicator is allowed again
        bookingClicked = false;

        navLinks.forEach(function(nav) { nav.classList.remove('is-active'); });
        this.classList.add('is-active');
        moveIndicator(this);

        // Suppress the observer for 1s while the page scrolls to destination,
        // preventing intermediate sections from hijacking the highlight
        clearTimeout(scrollDebounceTimer);
        scrollDebounceTimer = setTimeout(function() {
          scrollDebounceTimer = null;
        }, 1000);
      }
    });
  });

  // Scroll Observer — blocked during booking state or active scroll debounce
  var observerOptions = { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 };
  var observer = new IntersectionObserver(function(entries) {
    if (bookingClicked) return;
    // While a nav click is still scrolling to its target, don't let intermediate
    // sections clobber the highlight the click already set
    if (scrollDebounceTimer !== null) return;

    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function(link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            if (link.getAttribute('href') !== '#booking') {
              link.classList.add('is-active');
              moveIndicator(link);
            }
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function(section) { observer.observe(section); });

  // Handle window resize
  window.addEventListener('resize', function() {
    var activeLink = document.querySelector('#desktop-nav .nav-link.is-active');
    if (activeLink && desktopIndicator) {
      var leftPos = activeLink.offsetLeft;
      var width = activeLink.offsetWidth;
      desktopIndicator.style.left = (leftPos + width * 0.15) + 'px';
      desktopIndicator.style.width = (width * 0.70) + 'px';
      desktopIndicator.style.top = (activeLink.offsetTop - 4) + 'px';
    }
  }, { passive: true });

  // --- Contact Form Logic ---
  var form = document.getElementById('contact-form');
  var submitBtn = document.getElementById('contact-submit');
  var successEl = document.getElementById('contact-success');
  var errorEl = document.getElementById('contact-error');
  var hasSubmitted = false;

  async function sendContact(e){
    e.preventDefault();
    if(hasSubmitted){
      successEl.textContent = "Thanks! Your message has already been sent.";
      successEl.classList.remove('hidden'); errorEl.classList.add('hidden');
      return;
    }

    var hp = form.querySelector('input[name="_honey"]');
    if(hp && hp.value) return;
    if(!form.reportValidity()) return;

    errorEl.classList.add('hidden'); successEl.classList.add('hidden');
    submitBtn.disabled = true; submitBtn.setAttribute('aria-busy','true'); submitBtn.textContent = 'Sending…';

    try {
      var data = Object.fromEntries(new FormData(form).entries());
      var res = await fetch('https://formsubmit.co/ajax/vaghasianupur@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if(!res.ok) throw new Error('Bad response');

      hasSubmitted = true;
      successEl.textContent = "Thanks! Your message has been sent.";
      successEl.classList.remove('hidden'); errorEl.classList.add('hidden');
      Array.from(form.elements).forEach(function(el){ el.disabled = true; });
      submitBtn.textContent = 'Sent ✓'; submitBtn.classList.add('opacity-60','cursor-not-allowed');
    } catch(err) {
      submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); submitBtn.textContent = 'Send';
      errorEl.classList.remove('hidden');
    }
  }

  if (form) form.addEventListener('submit', sendContact);

  // --- Lazy Load Booking Iframe ---
  var bookingIframe = document.getElementById('booking-iframe');
  if (bookingIframe) {
    var iframeObserver = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          bookingIframe.src = bookingIframe.dataset.src;
          obs.unobserve(bookingIframe);
        }
      });
    }, { rootMargin: '200px' });
    iframeObserver.observe(bookingIframe);
  }

});