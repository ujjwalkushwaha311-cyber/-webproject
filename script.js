/**
 * Ujjawal Kushwaha - 3D Interactive Portfolio
 * Master Cyber-Cosmic Interactive Engine:
 * - Three.js 3D Space Background & Interactive Hero Centerpiece
 * - Multi-Theme Dynamic Switching (Cyan, Synthwave, Matrix, Amber)
 * - Interactive Cyber Console / Terminal Modal with Commands
 * - Matrix Digital Rain Canvas Simulation
 * - Real-time Tip Amount Presets & Interactive UPI System
 * - Holographic 3D Tilt with Coordinate Glare
 * - Project Interactive Tabs (Preview, Architecture, Specs)
 * - Smooth Lerp Cursor, Live IST Clock, Live Code Simulator & Typing FX
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initCyberCursor();
    initScrollReveal();
    initAnimatedCounters();
    initTypingEffect();
    initNavbarScroll();
    initMobileMenu();
    initSkillObserver();
    initSkillsFilter();
    initLiveClock();
    initCodeSnippetSimulator();
    initAdvancedTiltEffect();
    initProjectTabs();
    initContactForm();
    initUPIInteractions();
    initThemeSwitcher();
    initCyberTerminal();
    initMatrixRain();
    initBackground3D();
    initHero3D();
});

/* ==========================================================================
   1. Scroll Progress Bar at Top
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.pageYOffset / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }, { passive: true });
}

/* ==========================================================================
   2. Custom Cyber Glow Cursor
   ========================================================================== */
function initCyberCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (!dot || !outline) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderCursor() {
        outlineX += (mouseX - outlineX) * 0.16;
        outlineY += (mouseY - outlineY) * 0.16;
        outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const interactiveSelectors = 'a, button, input, textarea, .tilt-card, .btn, .icon-circle, .p-tab, .preset-btn, .chip-cmd';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
        el.addEventListener('mouseenter', () => outline.classList.add('hovering'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hovering'));
    });
}

/* ==========================================================================
   3. Scroll-Triggered Reveal Animations
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-element');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   4. Animated Number Counters
   ========================================================================== */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter-number');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
                const duration = 1800;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentVal = target * easeProgress;

                    counter.textContent = currentVal.toFixed(decimals) + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toFixed(decimals) + suffix;
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach((c) => counterObserver.observe(c));
}

/* ==========================================================================
   5. Typewriter Effect
   ========================================================================== */
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const phrases = [
        "Computer Science Engineer",
        "3D WebGL & Three.js Crafter",
        "Full-Stack Web Architect",
        "High-Framerate UI Designer",
        "Creative Technologist"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 95;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 1900;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   6. Navbar Scroll Blur & Active Link Spy
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSection = '';
        const scrollPosition = window.pageYOffset + 240;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

/* ==========================================================================
   7. Mobile Hamburger Menu
   ========================================================================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });
}

/* ==========================================================================
   8. Skills Progress Bar Animation
   ========================================================================== */
function initSkillObserver() {
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    if (!progressBars.length) return;

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress;
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.25 });

    progressBars.forEach((bar) => skillObserver.observe(bar));
}

/* ==========================================================================
   9. Category Filter for Skills Bento Grid
   ========================================================================== */
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    if (!filterButtons.length || !skillCards.length) return;

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ==========================================================================
   10. Real-time Live IST Clock in Footer
   ========================================================================== */
function initLiveClock() {
    const clockElement = document.getElementById('live-clock-text');
    if (!clockElement) return;

    function updateClock() {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Kolkata',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        clockElement.textContent = now.toLocaleTimeString('en-GB', options) + ' IST';
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ==========================================================================
   11. Code Editor Typing Simulator in Project 2
   ========================================================================== */
function initCodeSnippetSimulator() {
    const snippetElement = document.getElementById('live-code-snippet');
    if (!snippetElement) return;

    const snippets = [
        "> const room = new Room('3d-lab');",
        "> socket.emit('join', { user: 'Ujjawal' });",
        "> gl.drawElements(gl.TRIANGLES, count);",
        "> engine.render({ fps: 60, spatial: true });",
        "> status: SYNC_LATENCY_12MS_ESTABLISHED"
    ];

    let snippetIndex = 0;
    let charIdx = 0;
    let isDeleting = false;

    function animateSnippet() {
        const text = snippets[snippetIndex];

        if (isDeleting) {
            snippetElement.textContent = text.substring(0, charIdx - 1);
            charIdx--;
        } else {
            snippetElement.textContent = text.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 30 : 65;

        if (!isDeleting && charIdx === text.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            snippetIndex = (snippetIndex + 1) % snippets.length;
            speed = 400;
        }

        setTimeout(animateSnippet, speed);
    }

    animateSnippet();
}

/* ==========================================================================
   12. Holographic 3D Tilt with Coordinate Glare
   ========================================================================== */
function initAdvancedTiltEffect() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (!tiltCards.length) return;

    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });
}

