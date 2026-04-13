/**
 * FABRIZIO TURDO - Optimized JS 2026
 * Stack: Vanilla JS (Performance Focus)
 */

/* ─── CONFIGURACIÓN ─── */
const CONTACT_CONFIG = {
    phone: '5491154922800',
    defaultMsg: 'Hola Fabrizio, vengo de tu web personal y quiero consultarte por...'
};

/* ─── FUNCIONES PRINCIPALES ─── */

/**
 * WhatsApp Dinámico: Maneja cualquier botón con la clase .btn-whatsapp
 * Permite mensajes personalizados por botón usando data-msg
 */
const initWhatsApp = () => {
    // Seleccionamos por clase para que sea infinito, no por IDs fijos
    const buttons = document.querySelectorAll('.btn-whatsapp');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.getAttribute('data-msg') || CONTACT_CONFIG.defaultMsg;
            const url = `https://wa.me/${CONTACT_CONFIG.phone}?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    });
};

/**
 * Navbar: Control de estado en scroll
 */
const initNav = () => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const handleScroll = () => {
        // Uso de requestAnimationFrame para suavidad y rendimiento
        window.requestAnimationFrame(() => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
};

/**
 * Reveal: Animaciones de entrada al hacer scroll
 */
const initReveal = () => {
    const targets = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar para ganar performance
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    targets.forEach(el => observer.observe(el));
};

/* ─── INICIALIZACIÓN ÚNICA ─── */
document.addEventListener('DOMContentLoaded', () => {
    initWhatsApp();
    initNav();
    initReveal();
    console.log('Fabrizio Turdo Dev: Scripts cargados correctamente.');
});