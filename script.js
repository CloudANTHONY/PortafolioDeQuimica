/* ========================================
   PORTAFOLIO DIGITAL - ANTHONY RODRIGUEZ
   JavaScript Completo con Animaciones
   ======================================== */

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initParticles();
    initNavigation();
    initScrollAnimations();
    initSectionIndicator();
    initCounters();
    initModal();
    initIdleDetection();
});

// ========================================
// LOADER
// ========================================
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Activar animaciones iniciales después del loader
            triggerHeroAnimations();
        }, 2500);
    });
}

function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('#inicio .animate-on-scroll');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animated');
        }, index * 150);
    });
}

// ========================================
// CURSOR PERSONALIZADO
// ========================================
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Cursor principal (más rápido)
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX - 6 + 'px';
        cursor.style.top = cursorY - 6 + 'px';
        
        // Cursor seguidor (más lento)
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX - 20 + 'px';
        cursorFollower.style.top = followerY - 20 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Efectos hover en elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .content-card, .reflexion-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursorFollower.style.transform = 'scale(1.5)';
            cursorFollower.style.borderColor = 'var(--primary)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
            cursorFollower.style.borderColor = 'var(--primary-light)';
        });
    });
}

// ========================================
// PARTÍCULAS DE FONDO
// ========================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Posición inicial aleatoria
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Tamaño aleatorio
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Color aleatorio del tema
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Delay aleatorio
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
    
    container.appendChild(particle);
}

// ========================================
// NAVEGACIÓN
// ========================================
function initNavigation() {
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    // Scroll effect en navegación
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Actualizar link activo
        updateActiveNavLink();
    });
    
    // Menú móvil
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Links de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Cerrar menú móvil si está abierto
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Scroll suave
                smoothScrollTo(targetSection);
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
    
    indicatorDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === currentSection) {
            dot.classList.add('active');
        }
    });
}

function smoothScrollTo(element) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// ========================================
// ANIMACIONES DE SCROLL
// ========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Efecto especial para tarjetas
                if (entry.target.classList.contains('content-card') || 
                    entry.target.classList.contains('reflexion-card')) {
                    addCardEntryEffect(entry.target);
                }
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function addCardEntryEffect(card) {
    card.style.animation = 'cardEntry 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
}

// Agregar keyframes dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes cardEntry {
        0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        50% {
            transform: translateY(-5px) scale(1.02);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// INDICADOR DE SECCIÓN
// ========================================
function initSectionIndicator() {
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    indicatorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                smoothScrollTo(targetSection);
            }
        });
    });
}

// ========================================
// CONTADORES ANIMADOS
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ========================================
// MODAL
// ========================================
function initModal() {
    const modal = document.getElementById('contentModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = modal.querySelector('.modal-backdrop');
    const cards = document.querySelectorAll('.content-card:not(.add-card), .reflexion-card:not(.add-reflexion)');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            openModal(card);
        });
    });
    
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(card) {
    const modal = document.getElementById('contentModal');
    const modalCategory = modal.querySelector('.modal-category');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    
    // Obtener datos de la tarjeta
    const category = card.closest('.section').querySelector('.section-title').textContent;
    const title = card.querySelector('.card-title, .reflexion-title').textContent;
    const description = card.querySelector('.card-description, .reflexion-excerpt').textContent;
    
    modalCategory.textContent = category;
    modalTitle.textContent = title;
    modalBody.innerHTML = `
        <p>${description}</p>
        <br>
        <p style="color: var(--text-muted); font-style: italic;">
            Aquí puedes agregar más contenido como imágenes, documentos PDF, 
            o descripciones más detalladas de tu trabajo.
        </p>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('contentModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ========================================
// DETECCIÓN DE INACTIVIDAD
// ========================================
function initIdleDetection() {
    let idleTimeout;
    const idleTime = 5000; // 5 segundos de inactividad
    
    const idleElements = document.querySelectorAll('.hero-title, .about-image-placeholder, .logo-dot');
    
    function startIdleAnimation() {
        idleElements.forEach(el => {
            el.classList.add('idle-animation');
        });
        
        // Efecto adicional de partículas brillantes
        addIdleParticles();
    }
    
    function stopIdleAnimation() {
        idleElements.forEach(el => {
            el.classList.remove('idle-animation');
        });
    }
    
    function resetIdleTimer() {
        stopIdleAnimation();
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(startIdleAnimation, idleTime);
    }
    
    // Eventos que resetean el timer
    ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'].forEach(event => {
        document.addEventListener(event, resetIdleTimer);
    });
    
    // Iniciar timer
    resetIdleTimer();
}

function addIdleParticles() {
    const container = document.getElementById('particles');
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100%';
            particle.style.background = 'var(--accent)';
            particle.style.boxShadow = '0 0 10px var(--accent-glow)';
            particle.style.animation = 'particleFloat 4s ease-out forwards';
            container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 4000);
        }, i * 200);
    }
}

// ========================================
// EFECTOS ADICIONALES
// ========================================

// Efecto parallax suave
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        orb.style.transform = `translate(${scrolled * speed * 0.5}px, ${scrolled * speed}px)`;
    });
});

// Efecto de hover magnético en botones
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translateY(-3px) translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
});

// Efecto de texto que aparece letra por letra
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Animación de ondas en el fondo al hacer clic
document.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
});

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9998;
        animation: rippleEffect 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Agregar animación de ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        0% {
            width: 0;
            height: 0;
            opacity: 0.5;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========================================
// UTILIDADES
// ========================================

// Función para agregar contenido dinámicamente (para uso futuro)
function addContent(section, data) {
    const grid = document.getElementById(`${section}Grid`);
    const addCard = grid.querySelector('.add-card, .add-reflexion');
    
    const newCard = createContentCard(data);
    grid.insertBefore(newCard, addCard);
    
    // Animar entrada
    setTimeout(() => {
        newCard.classList.add('animated');
    }, 100);
}

function createContentCard(data) {
    const card = document.createElement('div');
    card.classList.add('content-card', 'animate-on-scroll');
    card.innerHTML = `
        <div class="card-header">
            <span class="card-number">${data.number || '01'}</span>
            <span class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
            </span>
        </div>
        <h3 class="card-title">${data.title || 'Nuevo contenido'}</h3>
        <p class="card-description">${data.description || 'Descripción del contenido.'}</p>
        <div class="card-footer">
            <span class="card-date">Fecha: ${data.date || '--/--/----'}</span>
            <button class="card-btn">
                <span>Ver más</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
        <div class="card-glow"></div>
    `;
    
    return card;
}

// Console welcome message
console.log('%c¡Bienvenido al Portafolio de Anthony Rodriguez!', 
    'color: #8b5cf6; font-size: 20px; font-weight: bold;');
console.log('%cDesarrollado con amor y creatividad 💜', 
    'color: #06b6d4; font-size: 14px;');
