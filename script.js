document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupMobileMenu();
    setupNavigation();
    setupScrollAnimations();
    setupRippleEffect();
    setupHowItWorks();
    setupParallax();
    setupFAQ();
    setupContactForm();
}

function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (toggle && navMenu) {
        toggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }
}

function setupNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = target.offsetTop - 20;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-menu a[href="#${id}"]`);

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.feature-card, .contact-card, .stat-item, .faq-item').forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${i * 0.06}s`;
        observer.observe(el);
    });

    document.querySelectorAll('.showcase-text, .showcase-visual').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function setupHowItWorks() {
    const section = document.querySelector('.how-it-works');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add('active');
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.25 });

    observer.observe(section);
}

function setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.pageYOffset;
        const winH = window.innerHeight;

        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elCenter = rect.top + rect.height / 2;
            const viewCenter = winH / 2;
            const offset = (elCenter - viewCenter) / winH;

            const type = el.getAttribute('data-parallax');
            if (type === 'hero') {
                el.style.transform = `translateY(${offset * -40}px)`;
            } else if (type === 'about') {
                el.style.transform = `translateY(${offset * -30}px)`;
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    updateParallax();
}

function setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

function setupRippleEffect() {
    document.querySelectorAll('.btn, .download-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const loadTime = Date.now();
    const tsInput = document.getElementById('cf-ts');
    const scInput = document.getElementById('cf-sc');
    if (tsInput) tsInput.value = loadTime;

    let interactionScore = 0;
    const bumpScore = () => { interactionScore++; if (scInput) scInput.value = interactionScore; };

    form.addEventListener('focusin', bumpScore, { once: true });
    form.addEventListener('input', bumpScore);
    form.addEventListener('mousemove', bumpScore, { once: true });
    form.addEventListener('touchstart', bumpScore, { once: true });
    form.addEventListener('keydown', bumpScore, { once: true });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const hp = form.querySelector('input[name="website_url"]');
        if (hp && hp.value) return;

        const elapsed = Date.now() - loadTime;
        if (elapsed < 3000) return;

        if (interactionScore < 3) return;

        const nameEl = form.querySelector('#cf-name');
        const emailEl = form.querySelector('#cf-email');
        const messageEl = form.querySelector('#cf-message');
        let valid = true;

        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

        if (!nameEl.value.trim()) {
            nameEl.closest('.form-group').classList.add('has-error');
            valid = false;
        }

        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailEl.value.trim() || !emailRe.test(emailEl.value.trim())) {
            emailEl.closest('.form-group').classList.add('has-error');
            valid = false;
        }

        if (!messageEl.value.trim() || messageEl.value.trim().length < 5) {
            messageEl.closest('.form-group').classList.add('has-error');
            valid = false;
        }

        if (!valid) return;

        const btn = form.querySelector('.form-submit');
        btn.disabled = true;
        btn.querySelector('.form-submit-text').textContent = '...';

        const subject = form.querySelector('#cf-subject');
        const subjectText = subject ? subject.value.trim() : '';

        const formData = new FormData();
        formData.append('name', nameEl.value.trim());
        formData.append('email', emailEl.value.trim());
        formData.append('_subject', subjectText || 'Повідомлення з сайту I\'M IN');
        formData.append('message', messageEl.value.trim());
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');

        fetch('https://formsubmit.co/ajax/c82d83b5eeb74afcac26df4ea268f504', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.hidden = true;
                document.getElementById('contactSuccess').hidden = false;
            } else {
                btn.disabled = false;
                btn.querySelector('.form-submit-text').textContent = 'Надіслати';
                alert(data.message || 'Error sending message');
            }
        })
        .catch(() => {
            btn.disabled = false;
            btn.querySelector('.form-submit-text').textContent = 'Надіслати';
            alert('Connection error. Please try again.');
        });
    });

    form.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => {
            el.closest('.form-group').classList.remove('has-error');
        });
    });
}
