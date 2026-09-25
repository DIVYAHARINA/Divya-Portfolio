document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const header = document.getElementById('header');
  const themeButton = document.getElementById('themeToggleBtn');
  const menuButton = document.getElementById('menuToggleBtn');
  const navMenu = document.getElementById('navMenu');
  const navWrapper = document.querySelector('.nav-wrapper');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme applies to the complete document and survives refreshes.
  const setTheme = (theme) => {
    const value = theme === 'light' ? 'light' : 'dark';
    html.dataset.theme = value;
    localStorage.setItem('portfolio-theme', value);
    const icon = themeButton?.querySelector('i');
    if (icon) icon.className = value === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    themeButton?.setAttribute('aria-label', value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  setTheme(localStorage.getItem('portfolio-theme') || 'dark');
  themeButton?.addEventListener('click', () => setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark'));

  // Compact sticky header and active section state.
  const sections = [...document.querySelectorAll('section[id]')];
  const links = [...document.querySelectorAll('.nav-link')];
  const updateScrollState = () => {
    header?.classList.toggle('sticky', window.scrollY > 35);
    const current = sections.reduce((active, section) => {
      return window.scrollY >= section.offsetTop - 150 ? section.id : active;
    }, 'home');
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    const height = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--scroll-progress', `${height ? (window.scrollY / height) * 100 : 0}%`);
    document.getElementById('backToTopBtn')?.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  // The mobile control belongs to the wrapper, not the list itself.
  menuButton?.addEventListener('click', () => {
    const open = !navWrapper?.classList.contains('active');
    navWrapper?.classList.toggle('active', open);
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });
  links.forEach(link => link.addEventListener('click', () => {
    navWrapper?.classList.remove('active');
    menuButton?.classList.remove('active');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  // Keep genuine values visible even before the counter animation begins.
  const counters = [...document.querySelectorAll('.stat-number')];
  const formatCounter = (element, value) => {
    const decimals = Number(element.dataset.decimals || 0);
    element.textContent = `${Number(value).toFixed(decimals)}${decimals ? '' : '+'}`;
  };
  counters.forEach(counter => {
    const target = Number(counter.dataset.target);
    if (Number.isFinite(target)) formatCounter(counter, target);
  });
  let countersAnimated = false;
  const animateCounters = () => {
    if (countersAnimated || reducedMotion) return;
    countersAnimated = true;
    counters.forEach(counter => {
      const target = Number(counter.dataset.target);
      if (!Number.isFinite(target)) return;
      const decimals = Number(counter.dataset.decimals || 0);
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / 900, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${(target * eased).toFixed(decimals)}${decimals ? '' : '+'}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  // Lightweight particle background; skip it for reduced motion and small screens.
  const canvas = document.getElementById('particles-canvas');
  if (canvas && !reducedMotion && window.innerWidth > 700) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: Math.min(55, Math.floor(canvas.width * canvas.height / 24000)) }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25
      }));
    };
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = html.dataset.theme === 'dark' ? '139,92,246' : '79,70,229';
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = `rgba(${color},.22)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]; const dx = p.x - q.x; const dy = p.y - q.y; const d = Math.hypot(dx, dy);
          if (d < 120) { ctx.strokeStyle = `rgba(${color},${(1 - d / 120) * .09})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
      });
      requestAnimationFrame(render);
    };
    resize(); window.addEventListener('resize', resize, { passive: true }); render();
  }

  // Typing effect, kept lightweight and disabled for reduced motion.
  const role = document.getElementById('role-text');
  if (role && !reducedMotion) {
    const words = ['Freelance Web Developer', 'Frontend Developer', 'React Developer', 'Web Developer', 'B.Tech IT Student'];
    let word = 0, character = 0, deleting = false;
    const type = () => {
      const value = words[word];
      role.textContent = value.slice(0, deleting ? --character : ++character);
      if (!deleting && character === value.length) { deleting = true; return setTimeout(type, 1800); }
      if (deleting && character === 0) { deleting = false; word = (word + 1) % words.length; return setTimeout(type, 450); }
      setTimeout(type, deleting ? 45 : 85);
    };
    setTimeout(type, 700);
  }

  // Tabs, filters, accordions, validation, reveal animations and resume modal.
  document.querySelectorAll('.tab-btn').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.tab-content-panel').forEach(panel => panel.classList.remove('active'));
    button.classList.add('active'); document.getElementById(button.dataset.tab)?.classList.add('active');
  }));

  const filterCards = (buttons, cards, attribute, display = 'block') => buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(item => item.classList.remove('active')); button.classList.add('active');
    const filter = button.dataset.filter;
    cards.forEach(card => {
      const categories = (card.getAttribute(attribute) || '').split(' ');
      const show = filter === 'all' || categories.includes(filter);
      card.style.display = show ? display : 'none';
      if (show) requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'none'; });
    });
  }));
  const skillSearch = document.getElementById('skillsSearch');
  const skillCards = [...document.querySelectorAll('.skill-card-wrap')];
  const skillButtons = [...document.querySelectorAll('.skill-tab-btn')];
  const filterSkills = () => {
    const query = (skillSearch?.value || '').toLowerCase();
    const category = document.querySelector('.skill-tab-btn.active')?.dataset.filter || 'all';
    skillCards.forEach(card => { const name = card.querySelector('.skill-card-name')?.textContent.toLowerCase() || ''; const cats = (card.dataset.categories || '').split(' '); card.style.display = (name.includes(query) && (category === 'all' || cats.includes(category))) ? 'block' : 'none'; });
  };
  skillSearch?.addEventListener('input', filterSkills); skillButtons.forEach(button => button.addEventListener('click', () => { skillButtons.forEach(item => item.classList.remove('active')); button.classList.add('active'); filterSkills(); }));
  filterCards([...document.querySelectorAll('.project-tab-btn')], [...document.querySelectorAll('.project-card-wrap')], 'data-categories', 'flex');

  document.querySelectorAll('.case-study-trigger').forEach(trigger => trigger.addEventListener('click', () => {
    const panel = trigger.nextElementSibling; const open = trigger.classList.toggle('active');
    panel?.classList.toggle('active', open); if (panel) panel.style.maxHeight = open ? `${panel.scrollHeight}px` : null;
    trigger.setAttribute('aria-expanded', String(open));
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); if (entry.target.classList.contains('hero-stats')) animateCounters(); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal, .zoom-in, .fade-in').forEach(element => observer.observe(element));

  document.getElementById('backToTopBtn')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const resume = document.getElementById('resumeModal');
  const closeResume = () => { resume?.classList.remove('active'); document.body.classList.remove('modal-open'); };
  document.getElementById('viewResumeBtn')?.addEventListener('click', event => { event.preventDefault(); resume?.classList.add('active'); document.body.classList.add('modal-open'); });
  document.getElementById('closeResumeModalBtn')?.addEventListener('click', closeResume);
  document.getElementById('resumeModalOverlay')?.addEventListener('click', closeResume);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeResume(); });

  document.querySelectorAll('.skill-progress-fill').forEach(fill => { fill.style.width = fill.dataset.progress || '0'; });
  document.getElementById('preloader')?.classList.add('fade-out');
});
