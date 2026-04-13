
/* ─── WhatsApp URL con mensaje pre-cargado ─── */
const WA_NUMBER = '5491154922800';
const WA_MESSAGE = encodeURIComponent(
    'Hola Fabrizio, vengo de tu web personal y quiero consultarte por...'
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

/**
 * Agrega el handler de clic a todos los botones de WhatsApp.
 * Usamos window.open para mantener el contexto y
 * evitar que el navegador bloquee el popup.
 */
function initWhatsAppButtons() {
    const buttons = document.querySelectorAll('#wa-hero-btn, #wa-cta-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.open(WA_URL, '_blank', 'noopener,noreferrer');
        });
    });
}

/* ─── Nav scroll effect ─── */
function initNav() {
    const nav = document.getElementById('nav');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // estado inicial
}

/* ─── Intersection Observer: animaciones al hacer scroll ─── */
function initReveal() {
    const targets = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Una vez visible, dejamos de observar para no re-animar
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,       // 12 % del elemento visible para disparar
            rootMargin: '0px 0px -40px 0px'
        }
    );

    targets.forEach(el => observer.observe(el));
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
    initWhatsAppButtons();
    initNav();
    initReveal();
});
