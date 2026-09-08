/**
 * INSAVI - Dashboard Principal
 * Coordinador de paneles según rol de usuario
 */

let currentView = 'dashboard';

const SVG = {
  home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  building: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/><path d="M14 9h1"/><path d="M14 13h1"/><path d="M14 17h1"/></svg>',
  book: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  pencil: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  family: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  chart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
};

// ==========================================
// INICIALIZACIÓN PRINCIPAL
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  if (!DB.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  const user = DB.getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  setupUserUI(user);
  initTheme();

  const urlParams = new URLSearchParams(window.location.search);
  let view = urlParams.get('view');

  if (!view) {
    window.location.replace(`dashboard.html?view=${user.rol}`);
    return;
  }

  showPanel(view, user);
});

// ==========================================
// CONFIGURACIÓN DE UI
// ==========================================

function setupUserUI(user) {
  const avatar = document.getElementById('userAvatar');
  avatar.textContent = Auth.getUserInitials(user.nombre);

  document.getElementById('userName').textContent = user.nombre;
  document.getElementById('userRole').textContent = Auth.getRolBadge(user.rol).text;
  document.getElementById('sidebarUserInfo').textContent = user.email;

  const greeting = document.getElementById('greetingText');
  const hour = new Date().getHours();
  let saludo = 'Bienvenido';
  if (hour < 12) saludo = 'Buenos días';
  else if (hour < 19) saludo = 'Buenas tardes';
  else saludo = 'Buenas noches';
  greeting.textContent = `${saludo}, ${user.nombre.split(' ')[0]}`;
}

// ==========================================
// MOSTRAR PANEL SEGÚN ROL
// ==========================================

function showPanel(view, user) {
  const currentPanel = document.querySelector('.panel.active');
  
  if (currentPanel) {
    currentPanel.classList.add('panel-exit');
    setTimeout(() => {
      currentPanel.classList.remove('active', 'panel-exit');
      activatePanel(view, user);
    }, 200);
  } else {
    activatePanel(view, user);
  }
}