/* ==========================================================================
   13. Project Interactive Tabs (Preview / Architecture / Specs)
   ========================================================================== */
function initProjectTabs() {
    const projectCards = document.querySelectorAll('.project-card');
    if (!projectCards.length) return;

    const projectData = {
        "CosmoSphere 3D Solar Explorer": {
            preview: "An interactive real-time 3D planetary physics engine with accurate orbital dynamics, custom GLSL lighting shaders, orbital mouse controls, and educational data overlays.",
            arch: "Built on Three.js scene graphs with Kepler orbital trajectory algorithms. Features custom multi-pass GLSL shaders for solar flares and atmospheric Rayleigh scattering.",
            specs: "60 FPS WebGL 2.0 • Orbital Matrix Math • 14 Celestial Bodies • Sub-second PBR texture streaming"
        },
        "CodeSync Live Collaborative IDE": {
            preview: "A cloud collaborative IDE featuring sub-50ms multi-user syntax highlighting, WebSockets live cursor sharing, audio channels, and sandboxed Docker code execution.",
            arch: "Microservices architecture utilizing Socket.io rooms, Redis pub/sub backplane, and sandboxed Docker containers executing arbitrary user code securely.",
            specs: "Sub-50ms latency • Monaco Editor integration • Operational Transformation (OT) conflict resolution"
        },
        "PulseMetric AI Developer Analytics": {
            preview: "An AI developer dashboard that aggregates GitHub pull requests, commits, and code churn, predicting delivery bottlenecks using lightweight machine learning regression.",
            arch: "FastAPI asynchronous background collectors hitting GitHub GraphQL API, normalized into PostgreSQL, and evaluated with Scikit-learn polynomial regression models.",
            specs: "Python 3.11 • Async SQLAlchemy • Chart.js visualizations • Automated CI/CD webhook triggers"
        },
        "SonicWave 3D Audio Visualizer": {
            preview: "Dynamic audio reactive web application that maps Web Audio API frequency matrices into an undulating 3D particle vortex with real-time bloom shaders.",
            arch: "Web Audio API AnalyserNode captures FFT buffer chunks mapped to InstancedMesh vertex displacements and Post-processing UnrealBloomPass shaders.",
            specs: "2,048 frequency bins • 10,000 instanced particle points • Real-time microphone input stream"
        }
    };

    projectCards.forEach((card) => {
        const titleEl = card.querySelector('h3');
        const descEl = card.querySelector('.project-desc');
        const tabs = card.querySelectorAll('.p-tab');
        if (!titleEl || !descEl || !tabs.length) return;

        const title = titleEl.textContent.trim();
        const data = projectData[title];
        if (!data) return;

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                tabs.forEach((t) => t.classList.remove('active'));
                tab.classList.add('active');

                const mode = tab.getAttribute('data-tab');
                descEl.style.opacity = '0';
                setTimeout(() => {
                    descEl.textContent = data[mode] || data.preview;
                    descEl.style.transition = 'opacity 0.3s ease';
                    descEl.style.opacity = '1';
                }, 150);
            });
        });
    });
}

/* ==========================================================================
   14. Contact Form Validation & Feedback
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !feedback || !submitBtn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            feedback.className = 'form-feedback error';
            feedback.textContent = 'Please fill out all fields before sending transmission.';
            feedback.style.display = 'block';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Transmitting...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

        setTimeout(() => {
            feedback.className = 'form-feedback success';
            feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Message transmitted successfully! Ujjawal will respond via ${email} soon.`;
            feedback.style.display = 'block';
            form.reset();

            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;

            setTimeout(() => {
                feedback.style.display = 'none';
            }, 6000);
        }, 1200);
    });
}

/* ==========================================================================
   15. Interactive UPI Tip Presets, Dynamic Links & Confetti
   ========================================================================== */
