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
  const contactFormError = document.getElementById('contactFormError');
  const ackPopup = document.getElementById('ackPopup');
  const ackPopupClose = ackPopup ? ackPopup.querySelector('.ack-popup__close') : null;
  const ackPopupOverlay = ackPopup ? ackPopup.querySelector('.ack-popup__overlay') : null;

  function showAckPopup() {
    if (!ackPopup) return;
    ackPopup.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    var closeBtn = ackPopup.querySelector('.ack-popup__close');
    if (closeBtn) closeBtn.focus();
  }

  function hideAckPopup() {
    if (!ackPopup) return;
    ackPopup.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (ackPopupClose) ackPopupClose.addEventListener('click', hideAckPopup);
  if (ackPopupOverlay) ackPopupOverlay.addEventListener('click', hideAckPopup);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ackPopup && !ackPopup.hasAttribute('hidden')) hideAckPopup();
  });

  if (contactForm) {
    var requiredFields = [
      { id: 'contactName', name: 'Name' },
      { id: 'contactEmail', name: 'Email' },
      { id: 'contactSubject', name: 'Subject' },
      { id: 'contactMessage', name: 'Message' }
    ];

    function clearError() {
      if (contactFormError) {
        contactFormError.textContent = '';
        contactFormError.classList.remove('visible');
      }
      requiredFields.forEach(function (f) {
        var el = document.getElementById(f.id);
        if (el) el.classList.remove('contact-form-touched');
      });
    }

    function showError(msg) {
      if (contactFormError) {
        contactFormError.textContent = msg;
        contactFormError.classList.add('visible');
      }
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError();

      var firstInvalid = null;
      var missing = [];
      requiredFields.forEach(function (f) {
        var el = document.getElementById(f.id);
        if (!el) return;
        el.classList.add('contact-form-touched');
        var val = (el.value || '').trim();
        if (!val) {
          missing.push(f.name);
          if (!firstInvalid) firstInvalid = el;
        }
      });

      if (missing.length > 0) {
        showError('Please fill in all fields so we can get back to you.');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

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
              setTimeout(function () { btn.textContent = originalText; }, 2000);
            }
            form.reset();
            clearError();
            showAckPopup();
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
          showError('Something went wrong. Please try again or call us on the contact number.');
        });
    });

    requiredFields.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (el) {
        el.addEventListener('input', clearError);
        el.addEventListener('blur', function () { this.classList.add('contact-form-touched'); });
      }
    });
  }

  // ---------- Editorial gallery mosaic + lightbox ----------
  var galleryImages = [
    'client1.png', 'client2.png', 'client3.jpg', 'client4.png', 'client5.png', 'client6.png',
    'image copy 2.png', 'image copy 3.png', 'image copy 4.png', 'image copy 5.png', 'image copy 6.png',
    'image copy 7.png', 'image copy 8.png', 'image copy 9.png', 'image copy 10.png', 'image copy 11.png',
    'image copy 12.png', 'image copy 13.png', 'image copy 14.png'
  ];

  var mosaic = document.getElementById('galleryMosaic');
  var lightbox = document.getElementById('galleryLightbox');
  var lightboxImg = document.getElementById('galleryLightboxImg');
  var lightboxCaption = document.getElementById('galleryLightboxCaption');
  var lightboxPrev = document.querySelector('.gallery-lightbox-prev');
  var lightboxNext = document.querySelector('.gallery-lightbox-next');

  if (mosaic && lightbox && galleryImages.length > 0) {
    var currentIndex = 0;
    var total = galleryImages.length;
    var lastFocused = null;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Feature pattern: wide / tall / featured for editorial rhythm */
    var featureMap = {
      0: 'wide',
      4: 'featured',
      5: 'tall',
      9: 'wide',
      13: 'featured',
      16: 'wide'
    };

    function imageSrc(name) {
      return 'images/' + name.replace(/ /g, '%20');
    }

    function preload(index) {
      var img = new Image();
      img.src = imageSrc(galleryImages[(index + total) % total]);
    }

    galleryImages.forEach(function (name, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-tile';
      var feature = featureMap[i];
      if (feature === 'wide') btn.classList.add('gallery-tile--wide');
      if (feature === 'tall') btn.classList.add('gallery-tile--tall');
      if (feature === 'featured') btn.classList.add('gallery-tile--featured');
      btn.setAttribute('role', 'listitem');
      btn.setAttribute('aria-label', 'View gallery image ' + (i + 1) + ' of ' + total);
      var img = document.createElement('img');
      img.src = imageSrc(name);
      img.alt = 'Facilita client reference ' + (i + 1);
      img.loading = i < 4 ? 'eager' : 'lazy';
      img.decoding = 'async';
      btn.appendChild(img);
      btn.addEventListener('click', function () { openLightbox(i); });
      mosaic.appendChild(btn);
    });

    /* Staggered fade-in on scroll */
    var tiles = mosaic.querySelectorAll('.gallery-tile');
    if (reduceMotion) {
      tiles.forEach(function (t) { t.classList.add('is-visible'); });
    } else if (typeof IntersectionObserver !== 'undefined') {
      var tileObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = Array.prototype.indexOf.call(tiles, el) % 6;
          el.style.transitionDelay = (delay * 0.06) + 's';
          el.classList.add('is-visible');
          tileObserver.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      tiles.forEach(function (t) { tileObserver.observe(t); });
    } else {
      tiles.forEach(function (t) { t.classList.add('is-visible'); });
    }

    function showLightboxImage(index) {
      currentIndex = (index + total) % total;
      var src = imageSrc(galleryImages[currentIndex]);
      lightboxImg.src = src;
      lightboxImg.alt = 'Facilita client reference ' + (currentIndex + 1);
      if (lightboxCaption) {
        lightboxCaption.textContent = 'Facilita client reference · ' + (currentIndex + 1) + ' / ' + total;
      }
      preload(currentIndex + 1);
      preload(currentIndex - 1);
    }

    function getFocusable() {
      return lightbox.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    }

    function openLightbox(index) {
      lastFocused = document.activeElement;
      showLightboxImage(index);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        lightbox.classList.add('is-open');
      });
      var closeBtn = lightbox.querySelector('.gallery-lightbox-close');
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      var finish = function () {
        lightbox.hidden = true;
        lightboxImg.removeAttribute('src');
        if (lastFocused && typeof lastFocused.focus === 'function') {
          lastFocused.focus();
        }
      };
      if (reduceMotion) {
        finish();
      } else {
        setTimeout(finish, 280);
      }
    }

    function step(delta) {
      showLightboxImage(currentIndex + delta);
    }

    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { step(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { step(1); });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'Tab') {
        var focusable = getFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    var touchStartX = 0;
    var stage = lightbox.querySelector('.gallery-lightbox-stage');
    if (stage) {
      stage.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      stage.addEventListener('touchend', function (e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) step(diff > 0 ? 1 : -1);
      }, { passive: true });
    }
  }
})();
