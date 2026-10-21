/**
 * ==============================================================================
 * NEXORA by Ujjwal - Flagship Product Marketing Landing Page Script
 * ------------------------------------------------------------------------------
 * Technologies: HTML5, CSS3, Vanilla JavaScript (ES6+), Web Audio API
 * Features:
 *   1. Scroll Progress Bar
 *   2. Futuristic Web Audio Synthesizer (SFX Toggle)
 *   3. Interactive Hero Finish Switcher & Ambient Aura Sync
 *   4. 3D Mouse Parallax & Specular Light Glare
 *   5. Interactive Hotspot Pins & Micro-Tooltips
 *   6. 120W HyperCharge Real-Time Interactive Simulator
 *   7. 108MP Camera Lab Viewfinder with Focal Length Zoom
 *   8. Interactive Product Image Gallery with Crossfade
 *   9. Accessible FAQ Accordion
 *  10. Sticky Navbar, Scrollspy, & Scroll-to-Top Button
 *  11. Interactive Buy Now Modal with Coupon Code & Order Receipt
 *  12. Newsletter Form Validation & Animated Toasts
 *  13. Scroll Reveal Animations (IntersectionObserver)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================================
  // 1. TOP SCROLL PROGRESS BAR
  // ============================================================================
  const scrollProgress = document.getElementById('scrollProgress');

  const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ============================================================================
  // 2. FUTURISTIC WEB AUDIO SYNTHESIZER (NO EXTERNAL AUDIO FILES NEEDED)
  // ============================================================================
  let audioCtx = null;
  let soundEnabled = true;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  // Synthesize futuristic UI click blip
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio not permitted yet
    }
  };

  // Synthesize soft swoosh for modals/drawers
  const playSwooshSound = () => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {}
  };

  // Synthesize charging harmonic chime
  const playChargeChime = () => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.04 + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.04);
        osc.stop(audioCtx.currentTime + i * 0.04 + 0.13);
      });
    } catch (e) {}
  };

  // Sound Toggle Button in Header
  const soundToggle = document.getElementById('soundToggle');
  const soundOnIcon = soundToggle ? soundToggle.querySelector('.sound-on') : null;
  const soundOffIcon = soundToggle ? soundToggle.querySelector('.sound-off') : null;

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      initAudio();

      if (soundEnabled) {
        soundToggle.classList.remove('sound-muted');
        if (soundOnIcon) soundOnIcon.style.display = 'block';
        if (soundOffIcon) soundOffIcon.style.display = 'none';
        playClickSound();
        showToast('🔊 Futuristic sound effects: ENABLED');
      } else {
        soundToggle.classList.add('sound-muted');
        if (soundOnIcon) soundOnIcon.style.display = 'none';
        if (soundOffIcon) soundOffIcon.style.display = 'block';
        showToast('🔇 Sound effects: MUTED');
      }
    });
  }

  // ============================================================================
  // 3. TOP NOTIFICATION BANNER
  // ============================================================================
  const topBanner = document.getElementById('topBanner');
  const closeBannerBtn = document.getElementById('closeBanner');

  if (closeBannerBtn && topBanner) {
    closeBannerBtn.addEventListener('click', () => {
      playClickSound();
      topBanner.style.transition = 'all 0.3s ease';
      topBanner.style.opacity = '0';
      topBanner.style.height = '0';
      topBanner.style.padding = '0';
      topBanner.style.overflow = 'hidden';
      setTimeout(() => topBanner.remove(), 300);
    });
  }

  // ============================================================================
  // 4. STICKY NAVBAR & SCROLL-TO-TOP BUTTON
  // ============================================================================
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Glass effect on scroll
    if (scrollPos > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Toggle Scroll-to-Top Button visibility
    if (scrollTopBtn) {
      if (scrollPos > 320) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      playClickSound();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================================
  // 5. RESPONSIVE MOBILE NAVIGATION DRAWER
  // ============================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !mobileDrawer.classList.contains('open');

    playSwooshSound();
    mobileToggle.classList.toggle('active', isOpen);
    mobileDrawer.classList.toggle('open', isOpen);
    mobileBackdrop.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleMobileMenu(true));
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  // ============================================================================
  // 6. SCROLLSPY (ACTIVE NAV LINK)
  // ============================================================================
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ============================================================================
  // 7. HERO FINISH COLOR SWITCHER & REAL-TIME PHONE FACE TINTING
  // ============================================================================
  const finishPills = document.querySelectorAll('.finish-pill');
  const heroGlow1 = document.getElementById('heroGlow1');
  const heroRing = document.getElementById('heroRing');
  const heroPhoneFrame = document.getElementById('heroPhoneFrame');
  const phoneColorTint = document.getElementById('phoneColorTint');
  const colorOptions = document.querySelectorAll('.color-opt');

  // UI Theme Dock & Controls
  const uiColorDock = document.getElementById('uiColorDock');
  const uiColorToggle = document.getElementById('uiColorToggle');
  const navThemeBtn = document.getElementById('navThemeBtn');
  const navThemeDot = document.getElementById('navThemeDot');
  const activeThemeBadge = document.getElementById('activeThemeBadge');
  const themeButtons = document.querySelectorAll('.theme-btn');
  const syncCheckbox = document.getElementById('syncColorWithDevice');

  const themeDisplayNames = {
    'cyber-blue': 'Cyber Cyan',
    'neon-violet': 'Cosmic Violet',
    'aurora-emerald': 'Aurora Emerald',
    'sunset-crimson': 'Sunset Crimson',
    'cyber-gold': 'Solar Gold',
    'prism-rainbow': 'Prism 🌈'
  };

  const themeColorDots = {
    'cyber-blue': '#00d2ff',
    'neon-violet': '#a855f7',
    'aurora-emerald': '#10b981',
    'sunset-crimson': '#f43f5e',
    'cyber-gold': '#f59e0b',
    'prism-rainbow': 'linear-gradient(135deg, #00f0ff, #a855f7, #f43f5e, #f59e0b)'
  };

  const setUITheme = (themeName, showNotification = true) => {
    document.documentElement.setAttribute('data-theme', themeName);
    try {
      localStorage.setItem('nexora_theme', themeName);
    } catch (e) {}

    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === themeName);
    });

    const displayName = themeDisplayNames[themeName] || 'Cyber Cyan';
    if (activeThemeBadge) activeThemeBadge.textContent = displayName;

    if (navThemeDot) {
      if (themeName === 'prism-rainbow') {
        navThemeDot.style.background = 'linear-gradient(135deg, #00f0ff, #a855f7, #f43f5e, #f59e0b)';
        navThemeDot.style.boxShadow = '0 0 10px rgba(168, 85, 247, 0.6)';
      } else {
        const dotCol = themeColorDots[themeName] || '#00d2ff';
        navThemeDot.style.background = dotCol;
        navThemeDot.style.boxShadow = `0 0 8px ${dotCol}`;
      }
    }

    if (showNotification) {
      showToast(`🎨 UI Theme switched to ${displayName}`);
    }
  };

  // Restore saved theme on load
  let savedTheme = 'cyber-blue';
  try {
    savedTheme = localStorage.getItem('nexora_theme') || 'cyber-blue';
  } catch (e) {}
  setUITheme(savedTheme, false);

  // Floating dock theme buttons
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const chosenTheme = btn.getAttribute('data-theme');
      setUITheme(chosenTheme);

      // If sync with phone is enabled, select matching device finish
      if (syncCheckbox && syncCheckbox.checked) {
        const themeToColor = {
          'cyber-blue': 'blue',
          'neon-violet': 'purple',
          'aurora-emerald': 'emerald',
          'sunset-crimson': 'crimson',
          'cyber-gold': 'crimson'
        };
        const targetColor = themeToColor[chosenTheme];
        if (targetColor) {
          const matchingPill = document.querySelector(`.finish-pill[data-color="${targetColor}"]`);
          if (matchingPill) {
            matchingPill.click();
          }
        }
      }
    });
  });

  // Toggle UI color dock menu
  if (uiColorToggle && uiColorDock) {
    uiColorToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSound();
      const isOpen = uiColorDock.classList.toggle('open');
      uiColorToggle.setAttribute('aria-expanded', isOpen.toString());
    });
  }

  // Header Nav button toggles dock
  if (navThemeBtn && uiColorDock) {
    navThemeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSound();
      uiColorDock.classList.toggle('open');
      if (uiColorDock.classList.contains('open')) {
        uiColorDock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Close dock menu if clicked outside
  document.addEventListener('click', (e) => {
    if (uiColorDock && uiColorDock.classList.contains('open') && !uiColorDock.contains(e.target) && e.target !== navThemeBtn) {
      uiColorDock.classList.remove('open');
      if (uiColorToggle) uiColorToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Device Color Finish Palettes
  const colorPalettes = {
    blue: {
      name: 'Cyber Blue',
      themeKey: 'cyber-blue',
      glow1: 'radial-gradient(circle, rgba(0, 210, 255, 0.28) 0%, rgba(0, 102, 255, 0.1) 70%, transparent 100%)',
      ring: 'radial-gradient(circle, rgba(0, 210, 255, 0.4) 0%, rgba(0, 102, 255, 0.2) 50%, transparent 75%)',
      tint: 'radial-gradient(circle at 50% 50%, rgba(0, 210, 255, 0.45) 0%, rgba(0, 102, 255, 0.25) 60%, transparent 100%)',
      blend: 'color',
      frameBorder: 'rgba(0, 210, 255, 0.45)',
      frameShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 210, 255, 0.3)'
    },
    purple: {
      name: 'Cosmic Purple',
      themeKey: 'neon-violet',
      glow1: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(126, 34, 206, 0.12) 70%, transparent 100%)',
      ring: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(126, 34, 206, 0.22) 50%, transparent 75%)',
      tint: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.55) 0%, rgba(126, 34, 206, 0.3) 60%, transparent 100%)',
      blend: 'color',
      frameBorder: 'rgba(168, 85, 247, 0.5)',
      frameShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(168, 85, 247, 0.35)'
    },
    emerald: {
      name: 'Aurora Emerald',
      themeKey: 'aurora-emerald',
      glow1: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.12) 70%, transparent 100%)',
      ring: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(5, 150, 105, 0.22) 50%, transparent 75%)',
      tint: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.55) 0%, rgba(5, 150, 105, 0.3) 60%, transparent 100%)',
      blend: 'color',
      frameBorder: 'rgba(16, 185, 129, 0.5)',
      frameShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.35)'
    },
    crimson: {
      name: 'Sunset Crimson',
      themeKey: 'sunset-crimson',
      glow1: 'radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(225, 29, 72, 0.12) 70%, transparent 100%)',
      ring: 'radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(225, 29, 72, 0.22) 50%, transparent 75%)',
      tint: 'radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.55) 0%, rgba(225, 29, 72, 0.3) 60%, transparent 100%)',
      blend: 'color',
      frameBorder: 'rgba(244, 63, 94, 0.5)',
      frameShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(244, 63, 94, 0.35)'
    },
    silver: {
      name: 'Titanium Silver',
      themeKey: 'cyber-blue',
      glow1: 'radial-gradient(circle, rgba(220, 235, 255, 0.25) 0%, rgba(140, 170, 220, 0.08) 70%, transparent 100%)',
      ring: 'radial-gradient(circle, rgba(230, 240, 255, 0.35) 0%, rgba(150, 180, 230, 0.15) 50%, transparent 75%)',
      tint: 'rgba(226, 232, 240, 0.22)',
      blend: 'screen',
      frameBorder: 'rgba(226, 232, 240, 0.45)',
      frameShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(226, 232, 240, 0.25)'
    },
    black: {
      name: 'Phantom Black',
      themeKey: 'cyber-blue',
      glow1: 'radial-gradient(circle, rgba(70, 80, 100, 0.25) 0%, rgba(20, 25, 35, 0.1) 70%, transparent 100%)',
      ring: 'radial-gradient(circle, rgba(100, 115, 140, 0.35) 0%, rgba(25, 30, 45, 0.2) 50%, transparent 75%)',
      tint: 'rgba(10, 12, 18, 0.4)',
      blend: 'multiply',
      frameBorder: 'rgba(70, 85, 110, 0.4)',
      frameShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(50, 65, 90, 0.3)'
    }
  };

  finishPills.forEach(pill => {
    pill.addEventListener('click', () => {
      playClickSound();
      finishPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const colorKey = pill.getAttribute('data-color');
      const palette = colorPalettes[colorKey];

      if (palette) {
        if (heroGlow1) heroGlow1.style.background = palette.glow1;
        if (heroRing) heroRing.style.background = palette.ring;
        if (phoneColorTint) {
          phoneColorTint.style.background = palette.tint;
          phoneColorTint.style.mixBlendMode = palette.blend;
        }
        if (heroPhoneFrame) {
          heroPhoneFrame.style.borderColor = palette.frameBorder;
          heroPhoneFrame.style.boxShadow = palette.frameShadow;
        }

        // If sync with phone is enabled, switch UI color theme too
        if (syncCheckbox && syncCheckbox.checked && palette.themeKey) {
          setUITheme(palette.themeKey);
        }
      }

      // Sync with checkout modal color picker
      const colorValName = palette ? palette.name : 'Cyber Blue';
      colorOptions.forEach(opt => {
        const radio = opt.querySelector('input[type="radio"]');
        if (radio && radio.value === colorValName) {
          colorOptions.forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          radio.checked = true;
          orderState.color = colorValName;
          updateModalDisplay();
        }
      });
    });
  });

  // ============================================================================
  // 8. 3D MOUSE PARALLAX & SPECULAR GLARE ON HERO PHONE
  // ============================================================================
  const heroVisual = document.getElementById('heroVisual');
  const heroDeviceWrapper = document.getElementById('heroDeviceWrapper');
  const phoneGlare = document.getElementById('phoneGlare');

  if (heroVisual && heroDeviceWrapper) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (limit to -14deg to +14deg)
      const rotateX = -((y - centerY) / centerY) * 14;
      const rotateY = ((x - centerX) / centerX) * 14;

      heroDeviceWrapper.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

      // Specular light reflection on glass
      if (phoneGlare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        phoneGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.3) 0%, transparent 65%)`;
      }
    });

    heroVisual.addEventListener('mouseleave', () => {
      heroDeviceWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      if (phoneGlare) {
        phoneGlare.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 60%)';
      }
    });
  }

  // Hotspot sound
  document.querySelectorAll('.hotspot-pin').forEach(pin => {
    pin.addEventListener('mouseenter', () => playClickSound());
    pin.addEventListener('click', () => playClickSound());
  });

  // ============================================================================
  // 9. INTERACTIVE 120W HYPERCHARGE SIMULATOR
  // ============================================================================
  const chargeSlider = document.getElementById('chargeSlider');
  const chargeMinutesDisplay = document.getElementById('chargeMinutesDisplay');
  const batteryLiquid = document.getElementById('batteryLiquid');
  const batteryPctText = document.getElementById('batteryPctText');
  const batteryStatusText = document.getElementById('batteryStatusText');
  const calcTalkTime = document.getElementById('calcTalkTime');
  const calcVideoTime = document.getElementById('calcVideoTime');
  const calcGameTime = document.getElementById('calcGameTime');
  const simPlayBtn = document.getElementById('simPlayBtn');

  const updateBatterySimulator = (minutes) => {
    const mins = parseInt(minutes, 10);
    // 0 min = 5%, 7 min = 50%, 18 min = 100%
    const pct = Math.min(100, Math.round(5 + (mins / 18) * 95));

    if (chargeMinutesDisplay) {
      chargeMinutesDisplay.textContent = `${mins} Minute${mins === 1 ? '' : 's'}`;
    }

    if (batteryLiquid) {
      batteryLiquid.style.height = `${pct}%`;
    }

    if (batteryPctText) {
      batteryPctText.textContent = `${pct}%`;
    }

    if (batteryStatusText) {
      batteryStatusText.textContent = pct === 100 ? '⚡ Fully Charged' : '⚡ HyperCharging';
    }

    // Dynamic endurance calculations
    if (calcTalkTime) calcTalkTime.textContent = (pct * 0.32).toFixed(1) + ' hrs';
    if (calcVideoTime) calcVideoTime.textContent = (pct * 0.23).toFixed(1) + ' hrs';
    if (calcGameTime) calcGameTime.textContent = (pct * 0.10).toFixed(1) + ' hrs';
  };

  if (chargeSlider) {
    chargeSlider.addEventListener('input', (e) => {
      updateBatterySimulator(e.target.value);
    });
  }

  // Auto Simulate Animation
  let simInterval = null;
  if (simPlayBtn && chargeSlider) {
    simPlayBtn.addEventListener('click', () => {
      playClickSound();
      if (simInterval) clearInterval(simInterval);

      simPlayBtn.disabled = true;
      chargeSlider.value = 0;
      updateBatterySimulator(0);

      let currentMin = 0;
      simInterval = setInterval(() => {
        currentMin++;
        chargeSlider.value = currentMin;
        updateBatterySimulator(currentMin);

        if (currentMin >= 18) {
          clearInterval(simInterval);
          simPlayBtn.disabled = false;
          playChargeChime();
          showToast('⚡ 100% Full Charge reached in 18 minutes!');
        }
      }, 160);
    });
  }

  // ============================================================================
  // 10. 108MP CAMERA LAB VIEW FINDER WITH FOCAL ZOOM
  // ============================================================================
  const lensButtons = document.querySelectorAll('.lens-btn');
  const cameraSampleImg = document.getElementById('cameraSampleImg');
  const hudAperture = document.getElementById('hudAperture');
  const hudFocal = document.getElementById('hudFocal');
  const lensDescription = document.getElementById('lensDescription');

  if (lensButtons.length > 0 && cameraSampleImg) {
    lensButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        lensButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const aperture = btn.getAttribute('data-aperture');
        const focal = btn.getAttribute('data-focal');
        const scale = btn.getAttribute('data-scale');
        const desc = btn.getAttribute('data-desc');

        cameraSampleImg.style.transform = `scale(${scale})`;

        if (hudAperture) hudAperture.textContent = aperture;
        if (hudFocal) hudFocal.textContent = focal;
        if (lensDescription) lensDescription.textContent = desc;
      });
    });
  }

  // ============================================================================
  // 11. INTERACTIVE PRODUCT IMAGE GALLERY
  // ============================================================================
  const galleryMainImg = document.getElementById('galleryMainImg');
  const galleryViewTag = document.getElementById('galleryViewTag');
  const galleryViewTitle = document.getElementById('galleryViewTitle');
  const galleryViewDesc = document.getElementById('galleryViewDesc');
  const thumbBtns = document.querySelectorAll('.thumb-btn');

  if (galleryMainImg && thumbBtns.length > 0) {
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        thumbBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const newSrc = btn.getAttribute('data-img');
        const newTag = btn.getAttribute('data-tag');
        const newTitle = btn.getAttribute('data-title');
        const newDesc = btn.getAttribute('data-desc');

        galleryMainImg.classList.add('fade-out');

        setTimeout(() => {
          galleryMainImg.src = newSrc;
          if (galleryViewTag) galleryViewTag.textContent = newTag;
          if (galleryViewTitle) galleryViewTitle.innerHTML = newTitle;
          if (galleryViewDesc) galleryViewDesc.textContent = newDesc;

          galleryMainImg.classList.remove('fade-out');
        }, 180);
      });
    });
  }

  // ============================================================================
  // 12. ACCESSIBLE FAQ ACCORDION
  // ============================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      playClickSound();
      const isCurrentlyActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (isCurrentlyActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ============================================================================
  // 13. BUY NOW DEMO MODAL WITH COUPON CODE APPLICATOR
  // ============================================================================
  const purchaseModal = document.getElementById('purchaseModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const buyButtons = [
    document.getElementById('navBuyBtn'),
    document.getElementById('mobileBuyBtn'),
    document.getElementById('heroBuyBtn'),
    document.getElementById('ctaBuyBtn')
  ];

  const purchaseForm = document.getElementById('purchaseForm');
  const orderSuccess = document.getElementById('orderSuccess');
  const resetModalBtn = document.getElementById('resetModalBtn');
  const modalDisplayPrice = document.getElementById('modalDisplayPrice');
  const modalDiscountTag = document.getElementById('modalDiscountTag');
  const btnPriceAmount = document.getElementById('btnPriceAmount');
  const modalSelectedSummary = document.getElementById('modalSelectedSummary');
  const storageChips = document.querySelectorAll('.variant-chip');

  const receiptOrderId = document.getElementById('receiptOrderId');
  const receiptModel = document.getElementById('receiptModel');
  const receiptPrice = document.getElementById('receiptPrice');
  const receiptCustomer = document.getElementById('receiptCustomer');

  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponFeedback = document.getElementById('couponFeedback');

  const orderName = document.getElementById('orderName');
  const orderEmail = document.getElementById('orderEmail');
  const orderPhone = document.getElementById('orderPhone');
  const orderPincode = document.getElementById('orderPincode');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const pincodeError = document.getElementById('pincodeError');

  const orderState = {
    storageName: '8GB RAM + 128GB Storage',
    basePrice: 29999,
    discount: 0,
    color: 'Cyber Blue'
  };

  const formatINR = (val) => '₹' + Number(val).toLocaleString('en-IN');

  const updateModalDisplay = () => {
    const finalPrice = Math.max(0, orderState.basePrice - orderState.discount);
    const formattedPrice = formatINR(finalPrice);

    if (modalDisplayPrice) modalDisplayPrice.textContent = formattedPrice;
    if (btnPriceAmount) btnPriceAmount.textContent = formattedPrice;
    if (modalSelectedSummary) {
      modalSelectedSummary.textContent = `${orderState.storageName} • ${orderState.color}`;
    }

    if (modalDiscountTag) {
      modalDiscountTag.style.display = orderState.discount > 0 ? 'inline-block' : 'none';
    }
  };

  const openModal = () => {
    if (purchaseModal) {
      playSwooshSound();
      purchaseModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (purchaseForm && purchaseForm.style.display !== 'none' && orderName) {
        setTimeout(() => orderName.focus(), 250);
      }
    }
  };

  const closeModal = () => {
    if (purchaseModal) {
      playClickSound();
      purchaseModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  buyButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          toggleMobileMenu(true);
        }
        openModal();
      });
    }
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (purchaseModal) {
    purchaseModal.addEventListener('click', (e) => {
      if (e.target === purchaseModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && purchaseModal && purchaseModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Variant change
  storageChips.forEach(chip => {
    const radio = chip.querySelector('input[type="radio"]');
    chip.addEventListener('click', () => {
      playClickSound();
      storageChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (radio) {
        radio.checked = true;
        orderState.basePrice = parseInt(radio.getAttribute('data-price'), 10);
        orderState.storageName = radio.getAttribute('data-name');
        updateModalDisplay();
      }
    });
  });

  // Color change in modal
  colorOptions.forEach(opt => {
    const radio = opt.querySelector('input[type="radio"]');
    opt.addEventListener('click', () => {
      playClickSound();
      colorOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      if (radio) {
        radio.checked = true;
        orderState.color = radio.value;
        updateModalDisplay();

        // Sync with hero phone visual & UI theme
        const nameToKey = {
          'Cyber Blue': 'blue',
          'Cosmic Purple': 'purple',
          'Aurora Emerald': 'emerald',
          'Sunset Crimson': 'crimson',
          'Titanium Silver': 'silver',
          'Phantom Black': 'black'
        };
        const matchingKey = nameToKey[radio.value];
        if (matchingKey) {
          const pill = document.querySelector(`.finish-pill[data-color="${matchingKey}"]`);
          if (pill) {
            finishPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const palette = colorPalettes[matchingKey];
            if (palette) {
              if (heroGlow1) heroGlow1.style.background = palette.glow1;
              if (heroRing) heroRing.style.background = palette.ring;
              if (phoneColorTint) {
                phoneColorTint.style.background = palette.tint;
                phoneColorTint.style.mixBlendMode = palette.blend;
              }
              if (heroPhoneFrame) {
                heroPhoneFrame.style.borderColor = palette.frameBorder;
                heroPhoneFrame.style.boxShadow = palette.frameShadow;
              }
              if (syncCheckbox && syncCheckbox.checked && palette.themeKey) {
                setUITheme(palette.themeKey);
              }
            }
          }
        }
      }
    });
  });

  // Coupon Code Applicator
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      const validCodes = ['UJJWAL2026', 'UJJWAL', 'LAUNCH500', 'NEXORA1000'];

      if (validCodes.includes(code)) {
        orderState.discount = 1000;
        updateModalDisplay();
        playChargeChime();
        if (couponFeedback) {
          couponFeedback.textContent = '🎉 Launch Code Applied! ₹1,000 instant discount credited.';
          couponFeedback.className = 'promo-feedback success';
        }
        showToast('🏷️ ₹1,000 Promo Discount applied to order!');
      } else {
        playClickSound();
        if (couponFeedback) {
          couponFeedback.textContent = 'Invalid promo code. Try "UJJWAL2026" for ₹1,000 off.';
          couponFeedback.className = 'promo-feedback error';
        }
      }
    });
  }

  // Form Field Validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const clearFormErrors = () => {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (phoneError) phoneError.textContent = '';
    if (pincodeError) pincodeError.textContent = '';
  };

  if (purchaseForm) {
    purchaseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors();
      let hasError = false;

      const nameVal = orderName.value.trim();
      if (!nameVal || nameVal.length < 2) {
        nameError.textContent = 'Please enter your full name.';
        orderName.focus();
        hasError = true;
      }

      const emailVal = orderEmail.value.trim();
      if (!hasError && (!emailVal || !validateEmail(emailVal))) {
        emailError.textContent = 'Please enter a valid email address.';
        orderEmail.focus();
        hasError = true;
      }

      const phoneVal = orderPhone.value.trim();
      const phoneRegex = /^[0-9]{10}$/;
      if (!hasError && (!phoneVal || !phoneRegex.test(phoneVal))) {
        phoneError.textContent = 'Please provide a valid 10-digit mobile number.';
        orderPhone.focus();
        hasError = true;
      }

      const pincodeVal = orderPincode.value.trim();
      const pinRegex = /^[0-9]{6}$/;
      if (!hasError && (!pincodeVal || !pinRegex.test(pincodeVal))) {
        pincodeError.textContent = 'Please enter a valid 6-digit Indian PIN code.';
        orderPincode.focus();
        hasError = true;
      }

      if (hasError) return;

      const confirmOrderBtn = document.getElementById('confirmOrderBtn');
      const originalBtnHTML = confirmOrderBtn.innerHTML;
      confirmOrderBtn.disabled = true;
      confirmOrderBtn.innerHTML = '<span>Processing Demo Order...</span>';

      setTimeout(() => {
        const mockRandom = Math.floor(10000 + Math.random() * 90000);
        const orderIdStr = `#NX-${mockRandom}`;
        const finalPrice = Math.max(0, orderState.basePrice - orderState.discount);

        if (receiptOrderId) receiptOrderId.textContent = orderIdStr;
        if (receiptModel) receiptModel.textContent = `NEXORA ${orderState.storageName} (${orderState.color})`;
        if (receiptPrice) receiptPrice.textContent = formatINR(finalPrice);
        if (receiptCustomer) receiptCustomer.textContent = nameVal;

        purchaseForm.style.display = 'none';
        if (orderSuccess) orderSuccess.style.display = 'block';

        confirmOrderBtn.disabled = false;
        confirmOrderBtn.innerHTML = originalBtnHTML;

        playChargeChime();
        showToast(`🎉 Order ${orderIdStr} confirmed in demo mode!`);
      }, 700);
    });
  }

  if (resetModalBtn) {
    resetModalBtn.addEventListener('click', () => {
      closeModal();
      setTimeout(() => {
        if (purchaseForm) {
          purchaseForm.reset();
          purchaseForm.style.display = 'block';
        }
        if (orderSuccess) orderSuccess.style.display = 'none';
        orderState.discount = 0;
        if (couponFeedback) couponFeedback.textContent = '';
        updateModalDisplay();
        clearFormErrors();
      }, 300);
    });
  }

  // ============================================================================
  // 14. NEWSLETTER / CONTACT SUBSCRIPTION FORM
  // ============================================================================
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();

      if (!email || !validateEmail(email)) {
        playClickSound();
        if (newsletterFeedback) {
          newsletterFeedback.textContent = 'Please enter a valid email address.';
          newsletterFeedback.className = 'form-message error';
        }
        newsletterEmail.focus();
        return;
      }

      playChargeChime();
      if (newsletterFeedback) {
        newsletterFeedback.textContent = '✓ Thank you! You have been added to the NEXORA demo insider list.';
        newsletterFeedback.className = 'form-message success';
      }
      showToast('⚡ Successfully subscribed to NEXORA updates!');
      newsletterEmail.value = '';

      setTimeout(() => {
        if (newsletterFeedback) newsletterFeedback.textContent = '';
      }, 5000);
    });
  }

  // ============================================================================
  // 15. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ============================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ============================================================================
  // 16. TOAST NOTIFICATION UTILITY
  // ============================================================================
  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
});
