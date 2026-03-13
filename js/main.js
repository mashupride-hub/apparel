document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-quad',
            once: true,
            offset: 100
        });
    }

    // 2. Mock Data for Purchase Results
    const resultsData = [
        { brand: 'Supreme', name: '23AW Box Logo Hoodie', price: '45,000', date: '2024.03.10', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&h=400&fit=crop' },
        { brand: 'NIKE', name: 'Air Jordan 1 High OG "Chicago"', price: '68,000', date: '2024.03.08', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&h=400&fit=crop' },
        { brand: 'THE NORTH FACE', name: 'Mountain Light Jacket', price: '28,000', date: '2024.03.05', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400&h=400&fit=crop' },
        { brand: 'Maison Margiela', name: '5AC Micro Bag', price: '120,000', date: '2024.03.02', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&h=400&fit=crop' },
        { brand: 'STUSSY', name: '8 Ball Mohair Cardigan', price: '32,000', date: '2024.02.28', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&h=400&fit=crop' },
        { brand: 'Stone Island', name: 'Soft Shell-R Jacket', price: '42,000', date: '2024.02.25', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&h=400&fit=crop' }
    ];

    const resultsWrapper = document.getElementById('results-wrapper');
    if (resultsWrapper) {
        resultsData.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <article class="result-card">
                    <figure class="result-card__image">
                        <img src="${item.image}" alt="${item.brand} ${item.name}" loading="lazy">
                    </figure>
                    <div class="result-card__body">
                        <p class="result-card__brand">${item.brand}</p>
                        <h3 class="result-card__name">${item.name}</h3>
                        <p class="result-card__price">${item.price}<span>円</span></p>
                        <p class="result-card__date">買取日：${item.date}</p>
                    </div>
                </article>
            `;
            resultsWrapper.appendChild(slide);
        });
    }

    // 3. Initialize Swiper
    if (typeof Swiper !== 'undefined') {
        new Swiper('.results__slider', {
            slidesPerView: 1.2,
            spaceBetween: 15,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2.2,
                    centeredSlides: false,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    centeredSlides: false,
                }
            }
        });
    }

    // Campaign Swiper (Centered with fade/scroll)
    if (document.querySelector('.campaign-swiper')) {
        new Swiper('.campaign-swiper', {
            loop: true,
            slidesPerView: 'auto', // CSSで幅を指定し、自動で複数枚表示
            spaceBetween: 10,
            centeredSlides: true,
            loopedSlides: 8, // 多めにクローンを生成して表示切れを防ぐ
            speed: 600,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.campaign-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.campaign-next',
                prevEl: '.campaign-prev',
            },
            breakpoints: {
                768: {
                    spaceBetween: 30,
                },
                1200: {
                    spaceBetween: 50,
                }
            }
        });
    }

    // 4. FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq__question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const answer = q.nextElementSibling;
            
            // Toggle current item
            const isOpen = item.classList.contains('is-open');
            
            // Close others (Optional, for single-open behavior)
            // document.querySelectorAll('.faq__item').forEach(other => {
            //     other.classList.remove('is-open');
            //     other.querySelector('.faq__answer').style.display = 'none';
            // });

            if (isOpen) {
                item.classList.remove('is-open');
                answer.style.display = 'none';
            } else {
                item.classList.add('is-open');
                answer.style.display = 'block';
            }
        });
    });

    // 5. Sticky CTA Visibility & Mobile Menu
    const fixedCta = document.querySelector('.fixed-cta');
    const heroSection = document.getElementById('hero');
    const hamburger = document.getElementById('js-hamburger');
    const spMenu = document.getElementById('js-sp-menu');
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    // Mobile Menu Toggle
    if (hamburger && spMenu) {
        const menuClose = document.getElementById('js-menu-close');
        
        const toggleMenu = () => {
            hamburger.classList.toggle('is-active');
            spMenu.classList.toggle('is-active');
            overlay.classList.toggle('is-active');
            document.body.style.overflow = spMenu.classList.contains('is-active') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        if (menuClose) {
            menuClose.addEventListener('click', toggleMenu);
        }

        // Close menu on link click
        spMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }
    
    if (fixedCta && heroSection) {
        window.addEventListener('scroll', () => {
            const heroHeight = heroSection.offsetHeight;
            const scrollPos = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Show after hero, but hide at bottom
            const isNearBottom = scrollPos + windowHeight > documentHeight - 150;
            const isAfterHero = scrollPos > heroHeight * 0.5;

            if (isAfterHero && !isNearBottom) {
                fixedCta.classList.add('is-visible');
                fixedCta.classList.remove('is-hidden');
            } else if (isNearBottom) {
                fixedCta.classList.add('is-hidden');
            } else {
                fixedCta.classList.remove('is-visible');
                fixedCta.classList.remove('is-hidden');
            }
        });
    }

    // 6. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