function initUPIInteractions() {
    const copyBtn = document.getElementById('copy-upi-btn');
    const upiIdDisplay = document.getElementById('upi-id-display');
    const tooltip = document.getElementById('copy-upi-tooltip');
    const icon = document.getElementById('copy-upi-icon');
    const upiCard = document.getElementById('upi-card-element');
    const presetButtons = document.querySelectorAll('.preset-btn:not(#custom-tip-toggle)');
    const customToggle = document.getElementById('custom-tip-toggle');
    const customWrapper = document.getElementById('custom-tip-wrapper');
    const customInput = document.getElementById('custom-amount-input');
    const customApplyBtn = document.getElementById('apply-custom-amount-btn');
    const directPayLink = document.getElementById('upi-direct-pay-link');
    const directPayLabel = document.getElementById('upi-pay-btn-label');

    const baseUpiId = "ujjawal.kushwaha@okaxis";
    const payeeName = "Ujjawal Kushwaha";
    let currentAmount = "51";

    function updateUpiAmount(amount) {
        currentAmount = amount;
        if (directPayLink) {
            directPayLink.href = `upi://pay?pa=${baseUpiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
        }
        if (directPayLabel) {
            directPayLabel.textContent = `Pay ₹${amount} Directly via UPI App`;
        }
        if (upiCard) {
            upiCard.classList.remove('highlight-pulse');
            void upiCard.offsetWidth;
            upiCard.classList.add('highlight-pulse');
        }
    }

    if (presetButtons.length) {
        presetButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                if (customWrapper) customWrapper.style.display = 'none';

                const amt = btn.getAttribute('data-amount');
                updateUpiAmount(amt);
            });
        });
    }

    if (customToggle) {
        customToggle.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
            customToggle.classList.add('active');
            if (customWrapper) {
                customWrapper.style.display = 'flex';
                if (customInput) customInput.focus();
            }
        });
    }

    if (customApplyBtn && customInput) {
        customApplyBtn.addEventListener('click', () => {
            const val = parseInt(customInput.value, 10);
            if (val && val > 0) {
                updateUpiAmount(val.toString());
            }
        });
        customInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                customApplyBtn.click();
            }
        });
    }

    // Copy to clipboard with particle burst
    if (copyBtn && upiIdDisplay) {
        copyBtn.addEventListener('click', () => {
            const upiId = upiIdDisplay.textContent.trim();
            navigator.clipboard.writeText(upiId).then(() => {
                copyBtn.classList.add('copied');
                if (tooltip) tooltip.textContent = 'Copied!';
                if (icon) {
                    icon.className = 'fa-solid fa-check';
                }

                if (upiCard) {
                    upiCard.classList.remove('highlight-pulse');
                    void upiCard.offsetWidth;
                    upiCard.classList.add('highlight-pulse');
                }

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (tooltip) tooltip.textContent = 'Copy';
                    if (icon) {
                        icon.className = 'fa-regular fa-copy';
                    }
                }, 2400);
            }).catch(() => {
                // Fallback prompt
                prompt("Copy Ujjawal's UPI ID:", upiId);
            });
        });
    }
}

/* ==========================================================================
   16. Multi-Theme Switcher (Cyan, Synthwave, Matrix, Amber)
   ========================================================================== */
function initThemeSwitcher() {
    const themeBtn = document.getElementById('theme-switch-btn');
    const dockThemeBtn = document.getElementById('dock-theme-btn');
    const themes = ['cyan', 'synthwave', 'matrix', 'amber'];
    let currentThemeIndex = 0;

    function setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('portfolio-theme', themeName);
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));
    }

    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme && themes.includes(savedTheme)) {
        currentThemeIndex = themes.indexOf(savedTheme);
        setTheme(savedTheme);
    }

    function cycleTheme() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const nextTheme = themes[currentThemeIndex];
        setTheme(nextTheme);
    }

    if (themeBtn) themeBtn.addEventListener('click', cycleTheme);
    if (dockThemeBtn) dockThemeBtn.addEventListener('click', cycleTheme);

    // Keyboard shortcut 't' to cycle theme
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 't' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
            cycleTheme();
        }
    });

    window.switchThemeByName = setTheme;
}

/* ==========================================================================
   17. Interactive Cyber Terminal (CLI Console Modal)
   ========================================================================== */
function initCyberTerminal() {
    const modal = document.getElementById('terminal-modal');
    const backdrop = document.getElementById('terminal-backdrop');
    const openBtn = document.getElementById('terminal-trigger-btn');
    const dockBtn = document.getElementById('dock-term-btn');
    const closeButtons = document.querySelectorAll('.close-term');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('term-output');
    const chips = document.querySelectorAll('.chip-cmd');
    if (!modal || !input || !output) return;

    function openTerminal() {
        modal.classList.add('open');
        input.focus();
    }

    function closeTerminal() {
        modal.classList.remove('open');
    }

    if (openBtn) openBtn.addEventListener('click', openTerminal);
    if (dockBtn) dockBtn.addEventListener('click', openTerminal);
    if (backdrop) backdrop.addEventListener('click', closeTerminal);
    closeButtons.forEach((b) => b.addEventListener('click', closeTerminal));

    // Shortcut ` ~ ` or `Escape`
    window.addEventListener('keydown', (e) => {
        if (e.key === '`' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
            e.preventDefault();
            modal.classList.contains('open') ? closeTerminal() : openTerminal();
        } else if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeTerminal();
        }
    });

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="term-prompt">ujjawal@portfolio:~$</span> ${rawCmd}`;
        output.appendChild(line);

        const res = document.createElement('div');
        res.className = 'term-line';

        if (cmd === 'help') {
            res.innerHTML = `
                &bull; <span class="highlight-cyan">about</span>: Display creator profile & academic info<br>
                &bull; <span class="highlight-cyan">skills</span>: List technical competencies & stack<br>
                &bull; <span class="highlight-cyan">projects</span>: Display featured software creations<br>
                &bull; <span class="highlight-cyan">upi</span>: Show UPI ID & direct contribution links<br>
                &bull; <span class="highlight-cyan">theme &lt;cyan|synthwave|matrix|amber&gt;</span>: Switch visual palette<br>
                &bull; <span class="highlight-cyan">matrix</span>: Launch digital rain overlay<br>
                &bull; <span class="highlight-cyan">contact</span>: Transmit mail coordinates<br>
                &bull; <span class="highlight-cyan">clear</span>: Clear terminal screen<br>
                &bull; <span class="highlight-cyan">exit</span>: Close this terminal session
            `;
        } else if (cmd === 'about') {
            res.innerHTML = `Ujjawal Kushwaha | B.Tech CSE (3rd Year, ABC Tech, 8.8 CGPA). Specializing in 3D WebGL, Three.js, React, and Full-Stack Engineering.`;
        } else if (cmd === 'skills') {
            res.innerHTML = `Frontend: HTML5, CSS3, JavaScript ES6+, Three.js, React, Next.js<br>Backend: Node.js, Express, Python, MongoDB, SQL<br>Tools: Git, Docker, Linux, WebGL Shaders`;
        } else if (cmd === 'projects') {
            res.innerHTML = `1. CosmoSphere 3D Solar Explorer (Three.js/GLSL)<br>2. CodeSync Live IDE (Socket.io/Docker)<br>3. PulseMetric AI Analytics (Python/FastAPI)<br>4. SonicWave 3D Visualizer (Web Audio/Three.js)`;
        } else if (cmd === 'upi') {
            res.innerHTML = `UPI ID: <span class="highlight-cyan">ujjawal.kushwaha@okaxis</span> (Payee: Ujjawal Kushwaha). Tip preset buttons active in section #upi-support.`;
            document.getElementById('upi-support')?.scrollIntoView({ behavior: 'smooth' });
        } else if (cmd.startsWith('theme')) {
            const parts = cmd.split(' ');
            if (parts[1] && ['cyan', 'synthwave', 'matrix', 'amber'].includes(parts[1])) {
                if (window.switchThemeByName) window.switchThemeByName(parts[1]);
                res.innerHTML = `Theme dynamically switched to: <span class="highlight-cyan">${parts[1]}</span>`;
            } else {
                res.innerHTML = `Usage: theme &lt;cyan | synthwave | matrix | amber&gt;`;
            }
        } else if (cmd === 'matrix') {
            window.toggleMatrixRain && window.toggleMatrixRain();
            res.innerHTML = `Matrix Digital Rain stream toggled! Press any key or run 'matrix' again to toggle off.`;
        } else if (cmd === 'contact') {
            res.innerHTML = `Email: ujjawal.kushwaha@example.com | LinkedIn: /in/ujjawalkushwaha | GitHub: /ujjawalkushwaha`;
        } else if (cmd === 'clear') {
            output.innerHTML = '';
            input.value = '';
            return;
        } else if (cmd === 'exit') {
            closeTerminal();
            input.value = '';
            return;
        } else if (cmd === '') {
            input.value = '';
            return;
        } else {
            res.innerHTML = `Command not recognized: '${rawCmd}'. Type <span class="highlight-cyan">'help'</span> for command inventory.`;
        }

        output.appendChild(res);
        input.value = '';
        const body = document.getElementById('terminal-body');
        if (body) body.scrollTop = body.scrollHeight;
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand(input.value);
        }
    });

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            executeCommand(cmd);
        });
    });
}

