/* ========================================
   PORTAFOLIO DIGITAL - ANTHONY RODRIGUEZ
   JavaScript Completo con Sistema de Contenido
   ======================================== */

// ========================================
// CONFIGURACION GLOBAL
// ========================================
const CONFIG = {
    // Ruta base para los datos (cambiar si usas GitHub Pages con subdirectorio)
    basePath: '',
    // Secciones disponibles
    secciones: ['tareas', 'laboratorios', 'parciales', 'reflexiones'],
    // Tiempo de inactividad en ms
    idleTime: 5000
};

// Cache de datos cargados
const dataCache = {
    tareas: null,
    laboratorios: null,
    parciales: null,
    reflexiones: null
};

// ========================================
// INICIALIZACION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initParticles();
    initNavigation();
    initScrollAnimations();
    initSectionIndicator();
    initCounters();
    initDocumentViewer();
    initIdleDetection();
    
    // Cargar contenido dinamico
    loadAllContent();
});

// ========================================
// SISTEMA DE CARGA DE CONTENIDO
// ========================================
async function loadAllContent() {
    for (const seccion of CONFIG.secciones) {
        await loadSectionContent(seccion);
    }
}

async function loadSectionContent(seccion) {
    try {
        const response = await fetch(`${CONFIG.basePath}data/${seccion}.json`);
        if (!response.ok) {
            console.warn(`No se pudo cargar ${seccion}.json - usando contenido de ejemplo`);
            return;
        }
        
        const data = await response.json();
        dataCache[seccion] = data;
        
        renderSectionContent(seccion, data);
        
    } catch (error) {
        console.warn(`Error cargando ${seccion}:`, error);
    }
}

function renderSectionContent(seccion, data) {
    const gridId = seccion === 'laboratorios' ? 'labsGrid' : `${seccion}Grid`;
    const grid = document.getElementById(gridId);
    
    if (!grid || !data.items || data.items.length === 0) return;
    
    // Limpiar contenido existente excepto la tarjeta de agregar
    const addCard = grid.querySelector('.add-card, .add-reflexion');
    const existingCards = grid.querySelectorAll('.content-card:not(.add-card), .reflexion-card:not(.add-reflexion)');
    existingCards.forEach(card => card.remove());
    
    // Renderizar items
    data.items.forEach((item, index) => {
        let card;
        
        if (seccion === 'reflexiones') {
            card = createReflexionCard(item, index);
        } else {
            card = createContentCard(item, seccion, index);
        }
        
        if (addCard) {
            grid.insertBefore(card, addCard);
        } else {
            grid.appendChild(card);
        }
        
        // Animar entrada con delay
        setTimeout(() => {
            card.classList.add('animated');
        }, index * 100);
    });
    
    // Reinicializar eventos
    initCardEvents();
}

function createContentCard(item, seccion, index) {
    const card = document.createElement('div');
    card.classList.add('content-card', 'animate-on-scroll');
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-seccion', seccion);
    
    const iconSvg = getIconForSection(seccion);
    
    card.innerHTML = `
        <div class="card-header">
            <span class="card-number">${item.numero || String(index + 1).padStart(2, '0')}</span>
            <span class="card-icon">${iconSvg}</span>
        </div>
        <h3 class="card-title">${item.titulo}</h3>
        <p class="card-description">${item.descripcion}</p>
        ${item.materia ? `<span class="card-materia">${item.materia}</span>` : ''}
        ${item.calificacion ? `<span class="card-calificacion">${item.calificacion}</span>` : ''}
        <div class="card-tags">
            ${(item.etiquetas || []).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
        </div>
        <div class="card-footer">
            <span class="card-date">Fecha: ${item.fecha || '--/--/----'}</span>
            <button class="card-btn" data-action="view">
                <span>Ver documento</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
        <div class="card-glow"></div>
    `;
    
    return card;
}

function createReflexionCard(item, index) {
    const card = document.createElement('div');
    card.classList.add('reflexion-card', 'animate-on-scroll');
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-seccion', 'reflexiones');
    
    card.innerHTML = `
        <div class="reflexion-header">
            <span class="reflexion-number">${item.numero || String(index + 1).padStart(2, '0')}</span>
            <span class="reflexion-tema">${item.tema}</span>
        </div>
        <h3 class="reflexion-title">${item.titulo}</h3>
        <p class="reflexion-excerpt">${item.extracto}</p>
        <div class="reflexion-tags">
            ${(item.etiquetas || []).map(tag => `<span class="reflexion-tag">${tag}</span>`).join('')}
        </div>
        <div class="reflexion-footer">
            <span class="reflexion-date">${item.fecha}</span>
            <button class="reflexion-btn" data-action="view">
                <span>Leer completo</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
        <div class="reflexion-glow"></div>
    `;
    
    return card;
}

