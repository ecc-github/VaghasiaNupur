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

  var observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', 
    threshold: 0
  };

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function(link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('is-active');
            
            // Move the desktop sliding indicator if it exists
            if (desktopIndicator && link.closest('#desktop-nav')) {
              desktopIndicator.style.opacity = '1';
              // Center the bar over the text (70% width, inset by 15%)
              var leftPos = link.offsetLeft;
              var width = link.offsetWidth;
              desktopIndicator.style.left = (leftPos + width * 0.15) + 'px';
              desktopIndicator.style.width = (width * 0.70) + 'px';
              // Position it slightly above the text
              desktopIndicator.style.top = (link.offsetTop - 4) + 'px';
            }
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function(section) {
    observer.observe(section);
  });

  // Handle window resize so the indicator doesn't get misaligned
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
    var observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          bookingIframe.src = bookingIframe.dataset.src;
          observer.unobserve(bookingIframe);
        }
      });
    }, { rootMargin: '200px' });
    observer.observe(bookingIframe);
  }

  // --- Unhighlight Menu on "Book a Session" Click ---
  var bookLinks = document.querySelectorAll('a[href="#booking"]');
  bookLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      // Unhighlight all nav links
      document.querySelectorAll('.nav-link').forEach(function(nav) {
        nav.classList.remove('is-active');
      });
      // Hide the desktop indicator
      if (desktopIndicator) {
        desktopIndicator.style.opacity = '0';
      }
    });
  });
  
});