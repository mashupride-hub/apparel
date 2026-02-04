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
});