function getIconForSection(seccion) {
    const icons = {
        tareas: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>`,
        laboratorios: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 3h6v2H9zM9 5v4l-2 8h10l-2-8V5"/>
            <path d="M7 17h10v4H7z"/>
        </svg>`,
        parciales: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>`
    };
    return icons[seccion] || icons.tareas;
}

// ========================================
// VISOR DE DOCUMENTOS
// ========================================
let currentDocument = null;
let currentPageIndex = 0;

function initDocumentViewer() {
    // Crear el visor de documentos
    createDocumentViewerModal();
    
    // Eventos del visor
    const viewer = document.getElementById('documentViewer');
    const closeBtn = document.getElementById('viewerClose');
    const prevBtn = document.getElementById('viewerPrev');
    const nextBtn = document.getElementById('viewerNext');
    const downloadBtn = document.getElementById('viewerDownload');
    const backdrop = viewer.querySelector('.viewer-backdrop');
    
    closeBtn.addEventListener('click', closeDocumentViewer);
    backdrop.addEventListener('click', closeDocumentViewer);
    prevBtn.addEventListener('click', () => navigatePage(-1));
    nextBtn.addEventListener('click', () => navigatePage(1));
    downloadBtn.addEventListener('click', downloadCurrentDocument);
    
    // Navegacion con teclado
    document.addEventListener('keydown', (e) => {
        if (!viewer.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeDocumentViewer();
        if (e.key === 'ArrowLeft') navigatePage(-1);
        if (e.key === 'ArrowRight') navigatePage(1);
    });
}

function createDocumentViewerModal() {
    const viewer = document.createElement('div');
    viewer.id = 'documentViewer';
    viewer.className = 'document-viewer';
    
    viewer.innerHTML = `
        <div class="viewer-backdrop"></div>
        <div class="viewer-container">
            <div class="viewer-header">
                <div class="viewer-info">
                    <span class="viewer-category"></span>
                    <h2 class="viewer-title"></h2>
                </div>
                <div class="viewer-actions">
                    <button class="viewer-action-btn" id="viewerDownload" title="Descargar archivo original">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span>Descargar</span>
                    </button>
                    <button class="viewer-close-btn" id="viewerClose">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="viewer-content">
                <div class="viewer-main">
                    <button class="viewer-nav-btn viewer-prev" id="viewerPrev">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>
                    
                    <div class="viewer-image-container">
                        <img class="viewer-image" id="viewerImage" alt="Pagina del documento" />
                        <div class="viewer-loading">
                            <div class="viewer-spinner"></div>
                            <span>Cargando...</span>
                        </div>
                    </div>
                    
                    <button class="viewer-nav-btn viewer-next" id="viewerNext">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                    </button>
                </div>
                
                <div class="viewer-pagination">
                    <span class="viewer-page-current">1</span>
                    <span class="viewer-page-separator">/</span>
                    <span class="viewer-page-total">1</span>
                </div>
                
                <div class="viewer-thumbnails" id="viewerThumbnails">
                    <!-- Miniaturas generadas dinamicamente -->
                </div>
            </div>
            
            <div class="viewer-description">
                <h3>Descripcion</h3>
                <p class="viewer-desc-text"></p>
                <div class="viewer-meta">
                    <span class="viewer-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span class="viewer-date"></span>
                    </span>
                    <span class="viewer-meta-item viewer-materia-item" style="display: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                        <span class="viewer-materia"></span>
                    </span>
                </div>
                <div class="viewer-tags"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(viewer);
}

function initCardEvents() {
    // Eventos para tarjetas de contenido
    document.querySelectorAll('.content-card:not(.add-card), .reflexion-card:not(.add-reflexion)').forEach(card => {
        card.addEventListener('click', (e) => {
            const id = card.getAttribute('data-id');
            const seccion = card.getAttribute('data-seccion');
            
            if (id && seccion) {
                openDocument(id, seccion);
            }
        });
    });
}

function openDocument(id, seccion) {
    const data = dataCache[seccion];
    if (!data) return;
    
    const item = data.items.find(i => i.id === id);
    if (!item) return;
    
    currentDocument = item;
    currentPageIndex = 0;
    
    const viewer = document.getElementById('documentViewer');
    const categoryEl = viewer.querySelector('.viewer-category');
    const titleEl = viewer.querySelector('.viewer-title');
    const descEl = viewer.querySelector('.viewer-desc-text');
    const dateEl = viewer.querySelector('.viewer-date');
    const materiaEl = viewer.querySelector('.viewer-materia');
    const materiaItem = viewer.querySelector('.viewer-materia-item');
    const tagsEl = viewer.querySelector('.viewer-tags');
    
    // Configurar informacion
    categoryEl.textContent = seccion.charAt(0).toUpperCase() + seccion.slice(1);
    titleEl.textContent = item.titulo;
    dateEl.textContent = item.fecha || '--/--/----';
    
    // Descripcion o contenido completo para reflexiones
    if (seccion === 'reflexiones' && item.contenidoCompleto) {
        descEl.innerHTML = item.contenidoCompleto.replace(/\n/g, '<br>');
    } else {
        descEl.textContent = item.descripcion;
    }
    
    // Materia
    if (item.materia) {
        materiaEl.textContent = item.materia;
        materiaItem.style.display = 'flex';
    } else {
        materiaItem.style.display = 'none';
    }
    
    // Tags
    tagsEl.innerHTML = (item.etiquetas || []).map(tag => 
        `<span class="viewer-tag">${tag}</span>`
    ).join('');
    
    // Cargar paginas/imagenes
    if (item.tipo === 'documento' && item.paginas && item.paginas.length > 0) {
        loadDocumentPages(item.paginas);
    } else if (item.imagenes && item.imagenes.length > 0) {
        loadDocumentPages(item.imagenes);
    } else {
        // Sin paginas - mostrar mensaje
        showNoPages();
    }
    
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function loadDocumentPages(pages) {
    const viewer = document.getElementById('documentViewer');
    const imageEl = document.getElementById('viewerImage');
    const loadingEl = viewer.querySelector('.viewer-loading');
    const thumbnailsEl = document.getElementById('viewerThumbnails');
    const totalEl = viewer.querySelector('.viewer-page-total');
    const prevBtn = document.getElementById('viewerPrev');
    const nextBtn = document.getElementById('viewerNext');
    
    // Actualizar total de paginas
    totalEl.textContent = pages.length;
    
    // Mostrar/ocultar navegacion segun cantidad de paginas
    if (pages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
    
    // Generar miniaturas
    thumbnailsEl.innerHTML = pages.map((page, index) => `
        <div class="viewer-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${CONFIG.basePath}${page}" alt="Pagina ${index + 1}" loading="lazy" />
            <span class="thumbnail-number">${index + 1}</span>
        </div>
    `).join('');
    
    // Eventos de miniaturas
    thumbnailsEl.querySelectorAll('.viewer-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.getAttribute('data-index'));
            goToPage(index);
        });
    });
    
    // Cargar primera pagina
    goToPage(0);
}

