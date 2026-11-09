/**
 * Xavcomm'27 - Main Client Script
 * Handles navigation, countdown timer, tier tabs, deliverables filter, and sponsorship inquiry interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initMobileMenu();
  initScrollEffects();
  initDeliverableSearch();
  initPosterCanvas();
  initBackgroundCanvas();
});

/**
 * Live Countdown Timer to January 29, 2027
 */
function initCountdown() {
  const targetDate = new Date('January 29, 2027 09:00:00 GMT+0530').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMinutes = document.getElementById('cd-minutes');
    const elSeconds = document.getElementById('cd-seconds');

    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMinutes) elMinutes.textContent = pad(minutes);
    if (elSeconds) elSeconds.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/**
 * Mobile Navigation Toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

/**
 * Navbar & Back-to-Top scroll behavior
 */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar backdrop depth
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('shadow-xl', 'shadow-black/40', 'border-neutral-800');
      } else {
        navbar.classList.remove('shadow-xl', 'shadow-black/40', 'border-neutral-800');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Sponsorship Tiers Filter Tab Switcher
 */
function switchTierTab(tab) {
  const btnMonetary = document.getElementById('btnMonetary');
  const btnInKind = document.getElementById('btnInKind');
  const monetaryView = document.getElementById('monetaryView');
  const inKindView = document.getElementById('inKindView');

  if (tab === 'monetary') {
    btnMonetary.className = 'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all bg-amber-500 text-neutral-950 shadow-md';
    btnInKind.className = 'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all text-neutral-400 hover:text-white';
    monetaryView.classList.remove('hidden');
    inKindView.classList.add('hidden');
  } else {
    btnInKind.className = 'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all bg-amber-500 text-neutral-950 shadow-md';
    btnMonetary.className = 'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all text-neutral-400 hover:text-white';
    inKindView.classList.remove('hidden');
    monetaryView.classList.add('hidden');
  }
}

/**
 * Quick-fill tier into form and jump to contact section
 */
function selectTierAndContact(tierName) {
  const tierSelect = document.getElementById('sponsorTier');
  const contactSection = document.getElementById('contact');
  const nameField = document.getElementById('contactName');

  if (tierSelect) {
    tierSelect.value = tierName;
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (nameField) {
        nameField.focus();
      }
    }, 600);
  }
}

/**
 * Deliverables Table Search Filter
 */