/* ==========================================================================
   18. Matrix Digital Rain Canvas Simulation (Easter Egg)
   ========================================================================== */
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1);
    let animationId = null;
    let isRunning = false;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = Array(columns).fill(1);
    });

    function draw() {
        ctx.fillStyle = 'rgba(5, 7, 17, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00ff7f';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    function loop() {
        draw();
        animationId = requestAnimationFrame(loop);
    }

    function toggleRain() {
        isRunning = !isRunning;
        if (isRunning) {
            canvas.classList.add('active');
            loop();
        } else {
            canvas.classList.remove('active');
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, width, height);
        }
    }

    canvas.addEventListener('click', toggleRain);
    window.toggleMatrixRain = toggleRain;
}

/* ==========================================================================
   19. Background Three.js 3D Starfield & Constellation Grid
   ========================================================================== */
function initBackground3D() {
    const canvas = document.getElementById('bg-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1,200 Interactive Stars
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    let colorPalette = [
        new THREE.Color(0x00f2fe),
        new THREE.Color(0x4facfe),
        new THREE.Color(0x7928ca),
        new THREE.Color(0xff0080)
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });

    const starParticles = new THREE.Points(geometry, material);
    scene.add(starParticles);

    // Parallax & Dynamic Mouse Tracking
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) * 0.08;
        targetY = (e.clientY - window.innerHeight / 2) * 0.08;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Theme adaptive color change
    window.addEventListener('themeChanged', (e) => {
        const theme = e.detail.theme;
        let pColor = 0x00f2fe;
        if (theme === 'synthwave') pColor = 0xff007f;
        else if (theme === 'matrix') pColor = 0x00ff7f;
        else if (theme === 'amber') pColor = 0xffbe0b;

        const baseC = new THREE.Color(pColor);
        const colAttr = geometry.attributes.color;
        for (let i = 0; i < particleCount; i++) {
            colAttr.setXYZ(i, baseC.r * (0.6 + Math.random() * 0.4), baseC.g * (0.6 + Math.random() * 0.4), baseC.b * (0.6 + Math.random() * 0.4));
        }
        colAttr.needsUpdate = true;
    });

    function animate() {
        requestAnimationFrame(animate);

        starParticles.rotation.y += 0.0006;
        starParticles.rotation.x += 0.0003;

        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();
}

