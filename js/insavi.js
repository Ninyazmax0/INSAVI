document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNavList = document.getElementById('mainNavList');

  if (mobileMenuBtn && mainNavList) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNavList.classList.toggle('mobile-open');
    });

    mainNavList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNavList.classList.remove('mobile-open');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const navLinks = document.querySelectorAll('.nav-list .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveSection() {
    let currentId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  const animatedElements = document.querySelectorAll(
    '.stat-item, .mv-card, .feature-card, .academic-card, .gallery-card, .contact-card-box'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${(index % 4) * 0.1}s, transform 0.5s cubic-bezier(0.2, 0, 0, 1) ${(index % 4) * 0.1}s`;
      observer.observe(el);
    });
  }

  const topbar = document.querySelector('.topbar-insavi');
  if (topbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        topbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.35)';
        topbar.style.background = 'rgba(9, 20, 40, 0.98)';
      } else {
        topbar.style.boxShadow = 'none';
        topbar.style.background = 'rgba(9, 20, 40, 0.94)';
      }
    }, { passive: true });
  }

  console.log('%c[INSAVI] Portal informativo institucional cargado exitosamente 🦅', 'color: #10b981; font-weight: bold;');
});