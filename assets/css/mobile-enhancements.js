/**
 * Mobile & Responsive Enhancement Script
 * Safari Chic - All Pages Mobile Functionality
 */

(function() {
  'use strict';

  // ========== MOBILE NAVIGATION TOGGLE ==========
  function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    // Prefer #menu if present, else first nav ul
    const navMenu = document.querySelector('#menu') || document.querySelector('nav ul');
    const body = document.body;

    if (!hamburger || !navMenu) return;

    // Use mousedown/touchstart for more reliable mobile interaction
    const toggleMenu = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = navMenu.classList.toggle('show');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      
      // Prevent body scroll when menu is open
      if (isOpen) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    };

    // Listen on both click and touchstart for better mobile support
    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('touchstart', function(e) {
      // Prevent double-firing on mobile
      e.preventDefault();
      toggleMenu(e);
    }, { passive: false });

    // Close menu when clicking outside (with better event handling)
    const closeMenu = function(e) {
      if (navMenu.classList.contains('show') && 
          !navMenu.contains(e.target) && 
          !hamburger.contains(e.target)) {
        navMenu.classList.remove('show');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }
    };
    
    document.addEventListener('click', closeMenu);
    document.addEventListener('touchstart', closeMenu, { passive: true });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('show');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > 900 && navMenu.classList.contains('show')) {
          navMenu.classList.remove('show');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          body.style.overflow = '';
        }
      }, 250);
    });
  }

  // ========== BACK TO TOP (show/hide + smooth scroll) ==========
  function initBackToTop(){
    const btn = document.querySelector('.backtop');
    if(!btn) return;
    const toggle = ()=>{
      const show = (window.pageYOffset || document.documentElement.scrollTop) > 200;
      if(show){ btn.classList.add('show'); }
      else { btn.classList.remove('show'); }
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
    btn.addEventListener('click', (e)=>{
      const href = btn.getAttribute('href') || '';
      if(href.startsWith('#')){ e.preventDefault(); }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== MOBILE DROPDOWN SUBMENU ==========
  function initDropdownMenu() {
    // Handle both the submenu-toggle buttons and parent links
    const submenuParents = document.querySelectorAll('.has-submenu');
    
    submenuParents.forEach(parent => {
      const toggleBtn = parent.querySelector('.submenu-toggle');
      const parentLink = parent.querySelector('a');
      const submenu = parent.querySelector('.submenu');
      
      if (!submenu) return;
      
      // Handle submenu-toggle button clicks (if it exists)
      if (toggleBtn) {
        const handleToggle = function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other open submenus
          if (window.innerWidth <= 900) {
            document.querySelectorAll('.has-submenu.open').forEach(other => {
              if (other !== parent) {
                other.classList.remove('open');
                const otherToggle = other.querySelector('.submenu-toggle');
                if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
              }
            });
          }
          
          const isOpen = parent.classList.toggle('open');
          toggleBtn.setAttribute('aria-expanded', String(isOpen));
        };
        
        toggleBtn.addEventListener('click', handleToggle);
        toggleBtn.addEventListener('touchstart', handleToggle, { passive: false });
      }
      
      // On mobile, also handle parent link clicks to toggle submenu
      if (parentLink && window.innerWidth <= 900) {
        parentLink.addEventListener('click', function(e) {
          // Only prevent default and toggle if we're on mobile
          if (window.innerWidth <= 900) {
            e.preventDefault();
            const isOpen = parent.classList.toggle('open');
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(isOpen));
          }
        });
      }
    });
  }

  // ========== STICKY HEADER ON SCROLL ==========
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 72;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ========== CAROUSEL/SLIDER TOUCH SWIPE ==========
  function initTouchSwipe() {
    const carousels = document.querySelectorAll('.carousel-container, .slider-container');
    
    carousels.forEach(carousel => {
      let isDown = false;
      let startX;
      let scrollLeft;

      carousel.addEventListener('mousedown', (e) => {
        if (window.innerWidth > 900) return; // Only on mobile
        isDown = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      });

      carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
      });

      carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
      });

      carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
      });

      // Touch events
      let touchStartX = 0;
      let touchScrollLeft = 0;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = carousel.scrollLeft;
      }, { passive: true });

      carousel.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        const walk = (touchStartX - touchX) * 1.5;
        carousel.scrollLeft = touchScrollLeft + walk;
      }, { passive: true });
    });
  }

  // ========== LAZY LOAD IMAGES ==========
  function initLazyLoad() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ========== REVEAL ANIMATION ON SCROLL ==========
  function initRevealAnimation() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      reveals.forEach(reveal => {
        revealObserver.observe(reveal);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      reveals.forEach(reveal => reveal.classList.add('in'));
    }
  }

  // ========== CAROUSEL NAVIGATION BUTTONS ==========
  function initCarouselNav() {
    const carousels = document.querySelectorAll('.itinerary-carousel, .testimonial-carousel, .experience-slider');
    
    carousels.forEach(carouselWrapper => {
      const prevBtn = carouselWrapper.querySelector('.carousel-nav.prev, .slider-nav.prev');
      const nextBtn = carouselWrapper.querySelector('.carousel-nav.next, .slider-nav.next');
      const container = carouselWrapper.querySelector('.carousel-container, .slider-container, .testimonial-container');
      
      if (!container) return;

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const scrollAmount = container.offsetWidth * 0.8;
          container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const scrollAmount = container.offsetWidth * 0.8;
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
      }
    });
  }

  // ========== TESTIMONIAL CAROUSEL AUTO-PLAY ==========
  function initTestimonialCarousel() {
    const carousels = document.querySelectorAll('.testimonial-carousel');
    
    carousels.forEach(carousel => {
      const testimonials = carousel.querySelectorAll('.testimonial');
      const prevBtn = carousel.querySelector('.carousel-nav.prev');
      const nextBtn = carousel.querySelector('.carousel-nav.next');
      
      if (testimonials.length <= 1) return;

      let currentIndex = 0;
      let autoPlayInterval;

      function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
          testimonial.classList.toggle('active', i === index);
        });
      }

      function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
      }

      function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
      }

      function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextTestimonial, 5000);
      }

      function stopAutoPlay() {
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
        }
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextTestimonial();
          startAutoPlay();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevTestimonial();
          startAutoPlay();
        });
      }

      // Start auto-play
      startAutoPlay();

      // Pause on hover (desktop only)
      if (window.innerWidth > 900) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
      }
    });
  }

  // ========== PREVENT ZOOM ON INPUT FOCUS (iOS) ==========
  function preventZoomOnFocus() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          this.style.fontSize = '16px';
        });
      });
    }
  }

  // ========== OPTIMIZE IMAGES FOR MOBILE ==========
  function optimizeImagesForMobile() {
    if (window.innerWidth <= 768) {
      const images = document.querySelectorAll('img[src*="/assets/img/"], img[src*="/assets3/img/"]');
      images.forEach(img => {
        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    }
  }

  // ========== HANDLE ORIENTATION CHANGE ==========
  function handleOrientationChange() {
    window.addEventListener('orientationchange', function() {
      // Close mobile menu on orientation change
      const navMenu = document.querySelector('nav ul');
      const hamburger = document.querySelector('.hamburger');
      
      if (navMenu && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }

      // Recalculate carousel positions
      setTimeout(function() {
        const carousels = document.querySelectorAll('.carousel-container, .slider-container');
        carousels.forEach(carousel => {
          carousel.scrollLeft = 0;
        });
      }, 200);
    });
  }

  // ========== FOOTER TOOLTIPS MOBILE FIX ==========
  function initFooterTooltips() {
    if (window.innerWidth <= 900) {
      const cards = document.querySelectorAll('footer .card[data-tooltip]');
      cards.forEach(card => {
        card.addEventListener('click', function(e) {
          const tooltip = this.getAttribute('data-tooltip');
          if (tooltip) {
            // Show tooltip for 2 seconds on mobile tap
            this.classList.add('tooltip-active');
            setTimeout(() => {
              this.classList.remove('tooltip-active');
            }, 2000);
          }
        });
      });
    }
  }

  // ========== INITIALIZE ALL FUNCTIONS ==========
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all functionality
    initMobileNav();
    initDropdownMenu();
    initStickyHeader();
    initSmoothScroll();
    initTouchSwipe();
    initLazyLoad();
    initRevealAnimation();
    initCarouselNav();
    initTestimonialCarousel();
    preventZoomOnFocus();
    optimizeImagesForMobile();
    handleOrientationChange();
    initFooterTooltips();
    initBackToTop();

    // Log success
    console.log('✓ Safari Chic: Mobile optimizations loaded');
  }

  // Start initialization
  init();

})();
