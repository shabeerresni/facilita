/**
 * Facilita Firms Management LLC — Single Page Site
 * Vanilla JS: Nav, tabs, accordions, counters, scroll behavior
 */

(function () {
  'use strict';

  // ---------- Navbar: solid on scroll ----------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // init

  // ---------- Mobile menu: single close function + delegation for smooth behaviour ----------
  function closeMobileMenu() {
    if (navToggle) navToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function isLandscapeShort() {
    return window.matchMedia('(max-height: 500px) and (orientation: landscape)').matches;
  }

  function openOrCloseMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    if (!isLandscapeShort()) {
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    }
  }

  if (navToggle && navMenu) {
    closeMobileMenu(); // reset on load

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      openOrCloseMenu();
    });

    // One delegated handler for nav links: close menu then scroll
    navMenu.addEventListener('click', function (e) {
      var link = e.target && e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (href === '#') return;
      var targetEl = document.querySelector(href);
      if (!targetEl) return;
      e.preventDefault();
      e.stopPropagation();
      closeMobileMenu();
      void navToggle.offsetHeight;

      if (href === '#gallery') {
        setTimeout(function () {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          if (document.activeElement && document.activeElement !== document.body) {
            document.activeElement.blur();
          }
          var galleryEl = document.getElementById('gallery');
          if (galleryEl) {
            galleryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 350);
      } else {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
      }
    });
  }

  // ---------- Smooth scroll for anchor links (outside nav: hero CTA, footer, etc.) ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    if (navMenu && navMenu.contains(anchor)) return; // nav links handled above
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- AOS init ----------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40
    });
  }

  // ---------- Animated counters ----------
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target) || el.dataset.animated === 'true') return;
      el.dataset.animated = 'true';
      animateValue(el, 0, target, 1600);
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(function (el) { counterObserver.observe(el); });

  function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeOut);
      element.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- Service tabs ----------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabPanels.forEach(function (p) {
        p.classList.remove('active');
        if (p.id === 'panel-' + tabId) p.classList.add('active');
      });
      this.classList.add('active');
    });
  });

  // ---------- Service detail cards (accordion) ----------
  const detailCards = document.querySelectorAll('.service-detail-card');
  detailCards.forEach(function (card) {
    const trigger = card.querySelector('.service-detail-trigger');
    const content = card.querySelector('.service-detail-content');
    if (!trigger || !content) return;
    trigger.addEventListener('click', function () {
      const isOpen = card.classList.contains('open');
      detailCards.forEach(function (c) {
        c.classList.remove('open');
        c.querySelector('.service-detail-content').style.maxHeight = '';
      });
      if (!isOpen) {
        card.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ---------- Hero scroll indicator: scroll down to About ----------
  var scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function () {
      var about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---------- Scroll-to-top button ----------
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }, { passive: true });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Contact form (Formspree) ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var form = this;
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : 'Send Message';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (r) {
          if (r.ok) {
            if (btn) {
              btn.textContent = 'Message Sent';
              btn.disabled = false;
              setTimeout(function () { btn.textContent = originalText; }, 3000);
            }
            form.reset();
          } else {
            throw new Error('Submit failed');
          }
        })
        .catch(function () {
          if (btn) {
            btn.textContent = 'Failed — try again';
            btn.disabled = false;
            setTimeout(function () { btn.textContent = originalText; }, 3000);
          }
        });
    });
  }

  // ---------- Client gallery slideshow (all files starting with "client" or "image") ----------
  /* Gallery: no duplicates (image.png & image copy.png were same as client6.png — removed) */
  var galleryImages = [
    'client1.png', 'client2.png', 'client3.jpg', 'client4.png', 'client5.png', 'client6.png',
    'image copy 2.png', 'image copy 3.png', 'image copy 4.png', 'image copy 5.png', 'image copy 6.png',
    'image copy 7.png', 'image copy 8.png', 'image copy 9.png', 'image copy 10.png', 'image copy 11.png',
    'image copy 12.png', 'image copy 13.png', 'image copy 14.png'
  ];

  var track = document.getElementById('galleryTrack');
  var dotsContainer = document.getElementById('galleryDots');
  var thumbsContainer = document.getElementById('galleryThumbs');
  var prevBtn = document.querySelector('.gallery-prev');
  var nextBtn = document.querySelector('.gallery-next');

  if (track && galleryImages.length > 0) {
    var currentIndex = 0;
    var total = galleryImages.length;

    function imageSrc(name) {
      return 'images/' + name.replace(/ /g, '%20');
    }

    track.style.width = (total * 100) + '%';
    galleryImages.forEach(function (name, i) {
      var slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.style.flex = '0 0 ' + (100 / total) + '%';
      var img = document.createElement('img');
      img.src = imageSrc(name);
      img.alt = 'Client reference ' + (i + 1);
      img.loading = i === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      track.appendChild(slide);
    });

    if (dotsContainer) {
      galleryImages.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); });
        dotsContainer.appendChild(dot);
      });
    }

    if (thumbsContainer) {
      galleryImages.forEach(function (name, i) {
        var thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
        var img = document.createElement('img');
        img.src = imageSrc(name);
        img.alt = '';
        thumb.appendChild(img);
        thumb.addEventListener('click', function () { goTo(i); });
        thumbsContainer.appendChild(thumb);
      });
    }

    function goTo(index) {
      currentIndex = (index + total) % total;
      track.style.transform = 'translateX(-' + (currentIndex * 100 / total) + '%)';
      var dots = dotsContainer ? dotsContainer.querySelectorAll('.gallery-dot') : [];
      var thumbs = thumbsContainer ? thumbsContainer.querySelectorAll('.gallery-thumb') : [];
      dots.forEach(function (d, i) { d.classList.toggle('active', i === currentIndex); });
      thumbs.forEach(function (t, i) { t.classList.toggle('active', i === currentIndex); });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });

    goTo(0); // set initial position

    var touchStartX = 0;
    var stage = track.closest('.gallery-stage');
    if (stage) {
      stage.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      stage.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
          goTo(currentIndex + (diff > 0 ? 1 : -1));
        }
      }, { passive: true });
    }

    var autoplay = null;
    var slideshow = track.closest('.gallery-slideshow');

    function startAutoplay() {
      if (autoplay) return;
      autoplay = setInterval(function () { goTo(currentIndex + 1); }, 5000);
    }
    function stopAutoplay() {
      clearInterval(autoplay);
      autoplay = null;
    }

    startAutoplay();

    if (slideshow) {
      slideshow.addEventListener('mouseenter', stopAutoplay);
      slideshow.addEventListener('mouseleave', startAutoplay);
      slideshow.addEventListener('touchstart', stopAutoplay, { passive: true });
    }

    // On iOS Safari, animating CSS transform promotes the element to its own
    // compositor layer which breaks touch routing to position:fixed elements.
    // Force the navbar and scroll-top onto their own layers BEFORE any gallery
    // animation runs so the browser never has to re-promote them mid-touch.
    if (navbar) navbar.style.transform = 'translateZ(0)';
    if (scrollTopBtn) scrollTopBtn.style.transform = 'translateZ(0)';

    // Pause autoplay when tab is hidden (saves battery, avoids background repaints)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });

    // Pause autoplay when gallery is out of viewport (fixes mobile stall/hamburger/scroll-top)
    var gallerySection = document.getElementById('gallery');
    if (gallerySection && typeof IntersectionObserver !== 'undefined') {
      var galleryObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          clearInterval(autoplay);
          if (entry.isIntersecting) {
            autoplay = setInterval(function () { goTo(currentIndex + 1); }, 5000);
          }
        });
      }, { threshold: 0.2 });
      galleryObserver.observe(gallerySection);
    }
  }
})();
