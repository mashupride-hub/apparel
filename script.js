document.addEventListener('DOMContentLoaded', () => {

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const videoContents = document.querySelectorAll('.video-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            videoContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const icon = header.querySelector('i');

            // Toggle Open/Close
            if (body.classList.contains('open')) {
                body.classList.remove('open');
                icon.style.transform = 'rotate(0deg)';
                body.style.maxHeight = null;
            } else {
                // Close others (optional, keeps it clean)
                document.querySelectorAll('.accordion-body').forEach(b => {
                    b.classList.remove('open');
                    b.style.maxHeight = null;
                });
                document.querySelectorAll('.accordion-header i').forEach(i => {
                    i.style.transform = 'rotate(0deg)';
                });

                body.classList.add('open');
                icon.style.transform = 'rotate(180deg)';
                // Direct scrollHeight can be tricky with padding transitions
                // Let's set it to scrollHeight + current calculated padding if needed, 
                // but usually setting it to scrollHeight after class add is enough.
                body.style.maxHeight = (body.scrollHeight + 50) + "px";
            }
        });
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Optional: keep animating or run once
            }
        });
    }, observerOptions);

    // Target elements to animate
    const animatedElements = document.querySelectorAll('.benefit-card, .method-item, .reg-step-card, .section-title, .bonus-section');
    animatedElements.forEach(el => {
        // Ensure initial state is handled by CSS (opacity: 0)
        observer.observe(el);
    });

    // --- Floating CTA Display Logic ---
    const floatingCta = document.getElementById('floatingCta');
    if (floatingCta) {
        // Only run logic on mobile
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
            const hero = document.querySelector('.hero-immersive');
            const footerCta = document.querySelector('.footer-cta');

            let heroPassed = false;
            let footerVisible = false;

            const toggleCta = () => {
                if (heroPassed && !footerVisible) {
                    floatingCta.classList.add('visible');
                } else {
                    floatingCta.classList.remove('visible');
                }
            };

            // Observer for Hero Section (Show after passing Hero)
            if (hero) {
                const heroObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        // isIntersecting is true when ANY part of hero is visible
                        // We want it visible when hero is mostly GONE or at least 40% scrolled
                        heroPassed = !entry.isIntersecting;
                        toggleCta();
                    });
                }, { threshold: 0.1 }); // Fires when only 10% of hero is visible
                heroObserver.observe(hero);
            } else {
                heroPassed = true;
            }

            // Observer for Footer CTA (Hide when footer CTA becomes visible)
            if (footerCta) {
                const footerObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        footerVisible = entry.isIntersecting;
                        toggleCta();
                    });
                }, { threshold: 0.1 });
                footerObserver.observe(footerCta);
            }
        }
    }
    // --- Registration Manual Animation Logic ---
    const regManual = document.getElementById('video-register');
    if (regManual) {
        const stepImgs = regManual.querySelectorAll('.step-img');
        const stepItems = regManual.querySelectorAll('.step-item');
        const paginationContainer = regManual.querySelector('.manual-pagination');
        let currentStep = 0;
        const totalSteps = stepImgs.length;
        let animInterval;

        // Initialize Pagination Dots
        if (paginationContainer) {
            for (let i = 0; i < totalSteps; i++) {
                const dot = document.createElement('div');
                dot.classList.add('pagination-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    stopAnim();
                    currentStep = i;
                    updateStep(currentStep);
                    setTimeout(startAnim, 5000);
                });
                paginationContainer.appendChild(dot);
            }
        }

        const paginationDots = regManual.querySelectorAll('.pagination-dot');

        const updateStep = (index) => {
            // Reset all
            stepImgs.forEach(img => img.classList.remove('visible'));
            stepItems.forEach(item => item.classList.remove('active'));
            paginationDots.forEach(dot => dot.classList.remove('active'));

            // Set current
            if (stepImgs[index]) stepImgs[index].classList.add('visible');
            if (stepItems[index]) stepItems[index].classList.add('active');
            if (paginationDots[index]) paginationDots[index].classList.add('active');
        };

        const startAnim = () => {
            if (animInterval) clearInterval(animInterval);
            animInterval = setInterval(() => {
                currentStep = (currentStep + 1) % totalSteps;
                updateStep(currentStep);
            }, 4500); // Increased from 3000 to 4500 (1.5x) for better readability
        };

        const stopAnim = () => {
            if (animInterval) clearInterval(animInterval);
        };

        // Tab click observer
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.getAttribute('data-target') === 'video-register') {
                    currentStep = 0;
                    updateStep(currentStep);
                    startAnim();
                } else {
                    stopAnim();
                }
            });
        });

        // Initialize if active
        if (regManual.classList.contains('active')) {
            startAnim();
        }

        // Manual override (Clicking a step)
        stepItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                stopAnim();
                currentStep = index;
                updateStep(currentStep);
                // Resume after a delay
                setTimeout(startAnim, 5000);
            });
        });
    }
});
