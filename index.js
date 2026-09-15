// ---------- Missatge de consola per a altres devs ----------

console.log(
    '%c</> hola, dev',
    'color:#C9A24B; font-family:monospace; font-size:16px; font-weight:bold;'
);
console.log(
    '%cSoc en Joel, estudiant de DAM2 a l\'INS Baix Camp.\nSi estàs mirant el codi, gràcies per l\'interès — escriu-me: joel.puyo@insbaixcamp.cat',
    'color:#A6A395; font-family:monospace; font-size:13px;'
);

// ---------- Barra de progrés de lectura ----------

const progressBar = document.getElementById('progressBar');

function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
}

// ---------- Nav fixa: apareix en fer scroll i marca la secció activa ----------

const siteNav = document.getElementById('siteNav');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main .block');

function updateNavVisibility() {
    if (window.scrollY > window.innerHeight * 0.6) {
        siteNav.classList.add('is-visible');
    } else {
        siteNav.classList.remove('is-visible');
    }
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateProgressBar();
            updateNavVisibility();
            ticking = false;
        });
        ticking = true;
    }
});

if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            'is-active',
                            link.getAttribute('href') === `#${id}`
                        );
                    });
                }
            });
        },
        { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => sectionObserver.observe(section));
}

// Scroll suau en clicar els enllaços de la nav
navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---------- Copiar l'email al portapapeles ----------

const contactLink = document.querySelector('.contact-link');

if (contactLink) {
    const email = contactLink.textContent.trim();

    // Element per anunciar el feedback (accessible amb lectors de pantalla)
    const feedback = document.createElement('span');
    feedback.className = 'contact-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    contactLink.insertAdjacentElement('afterend', feedback);

    let feedbackTimeout;

    contactLink.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(email);
            feedback.textContent = 'Adreça copiada';
        } catch (err) {
            // Si el navegador bloqueja el portapapeles, no interrompem res:
            // el mailto ja s'encarrega d'obrir el correu igualment.
            feedback.textContent = '';
            return;
        }

        feedback.classList.add('is-visible');
        clearTimeout(feedbackTimeout);
        feedbackTimeout = setTimeout(() => {
            feedback.classList.remove('is-visible');
        }, 2000);
    });
}