function showNoPages() {
    const viewer = document.getElementById('documentViewer');
    const imageEl = document.getElementById('viewerImage');
    const loadingEl = viewer.querySelector('.viewer-loading');
    const thumbnailsEl = document.getElementById('viewerThumbnails');
    const totalEl = viewer.querySelector('.viewer-page-total');
    const prevBtn = document.getElementById('viewerPrev');
    const nextBtn = document.getElementById('viewerNext');
    
    imageEl.style.display = 'none';
    loadingEl.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
        </svg>
        <span style="margin-top: 1rem; color: var(--text-muted);">Sin imagenes disponibles</span>
    `;
    loadingEl.style.display = 'flex';
    thumbnailsEl.innerHTML = '';
    totalEl.textContent = '0';
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
}

function goToPage(index) {
    if (!currentDocument) return;
    
    const pages = currentDocument.paginas || currentDocument.imagenes || [];
    if (index < 0 || index >= pages.length) return;
    
    currentPageIndex = index;
    
    const viewer = document.getElementById('documentViewer');
    const imageEl = document.getElementById('viewerImage');
    const loadingEl = viewer.querySelector('.viewer-loading');
    const currentEl = viewer.querySelector('.viewer-page-current');
    const thumbnails = viewer.querySelectorAll('.viewer-thumbnail');
    
    // Mostrar loading
    loadingEl.style.display = 'flex';
    imageEl.style.opacity = '0';
    
    // Actualizar pagina actual
    currentEl.textContent = index + 1;
    
    // Actualizar thumbnail activo
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    // Cargar imagen
    const img = new Image();
    img.onload = () => {
        imageEl.src = img.src;
        imageEl.style.display = 'block';
        imageEl.style.opacity = '1';
        loadingEl.style.display = 'none';
    };
    img.onerror = () => {
        loadingEl.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style="margin-top: 1rem; color: var(--text-muted);">Error al cargar la imagen</span>
        `;
    };
    img.src = CONFIG.basePath + pages[index];
    
    // Actualizar botones de navegacion
    updateNavButtons();
}

