/**
 * Bilan Modern Work Shop - Main Interactions, PWA Installation & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const PHONE_NUMBER = '252618004826';

  // ==========================================
  // 1. PWA SERVICE WORKER & APP INSTALLATION
  // ==========================================
  let deferredPrompt = null;
  const installButtons = document.querySelectorAll('.install-app-trigger');
  const pwaInstallBanner = document.getElementById('pwaInstallBanner');
  const pwaBannerInstallBtn = document.getElementById('pwaBannerInstallBtn');
  const pwaBannerCloseBtn = document.getElementById('pwaBannerCloseBtn');

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./service-worker.js')
        .then((reg) => {
          console.log('[Bilan App] Service Worker diyaar ah:', reg.scope);
        })
        .catch((err) => {
          console.warn('[Bilan App] Service Worker cilad:', err);
        });
    });
  }

  // Intercept the install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default mini-infobar from appearing on mobile
    e.preventDefault();
    deferredPrompt = e;

    // Show custom install buttons and banner
    installButtons.forEach((btn) => btn.classList.remove('hidden'));
    if (pwaInstallBanner && !sessionStorage.getItem('pwa_banner_closed')) {
      pwaInstallBanner.classList.remove('hidden');
    }
  });

  // Function to trigger native installation prompt
  async function triggerInstallPrompt() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[Bilan App] Install choice outcome:', outcome);
      deferredPrompt = null;
      if (pwaInstallBanner) pwaInstallBanner.classList.add('hidden');
    } else {
      // If iOS Safari or prompt not supported
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        alert("Si aad ugu shubato iPhone-kaaga:\n1. Riix badhanka Share-ka (calaamadda ⬆️ hoose)\n2. Ka dooro 'Add to Home Screen' (Ku dar Shaashadda Hore)");
      } else {
        alert("Si aad ugu shubato nidaamka:\nKa eeg menu-ga browser-kaaga (3-da dhibcood ee sare) kaddibna riix 'Install App' ama 'Ku shubo Bilan Workshop'.");
      }
    }
  }

  installButtons.forEach((btn) => {
    btn.addEventListener('click', triggerInstallPrompt);
  });

  if (pwaBannerInstallBtn) {
    pwaBannerInstallBtn.addEventListener('click', triggerInstallPrompt);
  }

  if (pwaBannerCloseBtn && pwaInstallBanner) {
    pwaBannerCloseBtn.addEventListener('click', () => {
      pwaInstallBanner.classList.add('hidden');
      sessionStorage.setItem('pwa_banner_closed', 'true');
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('[Bilan App] Waxaa si guul leh loogu shubay nidaamka!');
    installButtons.forEach((btn) => btn.classList.add('hidden'));
    if (pwaInstallBanner) pwaInstallBanner.classList.add('hidden');
  });

  // ==========================================
  // 2. MOBILE MENU TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
      } else {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    });

    // Close mobile menu when clicking any nav link
    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (menuIcon) {
          menuIcon.classList.remove('fa-xmark');
          menuIcon.classList.add('fa-bars');
        }
      });
    });
  }

  // ==========================================
  // 3. STICKY HEADER ELEVATION
  // ==========================================
  const mainHeader = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      mainHeader.classList.add('shadow-md');
    } else {
      mainHeader.classList.remove('shadow-md');
    }
  });

  // ==========================================
  // 4. GALLERY CATEGORY FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.gallery-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button styling
      filterBtns.forEach((b) => {
        b.classList.remove('active', 'bg-blue-600', 'text-white');
        b.classList.add('bg-white/10', 'text-slate-300');
      });
      btn.classList.add('active', 'bg-blue-600', 'text-white');
      btn.classList.remove('bg-white/10', 'text-slate-300');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 5. CONTACT FORM WHATSAPP HANDLER
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const service = document.getElementById('formService').value;
      const branch = document.getElementById('formBranch').value;
      const message = document.getElementById('formMessage').value.trim();

      let text = `Asc Bilan Modern Work Shop 👋\n\n`;
      text += `Waxaan rabaa inaan idinla soo xiriiro:\n`;
      text += `👤 *Magaca:* ${name}\n`;
      text += `📞 *Telefoonka:* ${phone}\n`;
      text += `🛠️ *Adeegga:* ${service}\n`;
      text += `📍 *Xarunta Ku Dhow:* ${branch}\n`;
      if (message) {
        text += `📝 *Faahfaahin:* ${message}\n`;
      }
      text += `\nFadlan ila soo xiriira sida ugu dhaqsiyaha badan.`;

      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

});
