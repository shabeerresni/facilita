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
      // Ignore click if it was already handled by touchend (avoids double toggle on mobile)
      if (e.pointerType === 'touch' || (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)) return;
      openOrCloseMenu();
    });
    // Mobile: handle tap via touchend so menu works after Gallery (click often lost after hash nav)
    navToggle.addEventListener('touchend', function (e) {
      e.preventDefault();
      openOrCloseMenu();
    }, { passive: false });

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
        // Delay scroll + cleanup so hamburger keeps working after (no focus trap, no overflow stuck)
        setTimeout(function () {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          if (document.activeElement && document.activeElement !== document.body) {
            document.activeElement.blur();
          }
          window.location.hash = 'gallery';
          setTimeout(function () {
            if (navToggle) navToggle.focus();
          }, 100);
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

  // ---------- Contact form ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : 'Send';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }
      setTimeout(function () {
        if (btn) {
          btn.textContent = 'Message Sent';
          btn.disabled = false;
          setTimeout(function () { btn.textContent = originalText; }, 3000);
        }
        contactForm.reset();
      }, 800);
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
      return encodeURIComponent(name).replace(/%2F/g, '/');
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

    var autoplay = setInterval(function () { goTo(currentIndex + 1); }, 5000);
    track.closest('.gallery-slideshow').addEventListener('mouseenter', function () { clearInterval(autoplay); });
    track.closest('.gallery-slideshow').addEventListener('mouseleave', function () {
      autoplay = setInterval(function () { goTo(currentIndex + 1); }, 5000);
    });
  }
})();