function navigatePage(direction) {
    const pages = currentDocument?.paginas || currentDocument?.imagenes || [];
    const newIndex = currentPageIndex + direction;
    
    if (newIndex >= 0 && newIndex < pages.length) {
        goToPage(newIndex);
    }
}

function updateNavButtons() {
    const pages = currentDocument?.paginas || currentDocument?.imagenes || [];
    const prevBtn = document.getElementById('viewerPrev');
    const nextBtn = document.getElementById('viewerNext');
    
    prevBtn.disabled = currentPageIndex === 0;
    nextBtn.disabled = currentPageIndex === pages.length - 1;
    
    prevBtn.style.opacity = currentPageIndex === 0 ? '0.3' : '1';
    nextBtn.style.opacity = currentPageIndex === pages.length - 1 ? '0.3' : '1';
}

function closeDocumentViewer() {
    const viewer = document.getElementById('documentViewer');
    viewer.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentDocument = null;
    currentPageIndex = 0;
}

function downloadCurrentDocument() {
    if (!currentDocument || !currentDocument.archivoOriginal) {
        alert('No hay archivo disponible para descargar');
        return;
    }
    
    const link = document.createElement('a');
    link.href = CONFIG.basePath + currentDocument.archivoOriginal;
    link.download = currentDocument.titulo.replace(/[^a-z0-9]/gi, '_') + '.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ========================================
// LOADER
// ========================================
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
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
    
    // Detectar dispositivos tactiles
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
        return;
    }
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX - 6 + 'px';
        cursor.style.top = cursorY - 6 + 'px';
        
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX - 20 + 'px';
        cursorFollower.style.top = followerY - 20 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .content-card, .reflexion-card, .viewer-thumbnail');
        if (target) {
            cursor.style.transform = 'scale(2)';
            cursorFollower.style.transform = 'scale(1.5)';
            cursorFollower.style.borderColor = 'var(--primary)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .content-card, .reflexion-card, .viewer-thumbnail');
        if (target) {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
            cursorFollower.style.borderColor = 'var(--primary-light)';
        }
    });
}

// ========================================
// PARTICULAS DE FONDO
// ========================================
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
    
    container.appendChild(particle);
}

// ========================================
// NAVEGACION
// ========================================
function initNavigation() {
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
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
        link.classList.toggle('active', link.getAttribute('data-section') === currentSection);
    });
    
    indicatorDots.forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-section') === currentSection);
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
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// INDICADOR DE SECCION
// ========================================
function initSectionIndicator() {
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    indicatorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            if (targetSection) smoothScrollTo(targetSection);
        });
    });
}

// ========================================
// CONTADORES ANIMADOS
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
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
// DETECCION DE INACTIVIDAD
// ========================================
function initIdleDetection() {
    let idleTimeout;
    const idleElements = document.querySelectorAll('.hero-title, .about-image-placeholder, .logo-dot');
    
    function startIdleAnimation() {
        idleElements.forEach(el => el.classList.add('idle-animation'));
        addIdleParticles();
    }
    
    function stopIdleAnimation() {
        idleElements.forEach(el => el.classList.remove('idle-animation'));
    }
    
    function resetIdleTimer() {
        stopIdleAnimation();
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(startIdleAnimation, CONFIG.idleTime);
    }
    
    ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'].forEach(event => {
        document.addEventListener(event, resetIdleTimer);
    });
    
    resetIdleTimer();
}

function addIdleParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
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

// Parallax suave
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.gradient-orb').forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        orb.style.transform = `translate(${scrolled * speed * 0.5}px, ${scrolled * speed}px)`;
    });
});

// Hover magnetico en botones
document.addEventListener('DOMContentLoaded', () => {
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
});

// Efecto ripple al hacer clic
document.addEventListener('click', (e) => {
    // No crear ripple en el visor de documentos
    if (e.target.closest('.document-viewer')) return;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
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
});

// Agregar estilos dinamicos
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes cardEntry {
        0% { opacity: 0; transform: translateY(30px) scale(0.95); }
        50% { transform: translateY(-5px) scale(1.02); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    @keyframes rippleEffect {
        0% { width: 0; height: 0; opacity: 0.5; }
        100% { width: 200px; height: 200px; opacity: 0; }
    }
`;
document.head.appendChild(dynamicStyles);

// Mensaje de bienvenida en consola
console.log('%c Bienvenido al Portafolio de Anthony Rodriguez!', 
    'color: #8b5cf6; font-size: 20px; font-weight: bold;');
console.log('%c Sistema de contenido dinamico cargado', 
    'color: #06b6d4; font-size: 14px;');