function initDeliverableSearch() {
  const searchInput = document.getElementById('deliverableSearch');
  const tableBody = document.getElementById('deliverablesTableBody');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach((row) => {
      const text = row.cells[0]?.textContent.toLowerCase() || '';
      if (text.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

/**
 * High-Resolution Poster Rendering via PDF.js
 */
function initPosterCanvas() {
  const canvas = document.getElementById('posterCanvas');
  const loadingEl = document.getElementById('posterLoading');

  if (!canvas || typeof pdfjsLib === 'undefined') return;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // Support both root-level compressed PDF (deployed on GitHub/Vercel) and local nested assets path
  const posterPdfUrls = [
    "Xavcomm' 27 (1)_compressed.pdf",
    "assets/docs/Xavcomm27_Official_Poster.pdf",
    "official_poster.png"
  ];

  function tryLoadPoster(urlIndex) {
    if (urlIndex >= posterPdfUrls.length) {
      if (loadingEl) {
        loadingEl.innerHTML = `
          <div class="py-10 text-center">
            <i class="fa-solid fa-file-pdf text-4xl text-amber-400 mb-3 block"></i>
            <span class="text-neutral-300 block font-semibold mb-2">Official Xavcomm'27 Poster Available</span>
            <a href="Xavcomm' 27 (1)_compressed.pdf" target="_blank" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs uppercase tracking-wider">
              <i class="fa-solid fa-expand"></i> View Poster PDF
            </a>
          </div>
        `;
      }
      return;
    }

    const currentUrl = posterPdfUrls[urlIndex];

    // If it's a PNG image, draw directly to canvas
    if (currentUrl.endsWith('.png') || currentUrl.endsWith('.jpg')) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 1200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        if (loadingEl) loadingEl.classList.add('hidden');
        canvas.classList.remove('hidden');
      };
      img.onerror = () => tryLoadPoster(urlIndex + 1);
      img.src = currentUrl;
      return;
    }

    pdfjsLib.getDocument(currentUrl).promise
      .then((pdf) => pdf.getPage(1))
      .then((page) => {
        const containerWidth = canvas.parentElement?.clientWidth || 500;
        const initialViewport = page.getViewport({ scale: 1 });
        const scale = (containerWidth / initialViewport.width) * 1.5;
        const viewport = page.getViewport({ scale });

        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        return page.render({ canvasContext: context, viewport: viewport }).promise;
      })
      .then(() => {
        if (loadingEl) loadingEl.classList.add('hidden');
        canvas.classList.remove('hidden');
      })
      .catch((err) => {
        console.warn(`Could not load poster from ${currentUrl}, trying fallback...`, err);
        tryLoadPoster(urlIndex + 1);
      });
  }

  tryLoadPoster(0);
}

/**
 * Direct WhatsApp Inquiry Handler
 * Opens WhatsApp to Student Convenor (Shomili Mukherjee: +91 7439409936)
 */
function sendViaWhatsApp() {
  const name = document.getElementById('contactName')?.value.trim();
  const company = document.getElementById('companyName')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  const phone = document.getElementById('contactPhone')?.value.trim();
  const tier = document.getElementById('sponsorTier')?.value;
  const message = document.getElementById('contactMessage')?.value.trim();

  if (!name || !company) {
    alert('Please enter your name and organization before connecting on WhatsApp.');
    document.getElementById('contactName')?.focus();
    return;
  }

  const textLines = [
    `*Xavcomm'27 Sponsorship Inquiry*`,
    `---------------------------------`,
    `*Name:* ${name}`,
    `*Organization:* ${company}`,
    `*Email:* ${email || 'Not provided'}`,
    `*Phone:* ${phone || 'Not provided'}`,
    `*Selected Tier:* ${tier || 'Discussion / Custom'}`,
    message ? `*Message:* ${message}` : ''
  ].filter(Boolean).join('\n');

  const encodedText = encodeURIComponent(textLines);
  const waUrl = `https://wa.me/917439409936?text=${encodedText}`;
  window.open(waUrl, '_blank');
}

/**
 * Sponsorship Inquiry Form Submission
 */
function handleInquirySubmit(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('submitInquiryBtn');
  const successAlert = document.getElementById('formSuccessAlert');
  const form = document.getElementById('sponsorInquiryForm');

  const name = document.getElementById('contactName')?.value.trim();
  const company = document.getElementById('companyName')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  const phone = document.getElementById('contactPhone')?.value.trim();
  const tier = document.getElementById('sponsorTier')?.value;
  const message = document.getElementById('contactMessage')?.value.trim();

  if (!submitBtn) return;

  const originalContent = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Submitting...</span>`;

  setTimeout(() => {
    submitBtn.innerHTML = originalContent;
    submitBtn.disabled = false;
    
    if (successAlert) {
      successAlert.classList.remove('hidden');
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Also trigger mailto so user's email client prepares the draft directly to Xavcommm2027@gmail.com
    const mailSubject = encodeURIComponent(`[Xavcomm'27 Sponsorship] ${company} - ${tier}`);
    const mailBody = encodeURIComponent(
      `Hello Xavcomm'27 Convenors,\n\n` +
      `We are interested in partnering with Xavcomm'27.\n\n` +
      `Organization: ${company}\n` +
      `Contact Person: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Preferred Package: ${tier}\n\n` +
      `Message:\n${message}\n\n` +
      `Looking forward to hearing from you.\n`
    );

    const mailtoUrl = `mailto:Xavcommm2027@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    
    // Give brief delay so they see confirmation before optionally launching mail app
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 1200);

    form.reset();

    // Auto-hide success notification after 10 seconds
    setTimeout(() => {
      if (successAlert) {
        successAlert.classList.add('hidden');
      }
    }, 10000);
  }, 700);
}

/**
 * Ambient Golden Dust & Ember Particles Background Canvas
 */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Track window resizing
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle configuration
  const particleCount = Math.min(Math.floor((width * height) / 25000), 55);
  const particles = [];

  const goldColors = [
    'rgba(243, 229, 171, ', // Light gold
    'rgba(212, 175, 55, ',   // Classic gold
    'rgba(197, 155, 39, ',   // Bronze
    'rgba(255, 255, 255, '   // Starlight white
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 1.6 + 0.6;
      this.speedY = -(Math.random() * 0.45 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.baseAlpha = Math.random() * 0.45 + 0.2;
      this.colorPrefix = goldColors[Math.floor(Math.random() * goldColors.length)];
      this.phase = Math.random() * Math.PI * 2;
      this.fadeSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.phase) * 0.2;
      this.phase += this.fadeSpeed;

      // Wrap around when exiting viewport top
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      const alpha = this.baseAlpha * (0.6 + 0.4 * Math.sin(this.phase));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.colorPrefix + alpha + ')';
      ctx.fill();

      // Soft glow for larger particles
      if (this.radius > 1.4) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.colorPrefix + (alpha * 0.25) + ')';
        ctx.fill();
      }
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


