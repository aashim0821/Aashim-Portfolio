/* =============================================
   AASHIM AHAMED — PORTFOLIO SITE
   Interactive Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                const event = new Event('scroll');
                window.dispatchEvent(event);
            }, 800);
        }, 1000);
    }

    // --- Cursor Tracker (Desktop) ---
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia("(min-width: 1024px)").matches && !prefersReducedMotion) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // --- Navbar Hide/Show on Scroll & Back to Top ---
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > lastScrollY && scrollY > 200) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileToggle.classList.contains('active');
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', !isActive);
            document.body.style.overflow = !isActive ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Text Reveal Animation Setup ---
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-text');
        
        revealElements.forEach(el => {
            // Basic text splitting: wrap words in spans while preserving HTML (like <br> or <em>)
            // For simplicity and safety, we parse text nodes and wrap words.
            const walkDOM = (node) => {
                if (node.nodeType === 3) { // Text node
                    const text = node.nodeValue;
                    if (text.trim() === '') return;
                    
                    const words = text.split(/(\s+)/);
                    const fragment = document.createDocumentFragment();
                    
                    words.forEach(word => {
                        if (word.trim() !== '') {
                            const wrapper = document.createElement('span');
                            wrapper.className = 'word-wrapper';
                            const inner = document.createElement('span');
                            inner.className = 'word';
                            inner.textContent = word;
                            wrapper.appendChild(inner);
                            fragment.appendChild(wrapper);
                        } else {
                            fragment.appendChild(document.createTextNode(word));
                        }
                    });
                    node.parentNode.replaceChild(fragment, node);
                } else if (node.nodeType === 1 && node.className !== 'word-wrapper' && node.className !== 'word') {
                    // Element node (e.g. <em>, <span>) - wrap its text too, except if already wrapped
                    Array.from(node.childNodes).forEach(walkDOM);
                }
            };
            
            Array.from(el.childNodes).forEach(walkDOM);
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const animateElements = document.querySelectorAll('[data-animate]');
    const revealTextElements = document.querySelectorAll('.reveal-text');

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    
                    if (entry.target.hasAttribute('data-animate')) {
                        const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
                        let delay = 0;
                        siblings.forEach((sibling, i) => {
                            if (sibling === entry.target) delay = i * 120;
                        });
                        setTimeout(() => entry.target.classList.add('animate-in'), delay);
                    }
                    
                    if (entry.target.classList.contains('reveal-text')) {
                        // Stagger the individual words
                        const words = entry.target.querySelectorAll('.word');
                        words.forEach((word, i) => {
                            word.style.transitionDelay = `${i * 0.04}s`;
                        });
                        entry.target.classList.add('is-revealed');
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        animateElements.forEach(el => observer.observe(el));
        revealTextElements.forEach(el => observer.observe(el));
    } else {
        animateElements.forEach(el => el.classList.add('animate-in'));
        revealTextElements.forEach(el => el.classList.add('is-revealed'));
    }

    // --- Magnetic Buttons ---
    if (!prefersReducedMotion && window.matchMedia("(min-width: 1024px)").matches) {
        const magneticElements = document.querySelectorAll('.magnetic-btn');
        
        magneticElements.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const h = rect.width / 2;
                const v = rect.height / 2;
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - v;
                
                // Max pull distance
                const pullX = x * 0.3; 
                const pullY = y * 0.3;
                
                btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // --- Active Nav Link Highlight ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    const highlightNav = () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--accent)';
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- Parallax & Hover Glows ---
    const aboutCard = document.querySelector('.about-image-wrapper');
    if (aboutCard && !prefersReducedMotion && window.matchMedia("(min-width: 768px)").matches) {
        aboutCard.addEventListener('mousemove', (e) => {
            const rect = aboutCard.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
            aboutCard.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
        });

        aboutCard.addEventListener('mouseleave', () => {
            aboutCard.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
        });
    }

    const ctaCard = document.querySelector('.contact-cta-card');
    const ctaGlow = document.querySelector('.cta-card-glow');
    if (ctaCard && ctaGlow && !prefersReducedMotion) {
        ctaCard.addEventListener('mousemove', (e) => {
            const rect = ctaCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ctaGlow.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--accent-glow) 0%, transparent 60%)`;
            ctaGlow.style.opacity = '0.8';
        });

        ctaCard.addEventListener('mouseleave', () => {
            ctaGlow.style.opacity = '0.5';
            ctaGlow.style.background = 'radial-gradient(circle at center, var(--accent-glow) 0%, transparent 60%)';
        });
    }

    if (!prefersReducedMotion) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(201, 169, 110, 0.04), transparent), var(--bg-card-hover)`;
            });

            card.addEventListener('mouseleave', () => {
                if (card.classList.contains('featured')) {
                    card.style.background = 'linear-gradient(180deg, rgba(201, 169, 110, 0.06) 0%, var(--bg-card) 100%)';
                } else {
                    card.style.background = 'var(--bg-card)';
                }
            });
        });
    }

    // --- Copyright Year ---
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) {
        const currentYear = new Date().getFullYear();
        yearEl.textContent = `© ${currentYear} Aashim Ahamed. All rights reserved.`;
    }

});