function activatePanel(view, user) {
  // Resetear tabs admin
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  generateSidebarNav(user.rol);

  const panelMap = {
    admin: 'panelAdmin',
    docente: 'panelDocente',
    estudiante: 'panelEstudiante',
    padre: 'panelPadre',
    servicios: 'panelServicios'
  };

  const titleMap = {
    docente: 'Panel docente',
    estudiante: 'Mi rendimiento académico',
    padre: 'Panel de familia',
    servicios: 'Servicios Generales'
  };

  const panelId = panelMap[view];
  if (!panelId) {
    window.location.href = `dashboard.html?view=${user.rol}`;
    return;
  }

  document.getElementById(panelId).classList.add('active');

  if (titleMap[view]) {
    document.getElementById('pageTitle').textContent = titleMap[view];
  }

  // Inicializar módulo según vista
  if (view === 'admin') {
    Admin.init();
    showAdminTab('usuarios');
  } else if (view === 'docente') {
    Docente.init();
  } else if (view === 'estudiante') {
    Estudiante.init();
  } else if (view === 'padre') {
    Padre.init();
  } else if (view === 'servicios') {
    Servicios.init();
  }

  const activeLink = document.querySelector(`.sidebar-nav .nav-link[data-view="${view}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Ocultar elementos exclusivos de admin si no estamos en admin
  const btnNuevo = document.getElementById('btnNuevoAdmin');
  const subtitle = document.getElementById('pageSubtitle');
  if (view !== 'admin') {
    if (btnNuevo) btnNuevo.style.display = 'none';
    if (subtitle) subtitle.style.display = 'none';
  } else {
    if (subtitle) subtitle.style.display = 'block';
  }

  document.getElementById('pageTitle').scrollIntoView({ block: 'start', behavior: 'smooth' });
  currentView = view;
}

// ==========================================
// GENERAR MENÚ LATERAL
// ==========================================

function generateSidebarNav(rol) {
  const nav = document.getElementById('sidebarNav');
  let html = '';

  if (rol === 'admin') {
    html = `
      <div class="nav-section">Gestión</div>
      <button class="nav-link active" data-admin-tab="usuarios" onclick="showAdminTab('usuarios'); return false;">
        <span class="nav-icon">${SVG.users}</span> Usuarios
      </button>
      <button class="nav-link" data-admin-tab="secciones" onclick="showAdminTab('secciones'); return false;">
        <span class="nav-icon">${SVG.building}</span> Secciones
      </button>
      <button class="nav-link" data-admin-tab="materias" onclick="showAdminTab('materias'); return false;">
        <span class="nav-icon">${SVG.book}</span> Materias
      </button>
      <button class="nav-link" data-admin-tab="horarios" onclick="showAdminTab('horarios'); return false;">
        <span class="nav-icon">${SVG.clock}</span> Horarios
      </button>
    `;
  } else if (rol === 'docente') {
    html = `
      <div class="nav-section">General</div>
      <button class="nav-link active" data-docente-view="resumen" onclick="showDocenteSubPanel('resumen'); return false;">
        <span class="nav-icon">${SVG.home}</span> Resumen
      </button>
      <div class="nav-section">Académico</div>
      <button class="nav-link" data-docente-view="notas" onclick="showDocenteSubPanel('notas'); return false;">
        <span class="nav-icon">${SVG.pencil}</span> Registro de notas
      </button>
      <button class="nav-link" data-docente-view="horario" onclick="showDocenteSubPanel('horario'); return false;">
        <span class="nav-icon">${SVG.clock}</span> Mi horario
      </button>
      <div class="nav-section" style="margin-top: auto;">Próximos eventos</div>
      <div style="padding: 0.5rem 0.75rem;">
        <div style="background: var(--bg-raised); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem; font-size: 0.8rem;">
          <strong style="color: var(--accent); display: block; margin-bottom: 0.25rem;">Reunión General</strong>
          <span style="color: var(--text-muted);">Viernes, 14:00 - Auditorio</span>
        </div>
      </div>
    `;
  } else if (rol === 'estudiante') {
    html = `
      <div class="nav-section">General</div>
      <button class="nav-link active" data-view="estudiante" onclick="showPanel('estudiante', DB.getCurrentUser()); return false;">
        <span class="nav-icon">${SVG.home}</span> Resumen
      </button>
      <div class="nav-section">Académico</div>
      <button class="nav-link" data-view="estudiante" onclick="showPanel('estudiante', DB.getCurrentUser()); return false;">
        <span class="nav-icon">${SVG.chart}</span> Mis notas
      </button>
      <button class="nav-link" data-view="estudiante" onclick="showPanel('estudiante', DB.getCurrentUser()); return false;">
        <span class="nav-icon">${SVG.clock}</span> Mi horario
      </button>
    `;
  } else if (rol === 'padre') {
    html = `
      <div class="nav-section">General</div>
      <button class="nav-link active" data-view="padre" onclick="showPanel('padre', DB.getCurrentUser()); return false;">
        <span class="nav-icon">${SVG.home}</span> Resumen
      </button>
      <div class="nav-section">Seguimiento</div>
      <button class="nav-link" data-view="padre" onclick="showPanel('padre', DB.getCurrentUser()); return false;">
        <span class="nav-icon">${SVG.family}</span> Mis hijos
      </button>
    `;
  } else if (rol === 'servicios') {
    html = `
      <div class="nav-section">General</div>
      <button class="nav-link active" data-view="servicios" onclick="showPanel('servicios', DB.getCurrentUser()); return false;">
        <span class="nav-icon">${SVG.building}</span> Panel de Servicios
      </button>
    `;
  }

  nav.innerHTML = html;

  // Animación stagger para items del sidebar
  const navItems = nav.querySelectorAll('.nav-link, .nav-section');
  navItems.forEach((item, i) => {
    item.classList.add('nav-item-enter');
    item.style.animationDelay = `${i * 0.04}s`;
  });
}

// ==========================================
// TABS DE ADMINISTRACIÓN
// ==========================================

function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));

  const tabElement = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
  if (tabElement) tabElement.classList.add('active');

  // Update Sidebar active state!
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector(`.sidebar-nav .nav-link[data-admin-tab="${tab}"]`);
  if (btn) btn.classList.add('active');

  const btnNuevo = document.getElementById('btnNuevoAdmin');
  const subtitle = document.getElementById('pageSubtitle');

  const titles = {
    'usuarios': { title: 'Gestión de usuarios', sub: 'Administra los usuarios del sistema académico.', btnText: 'Nuevo usuario', action: 'usuario' },
    'secciones': { title: 'Gestión de secciones', sub: 'Administra las secciones y sus capacidades.', btnText: 'Nueva sección', action: 'seccion' },
    'materias': { title: 'Gestión de materias', sub: 'Asigna materias a secciones y docentes.', btnText: 'Nueva materia', action: 'materia' },
    'horarios': { title: 'Gestión de horarios', sub: 'Configura los horarios de clases.', btnText: 'Nuevo horario', action: 'horario' }
  };

  const config = titles[tab] || titles['usuarios'];
  
  document.getElementById('pageTitle').textContent = config.title;
  if (subtitle) subtitle.textContent = config.sub;
  
  if (btnNuevo) {
    btnNuevo.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      ${config.btnText}
    `;
    btnNuevo.onclick = () => openModal(config.action);
    btnNuevo.style.display = 'inline-flex';
  }

  // Botón de imprimir
  const btnImprimir = document.getElementById('btnImprimir');
  if (btnImprimir) {
    const printActions = {
      usuarios: 'Admin.imprimirUsuarios',
      secciones: 'Admin.imprimirSecciones',
      materias: 'Admin.imprimirMaterias',
      horarios: 'Admin.imprimirHorarios'
    };
    if (printActions[tab]) {
      btnImprimir.onclick = () => eval(printActions[tab])();
      btnImprimir.style.display = 'inline-flex';
    } else {
      btnImprimir.style.display = 'none';
    }
  }

  // Refrescar la vista correspondiente
  switch (tab) {
    case 'usuarios': Admin.cargarEstadisticas(); Admin.cargarUsuarios(); break;
    case 'secciones': Admin.cargarSecciones(); break;
    case 'materias': Admin.cargarMaterias(); break;
    case 'horarios': Admin.cargarHorarios(); break;
  }
}

