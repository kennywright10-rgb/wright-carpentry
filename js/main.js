/* ============================================================
   Wright Carpentry — Main JavaScript
   ============================================================ */

// Navbar scroll behavior
const navbar = document.getElementById('navbar');
const heroHeight = window.innerHeight * 0.6;

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Simple scroll-based AOS (Animate On Scroll)
const aosElements = document.querySelectorAll('[data-aos]');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.08
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-aos-delay') || 0;
      setTimeout(() => {
        entry.target.classList.add('aos-animate');
      }, parseInt(delay));
    }
  });
}, observerOptions);

aosElements.forEach(el => observer.observe(el));

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(fi => {
      fi.classList.remove('open');
      const ans = fi.querySelector('.faq-answer');
      if (ans) ans.classList.remove('open');
    });

    // Open clicked (if wasn't already open)
    if (!isOpen) {
      item.classList.add('open');
      if (answer) answer.classList.add('open');
    }
  });
});

// Smooth active nav link highlighting
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sec.id) {
          link.classList.add('active');
        }
      });
    }
  });
});

// Animated counter for stats
function animateCounter(el, target, duration = 1800) {
  const start = 0;
  const startTime = performance.now();
  const suffix = el.dataset.suffix || '';

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(start + (target - start) * eased);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      if (!isNaN(target)) {
        animateCounter(el, target);
        statObserver.unobserve(el);
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));

// Contact form handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate submission (replace with real endpoint)
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#2E7D32';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1500);
  });
}

// Gallery lightbox (simple)
document.querySelectorAll('.gallery-item').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:9999;
      display:flex; align-items:center; justify-content:center; cursor:zoom-out;
    `;
    const image = document.createElement('img');
    image.src = img.src;
    image.style.cssText = 'max-width:90vw; max-height:90vh; object-fit:contain; border-radius:8px;';
    overlay.appendChild(image);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  });
});

// Set active nav link based on current page
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '/' && href === '/') ||
      (currentPath.includes(href) && href !== '/')) {
    link.classList.add('active');
  }
});
