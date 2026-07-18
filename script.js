/* ==========================================================================
   JAVASCRIPT CORE LOGIC FOR DIVYA R'S PORTFOLIO
   Features: Glassmorphism theme, canvas particles, typing scripts,
   counters, real-time filters, validated mailer wrappers.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize EmailJS
  emailjs.init({
    publicKey: "JS-tTd_N1IHO3hwJm",
  });

  /* --------------------------------------------------------------------------
     1. PRELOADER & SCROLL INITIALIZERS
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  
  window.addEventListener('load', () => {
    if (preloader) {
      preloader.classList.add('fade-out');
      // Trigger initial scroll animations after preloader clears
      setTimeout(() => {
        animateSkillsProgress();
        triggerScrollRevelations();
      }, 300);
    }
  });

  // Safe fallback if window load doesn't fire
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 3500);

  /* --------------------------------------------------------------------------
     2. DARK & LIGHT MODE THEME MANAGER
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlElement = document.documentElement;

  // Retrieve saved theme preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark'; // default to premium dark mode
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(targetTheme);
    });
  }

  function setTheme(themeName) {
    htmlElement.setAttribute('data-theme', themeName);
    localStorage.setItem('portfolio-theme', themeName);
    
    // Update theme toggle icon
    if (themeToggleBtn) {
      const icon = themeToggleBtn.querySelector('i');
      if (icon) {
        if (themeName === 'dark') {
          icon.className = 'fa-solid fa-sun';
        } else {
          icon.className = 'fa-solid fa-moon';
        }
      }
    }
  }

  /* --------------------------------------------------------------------------
     3. INTERACTIVE CANVAS PARTICLE NETWORK
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 120 };

    // Set canvas dimensions
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle blueprint
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        // Soft particles matching the text color theme
        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(79, 70, 229, 0.08)';
        ctx.fill();
      }

      update() {
        // Bounce off borders
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Particle repulsion from mouse pointer coordinates
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
              this.x += 3;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
              this.x -= 3;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
              this.y += 3;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
              this.y -= 3;
            }
          }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Initialize particle population
    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 3 + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() * 0.5) - 0.25;
        let directionY = (Math.random() * 0.5) - 0.25;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
      }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    // Connecting lines calculation
    function connectParticles() {
      const isDark = htmlElement.getAttribute('data-theme') === 'dark';
      const maxDistance = 140;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            let alpha = (1 - (distance / maxDistance)) * 0.1;
            ctx.strokeStyle = isDark ? `rgba(139, 92, 246, ${alpha})` : `rgba(79, 70, 229, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Rendering loop animation frame
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* --------------------------------------------------------------------------
     4. CURSOR HOVER GLOW FOLLOWER
     -------------------------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      // Use requestAnimationFrame for smoother cursor rendering
      requestAnimationFrame(() => {
        cursorGlow.style.left = (e.clientX - 200) + 'px';
        cursorGlow.style.top = (e.clientY - 200) + 'px';
      });
    });

    window.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  /* --------------------------------------------------------------------------
     5. HEADER STICKY & ACTIVE LINK SCROLL INDICATORS
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // 1. Header scroll transform
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // 2. Top Scroll progress bar percent
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);

    // 3. Update active nav menu item on scroll
    let currentSection = '';
    sections.forEach(sec => {
      const top = window.scrollY;
      const offset = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      
      if (top >= offset && top < offset + height) {
        currentSection = id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. MOBILE HAMBURGER MENU OVERLAY
     -------------------------------------------------------------------------- */
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navMenu = document.getElementById('navMenu');

  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', () => {
      menuToggleBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when navigation link clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggleBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. HERO TYPING ROLE ANIMATION
     -------------------------------------------------------------------------- */
  const roleText = document.getElementById('role-text');
  if (roleText) {
    const words = [
      'Freelance Web Developer',
      'Frontend Developer',
      'React Developer',
      'Web Developer',
      'B.Tech IT Student'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        roleText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // faster deleting speeds
      } else {
        roleText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // standard typing speeds
      }

      // Finish typing word
      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2000; // hold words briefly
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500; // quick delay before typing next
      }

      setTimeout(typeEffect, typingSpeed);
    }

    // Initialize loop typing script
    setTimeout(typeEffect, 1000);
  }

  /* --------------------------------------------------------------------------
     8. SCROLL TRIGGER ANIMATED COUNTERS
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateStatsCounters() {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const decimals = parseInt(stat.getAttribute('data-decimals')) || 0;
      const duration = 2000; // milliseconds
      let startTimestamp = null;

      function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing out calculation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeProgress * target;
        
        stat.textContent = currentVal.toFixed(decimals) + (target % 1 === 0 && !decimals ? '+' : '');
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          stat.textContent = target.toFixed(decimals) + (target % 1 === 0 && !decimals ? '+' : '');
        }
      }

      window.requestAnimationFrame(step);
    });
  }

  /* --------------------------------------------------------------------------
     9. MULTI-TAB SWITCHER (ABOUT SECTION)
     -------------------------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Deactivate other tabs
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      // Activate active targets
      btn.classList.add('active');
      const activePanel = document.getElementById(targetId);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     10. SKILLS FILTER & SEARCH ENGINE
     -------------------------------------------------------------------------- */
  const skillsSearch = document.getElementById('skillsSearch');
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card-wrap');

  function filterSkills() {
    const searchQuery = skillsSearch ? skillsSearch.value.toLowerCase().trim() : '';
    const activeFilterBtn = document.querySelector('.skill-tab-btn.active');
    const selectedCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    skillCards.forEach(card => {
      const name = card.querySelector('.skill-card-name').textContent.toLowerCase();
      const categories = card.getAttribute('data-categories').split(' ');

      const matchesSearch = name.includes(searchQuery);
      const matchesCategory = selectedCategory === 'all' || categories.includes(selectedCategory);

      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
        // Re-trigger the scale transition
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  // Bind typing inputs
  if (skillsSearch) {
    skillsSearch.addEventListener('input', filterSkills);
  }

  // Bind category button filters
  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterSkills();
    });
  });

  // Skills progress fillers animation trigger
  function animateSkillsProgress() {
    const progressFills = document.querySelectorAll('.skill-progress-fill');
    progressFills.forEach(fill => {
      const progress = fill.getAttribute('data-progress');
      fill.style.width = progress;
    });
  }

  /* --------------------------------------------------------------------------
     11. PROJECT FILTER LOGIC
     -------------------------------------------------------------------------- */
  const projectTabBtns = document.querySelectorAll('.project-tab-btn');
  const projectCards = document.querySelectorAll('.project-card-wrap');

  projectTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories').split(' ');

        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     12. PROJECT CASE STUDY ACCORDION EXPANSIONS
     -------------------------------------------------------------------------- */
  const caseStudyTriggers = document.querySelectorAll('.case-study-trigger');

  caseStudyTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isExpanded = trigger.classList.contains('active');

      // Collapse other expanded panels for neatness
      caseStudyTriggers.forEach(t => {
        if (t !== trigger && t.classList.contains('active')) {
          t.classList.remove('active');
          t.nextElementSibling.classList.remove('active');
          t.nextElementSibling.style.maxHeight = null;
        }
      });

      if (isExpanded) {
        trigger.classList.remove('active');
        panel.classList.remove('active');
        panel.style.maxHeight = null;
      } else {
        trigger.classList.add('active');
        panel.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* --------------------------------------------------------------------------
     13. CONTACT FORM ROBUST REGEX VALIDATION & MOCK SUBMIT
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const formStatusAlert = document.getElementById('formStatusAlert');
  const formStatusText = document.getElementById('formStatusText');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Regex templates
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  function validateName() {
    const isValid = nameInput.value.trim().length >= 2;
    toggleFieldState(nameInput, nameError, isValid);
    return isValid;
  }

  function validateEmail() {
    const isValid = emailRegex.test(emailInput.value.trim());
    toggleFieldState(emailInput, emailError, isValid);
    return isValid;
  }

  function validateMessage() {
    const isValid = messageInput.value.trim().length >= 10;
    toggleFieldState(messageInput, messageError, isValid);
    return isValid;
  }

  function toggleFieldState(input, errorElement, isValid) {
    if (isValid) {
      input.classList.remove('input-error');
      if (errorElement) errorElement.classList.remove('show');
    } else {
      input.classList.add('input-error');
      if (errorElement) errorElement.classList.add('show');
    }
  }

  // Real-time blur inputs
  if (nameInput) nameInput.addEventListener('blur', validateName);
  if (emailInput) emailInput.addEventListener('blur', validateEmail);
  if (messageInput) messageInput.addEventListener('blur', validateMessage);

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Trigger all validation steps
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        showStatus('Please resolve validation errors in the fields above.', 'error');
        return;
      }

      // If valid, launch submission logic (configured for EmailJS)
      submitBtn.disabled = true;
      const originalText = submitBtnText.textContent;
      submitBtnText.textContent = 'Sending Message...';
      const icon = submitBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-spinner fa-spin';

      // Real EmailJS Send Implementation
      emailjs.send("service_4ocu1yo", "template_ecrky6q", {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      })
      .then(() => {
        // Show success status message
        showStatus('✅ Your message has been sent successfully. Thank you!', 'success');
        // Reset the contact form
        contactForm.reset();
        
        // Restore submit button state and icon
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
        if (icon) icon.className = 'fa-solid fa-paper-plane';
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        // Show error status message
        showStatus('❌ Failed to send your message. Please try again later.', 'error');
        
        // Restore submit button state and icon even on failure
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
        if (icon) icon.className = 'fa-solid fa-paper-plane';
      });
    });
  }

  function showStatus(message, statusType) {
    if (formStatusAlert && formStatusText) {
      formStatusText.textContent = message;
      formStatusAlert.className = 'form-status-alert show';
      if (statusType === 'success') {
        formStatusAlert.classList.add('alert-success');
      } else {
        formStatusAlert.classList.add('alert-error');
      }

      // Auto fade status alert after 5 seconds
      setTimeout(() => {
        formStatusAlert.classList.remove('show');
      }, 5000);
    }
  }

  /* --------------------------------------------------------------------------
     14. BACK TO TOP TRIGGER BUTTON
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     15. SCROLL OBSERVER REVEAL INTERACTIVE EFFECTS
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal, .zoom-in, .fade-in');
  let observerActivated = false;

  function triggerScrollRevelations() {
    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    };

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // If stats container is scrolled in, trigger count up
          if (entry.target.classList.contains('hero-stats') && !observerActivated) {
            animateStatsCounters();
            observerActivated = true;
          }
          
          // Unobserve once shown for rendering optimization
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      intersectionObserver.observe(el);
    });
  }
  
  triggerScrollRevelations();

  /* --------------------------------------------------------------------------
     16. RESUME VIEW MODAL SYSTEM
     -------------------------------------------------------------------------- */
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const resumeModalOverlay = document.getElementById('resumeModalOverlay');

  if (viewResumeBtn && resumeModal) {
    viewResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }

  if (closeResumeModalBtn) {
    closeResumeModalBtn.addEventListener('click', closeResumeModal);
  }

  if (resumeModalOverlay) {
    resumeModalOverlay.addEventListener('click', closeResumeModal);
  }

  function openResumeModal() {
    resumeModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeResumeModal() {
    resumeModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
      closeResumeModal();
    }
  });
});