// ==========================================
// SUB-PANELS DOCENTE (toggle entre vistas)
// ==========================================

function showDocenteSubPanel(view) {
  const secciones = {
    resumen: document.getElementById('docenteSeccionNotas'),
    notas: document.getElementById('docenteSeccionNotas'),
    horario: document.getElementById('docenteSeccionHorario')
  };

  // Resumen muestra todo, notas solo notas, horario solo horario
  if (view === 'resumen') {
    Object.values(secciones).forEach(s => { if (s) s.style.display = ''; });
  } else if (view === 'notas') {
    if (secciones.notas) secciones.notas.style.display = '';
    if (secciones.horario) secciones.horario.style.display = 'none';
  } else if (view === 'horario') {
    if (secciones.notas) secciones.notas.style.display = 'none';
    if (secciones.horario) secciones.horario.style.display = '';
  }

  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector(`.sidebar-nav .nav-link[data-docente-view="${view}"]`);
  if (btn) btn.classList.add('active');

  // Scroll to top of panel
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// DRAWER MÓVIL
// ==========================================

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlayDrawer');
  const isOpen = sidebar.classList.contains('open');

  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');

  if (!isOpen) {
    document.querySelectorAll('.mobile-menu-btn').forEach(() => {});
  }
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlayDrawer').classList.remove('open');
}

// ==========================================
// MODO OSCURO / CLARO
// ==========================================

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && userPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeButton(true);
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeButton(false);
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    updateThemeButton(false);
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    updateThemeButton(true);
  }
}

function updateThemeButton(isDark) {
  const text = document.getElementById('themeText');
  if (text) text.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
}

// ==========================================
// EVENTOS GLOBALES
// ==========================================

document.getElementById('mobileMenuBtn')?.addEventListener('click', toggleSidebar);
document.getElementById('overlayDrawer')?.addEventListener('click', closeSidebar);

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeSidebar();
  }
});