/* ==========================================================================
   20. Interactive Three.js 3D Hero Centerpiece (Quantum Knot & Gimbal Core)
   ========================================================================== */
function initHero3D() {
    const container = document.getElementById('hero-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Multi-Layered Centerpiece Group
    const group = new THREE.Group();
    scene.add(group);

    // 1. Quantum Torus Knot
    const knotGeom = new THREE.TorusKnotGeometry(1.4, 0.38, 128, 32, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        emissive: 0x005577,
        roughness: 0.15,
        metalness: 0.9,
        wireframe: true
    });
    const knotMesh = new THREE.Mesh(knotGeom, knotMat);
    group.add(knotMesh);

    // 2. Concentric Wireframe Gimbal Rings
    const ringGeom = new THREE.TorusGeometry(2.3, 0.03, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0080, transparent: true, opacity: 0.75 });
    const gimbalRing1 = new THREE.Mesh(ringGeom, ringMat);
    gimbalRing1.rotation.x = Math.PI / 3;
    group.add(gimbalRing1);

    const ringGeom2 = new THREE.TorusGeometry(2.6, 0.025, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x7928ca, transparent: true, opacity: 0.65 });
    const gimbalRing2 = new THREE.Mesh(ringGeom2, ringMat2);
    gimbalRing2.rotation.y = Math.PI / 4;
    group.add(gimbalRing2);

    // 3. Pulsing Core Icosahedron
    const coreGeom = new THREE.IcosahedronGeometry(0.7, 1);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x00f5a0,
        emissive: 0x00aa66,
        roughness: 0.2,
        metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    group.add(coreMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f2fe, 2.5, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff0080, 2.0, 50);
    pointLight2.position.set(-5, -5, -3);
    scene.add(pointLight2);

    // Interactive Drag / Momentum Physics
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotVelX = 0.005;
    let rotVelY = 0.007;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        rotVelY = deltaX * 0.005;
        rotVelX = deltaY * 0.005;
        group.rotation.y += rotVelY;
        group.rotation.x += rotVelX;
    });

    // Interactive Click Particle Shockwave
    container.addEventListener('click', () => {
        knotMesh.scale.set(1.2, 1.2, 1.2);
        coreMesh.scale.set(1.4, 1.4, 1.4);
        setTimeout(() => {
            knotMesh.scale.set(1, 1, 1);
            coreMesh.scale.set(1, 1, 1);
        }, 300);
    });

    // Theme Color Synchronization
    window.addEventListener('themeChanged', (e) => {
        const theme = e.detail.theme;
        if (theme === 'synthwave') {
            knotMat.color.setHex(0xff007f);
            knotMat.emissive.setHex(0x550022);
            ringMat.color.setHex(0x9b5de5);
            ringMat2.color.setHex(0x00f5d4);
            coreMat.color.setHex(0x00f5d4);
            pointLight1.color.setHex(0xff007f);
            pointLight2.color.setHex(0x00f5d4);
        } else if (theme === 'matrix') {
            knotMat.color.setHex(0x00ff7f);
            knotMat.emissive.setHex(0x004411);
            ringMat.color.setHex(0x00f5a0);
            ringMat2.color.setHex(0x11998e);
            coreMat.color.setHex(0x38ef7d);
            pointLight1.color.setHex(0x00ff7f);
            pointLight2.color.setHex(0x00f5a0);
        } else if (theme === 'amber') {
            knotMat.color.setHex(0xffbe0b);
            knotMat.emissive.setHex(0x553300);
            ringMat.color.setHex(0xfb5607);
            ringMat2.color.setHex(0xff006e);
            coreMat.color.setHex(0xff006e);
            pointLight1.color.setHex(0xffbe0b);
            pointLight2.color.setHex(0xfb5607);
        } else {
            knotMat.color.setHex(0x00f2fe);
            knotMat.emissive.setHex(0x005577);
            ringMat.color.setHex(0xff0080);
            ringMat2.color.setHex(0x7928ca);
            coreMat.color.setHex(0x00f5a0);
            pointLight1.color.setHex(0x00f2fe);
            pointLight2.color.setHex(0xff0080);
        }
    });

    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    let clock = new THREE.Clock();

    function render() {
        requestAnimationFrame(render);
        const elapsed = clock.getElapsedTime();

        if (!isDragging) {
            rotVelX *= 0.96;
            rotVelY *= 0.96;
            group.rotation.x += 0.005 + rotVelX;
            group.rotation.y += 0.008 + rotVelY;
        }

        gimbalRing1.rotation.z += 0.012;
        gimbalRing2.rotation.x += 0.015;

        const pulse = 1 + Math.sin(elapsed * 3) * 0.08;
        coreMesh.scale.set(pulse, pulse, pulse);

        renderer.render(scene, camera);
    }

    render();
}
