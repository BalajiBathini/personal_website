// ===========================
// Loading Screen
// ===========================

class LoadingScreen {
  constructor() {
    this.screen = document.getElementById('loadingScreen');
    this.progressBar = document.getElementById('progressBar');
    this.progressText = document.getElementById('progressText');
    this.init();
  }

  init() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        this.complete();
      }
      this.updateProgress(progress);
    }, 100);
  }

  updateProgress(progress) {
    const roundedProgress = Math.min(100, Math.floor(progress));
    this.progressBar.style.width = roundedProgress + '%';
    this.progressText.textContent = `Loading systems... ${roundedProgress}%`;
  }

  complete() {
    setTimeout(() => {
      this.screen.classList.add('hidden');
    }, 300);
  }
}

// ===========================
// Particle Background
// ===========================

class ParticleBackground {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 80;
    this.connectionDistance = 150;
    this.mouseRadius = 100;
    this.mouseX = 0;
    this.mouseY = 0;

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.mouseRadius) {
        const force = (this.mouseRadius - distance) / this.mouseRadius;
        particle.vx -= (dx / distance) * force * 0.02;
        particle.vy -= (dy / distance) * force * 0.02;
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(195, 100%, 50%, ${particle.opacity})`;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const connDx = particle.x - other.x;
        const connDy = particle.y - other.y;
        const connDistance = Math.sqrt(connDx * connDx + connDy * connDy);

        if (connDistance < this.connectionDistance) {
          const opacity = (1 - connDistance / this.connectionDistance) * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `hsla(195, 100%, 50%, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(this.animate);
  };
}

// ===========================
// Navigation
// ===========================

class Navigation {
  constructor() {
    this.nav = document.getElementById('navigation');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navLinks = document.getElementById('navLinks');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
    this.navToggle?.addEventListener('click', () => this.toggleMenu());
    this.navLinks?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => this.closeMenu());
    });
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }

  toggleMenu() {
    this.navLinks.classList.toggle('open');
    this.navToggle.classList.toggle('open');
  }

  closeMenu() {
    this.navLinks.classList.remove('open');
    this.navToggle?.classList.remove('open');
  }
}

// ===========================
// Hero Section - Role Animation
// ===========================

class RoleAnimation {
  constructor() {
    this.roles = [
      'Software Developer',
      'Python Engineer',
      'Odoo Specialist',
      'Full-Stack Developer',
      'AI Enthusiast',
    ];
    this.currentRoleIndex = 0;
    this.displayText = '';
    this.isDeleting = false;
    this.roleText = document.getElementById('roleText');
    this.init();
  }

  init() {
    this.animate();
  }

  animate = () => {
    const currentRole = this.roles[this.currentRoleIndex];
    const typeSpeed = this.isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!this.isDeleting) {
        if (this.displayText.length < currentRole.length) {
          this.displayText = currentRole.slice(0, this.displayText.length + 1);
          this.roleText.textContent = this.displayText;
        } else {
          setTimeout(() => {
            this.isDeleting = true;
            this.animate();
          }, 2000);
          return;
        }
      } else {
        if (this.displayText.length > 0) {
          this.displayText = this.displayText.slice(0, -1);
          this.roleText.textContent = this.displayText;
        } else {
          this.isDeleting = false;
          this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
        }
      }
      this.animate();
    }, typeSpeed);
  };
}

// ===========================
// Skill Meters Animation
// ===========================

class SkillMeter {
  constructor(element, percentage) {
    this.element = element;
    this.percentage = percentage;
    this.circle = element.querySelector('.progress-circle');
    this.percentageDisplay = element.querySelector('.skill-percentage');
    this.animatedPercentage = 0;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(this.element);
  }

  animate() {
    const duration = 1500;
    const steps = 60;
    const stepValue = this.percentage / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += stepValue;
      if (current >= this.percentage) {
        this.animatedPercentage = this.percentage;
        clearInterval(interval);
      } else {
        this.animatedPercentage = Math.round(current);
      }
      this.percentageDisplay.textContent = this.animatedPercentage + '%';
    }, duration / steps);
  }
}

// ===========================
// Scroll To Section
// ===========================

function scrollToSection(selector) {
  event.preventDefault();
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===========================
// Initialize Everything
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Initialize loading screen
  new LoadingScreen();

  // Initialize particle background
  new ParticleBackground();

  // Initialize navigation
  new Navigation();

  // Initialize role animation
  new RoleAnimation();

  // Initialize skill meters
  document.querySelectorAll('.skill-meter').forEach((meter) => {
    const percentage = parseInt(meter.querySelector('.skill-percentage').textContent);
    new SkillMeter(meter, percentage);
  });

  // Handle contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      
      // Update button state
      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending...';
      
      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Show success message
          showNotification('Message Sent!', 'Thank you for reaching out. I\'ll get back to you soon.');
          // Reset form
          contactForm.reset();
        } else {
          const data = await response.json();
          if (Object.hasOwn(data, 'errors')) {
            showNotification('Oops!', data["errors"].map(error => error["message"]).join(", "));
          } else {
            showNotification('Oops!', 'There was a problem submitting your form');
          }
        }
      } catch (error) {
        showNotification('Oops!', 'There was a problem submitting your form');
      } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  }

  // Add animation delays
  const animateElements = document.querySelectorAll('[style*="animation-delay"]');
  animateElements.forEach((el) => {
    el.style.animationFillMode = 'both';
  });
});

// ===========================
// Notification
// ===========================

function showNotification(title, message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification-content">
      <h3 class="notification-title">${title}</h3>
      <p class="notification-message">${message}</p>
    </div>
  `;
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}