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
  chart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  clipboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12l2 2 4-4"/></svg>'
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
  initSidebarState();

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
  if (user.rol === 'docente') {
    avatar.textContent = 'PL';
    avatar.style.background = 'rgba(16, 185, 129, 0.18)';
    avatar.style.color = '#34d399';
    avatar.style.border = '1px solid rgba(16, 185, 129, 0.35)';
  } else {
    avatar.textContent = Auth.getUserInitials(user.nombre);
    avatar.style.background = '';
    avatar.style.color = '';
    avatar.style.border = '';
  }

  document.getElementById('userName').textContent = user.nombre;
  document.getElementById('userRole').textContent = Auth.getRolBadge(user.rol).text;
  document.getElementById('sidebarUserInfo').textContent = user.email;

  const greeting = document.getElementById('greetingText');
  const hour = new Date().getHours();
  let saludo = 'Bienvenido';
  if (hour < 12) saludo = 'Buenos días';
  else if (hour < 19) saludo = 'Buenas tardes';
  else saludo = 'Buenas noches';

  if (user.rol === 'docente') {
    const isProfa = user.nombre.startsWith('Profa.');
    greeting.textContent = `${saludo}, ${isProfa ? 'Profa.' : 'Prof.'}`;
  } else {
    greeting.textContent = `${saludo}, ${user.nombre.split(' ')[0]}`;
  }
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
    admin: 'Gestión de usuarios',
    docente: 'Panel docente',
    estudiante: 'Mi rendimiento académico',
    padre: 'Panel de familia',
    servicios: 'Mis tareas del día'
  };

  const subtitleMap = {
    admin: 'Administra los usuarios del sistema académico.',
    docente: 'Aquí puedes ver un resumen de tu actividad académica y gestionar tus clases.',
    estudiante: 'Consulta tus materias, notas y horario.',
    padre: 'Monitorea el avance de tus hijos.',
    servicios: 'Tickets de tareas diarias asignados a tu cargo.'
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

  const subtitle = document.getElementById('pageSubtitle');
  if (subtitle) {
    if (subtitleMap[view]) {
      subtitle.textContent = subtitleMap[view];
      subtitle.style.display = 'block';
    } else {
      subtitle.style.display = 'none';
    }
  }

  // Inicializar módulo según vista
  if (view === 'admin') {
    Admin.init();
    showAdminTab('usuarios');
  } else if (view === 'docente') {
    Docente.init();
    showDocenteSubPanel('resumen');
  } else if (view === 'estudiante') {
    Estudiante.init();
    showEstudianteSubPanel('resumen');
  } else if (view === 'padre') {
    Padre.init();
    showPadreSubPanel('resumen');
  } else if (view === 'servicios') {
    Servicios.init();
  }

  const activeLink = document.querySelector(`.sidebar-nav .nav-link[data-view="${view}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Ocultar elementos exclusivos de admin si no estamos en admin
  const btnNuevo = document.getElementById('btnNuevoAdmin');
  if (view !== 'admin') {
    if (btnNuevo) btnNuevo.style.display = 'none';
  }

  const illust = document.querySelector('.header-illustration');
  if (illust) {
    illust.style.display = view === 'admin' ? 'block' : 'none';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div class="nav-section">Operativo</div>
      <button class="nav-link" data-admin-tab="servicios" onclick="showAdminTab('servicios'); return false;">
        <span class="nav-icon">${SVG.clipboard}</span> Servicios
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
        <div style="background: var(--bg-raised); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem; font-size: 0.8rem; display: flex; gap: 0.65rem; align-items: flex-start;">
          <div style="color: var(--accent); margin-top: 0.1rem; flex-shrink: 0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <strong style="color: var(--accent); display: block; margin-bottom: 0.25rem;">Reunión General</strong>
            <span style="color: var(--text-muted); font-size: 0.75rem;">Viernes, 14:00 - Auditorio</span>
          </div>
        </div>
      </div>
    `;
  } else if (rol === 'estudiante') {
    html = `
      <div class="nav-section">General</div>
      <button class="nav-link active" data-estudiante-view="resumen" onclick="showEstudianteSubPanel('resumen'); return false;">
        <span class="nav-icon">${SVG.home}</span> Resumen
      </button>
      <div class="nav-section">Académico</div>
      <button class="nav-link" data-estudiante-view="notas" onclick="showEstudianteSubPanel('notas'); return false;">
        <span class="nav-icon">${SVG.chart}</span> Mis notas
      </button>
      <button class="nav-link" data-estudiante-view="horario" onclick="showEstudianteSubPanel('horario'); return false;">
        <span class="nav-icon">${SVG.clock}</span> Mi horario
      </button>
    `;
  } else if (rol === 'padre') {
    html = `
      <div class="nav-section">General</div>
      <button class="nav-link active" data-padre-view="resumen" onclick="showPadreSubPanel('resumen'); return false;">
        <span class="nav-icon">${SVG.home}</span> Resumen
      </button>
      <div class="nav-section">Seguimiento</div>
      <button class="nav-link" data-padre-view="hijos" onclick="showPadreSubPanel('hijos'); return false;">
        <span class="nav-icon">${SVG.family}</span> Mis hijos
      </button>
    `;
  } else if (rol === 'servicios') {
    html = `
      <div class="nav-section">General</div>
      <button class="nav-link active" data-servicios-view="tareas" onclick="showServiciosSubPanel('tareas'); return false;">
        <span class="nav-icon">${SVG.clipboard}</span> Mis tareas del día
      </button>
      <div class="nav-section">Consulta</div>
      <button class="nav-link" data-servicios-view="directorio" onclick="showServiciosSubPanel('directorio'); return false;">
        <span class="nav-icon">${SVG.users}</span> Directorio
      </button>
      <button class="nav-link" data-servicios-view="horario" onclick="showServiciosSubPanel('horario'); return false;">
        <span class="nav-icon">${SVG.clock}</span> Horario general
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
    'horarios': { title: 'Gestión de horarios', sub: 'Configura los horarios de clases.', btnText: 'Nuevo horario', action: 'horario' },
    'servicios': { title: 'Control de servicios', sub: 'Resumen de las tareas diarias del personal de mantenimiento y vigilancia.', btnText: '', action: '' }
  };

  const config = titles[tab] || titles['usuarios'];
  
  document.getElementById('pageTitle').textContent = config.title;
  if (subtitle) subtitle.textContent = config.sub;
  
  if (btnNuevo) {
    if (config.btnText) {
      btnNuevo.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        ${config.btnText}
      `;
      btnNuevo.onclick = () => openModal(config.action);
      btnNuevo.style.display = 'inline-flex';
    } else {
      btnNuevo.style.display = 'none';
    }
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
    case 'servicios': Admin.cargarServicios(); break;
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
// SUB-PANELS ESTUDIANTE (toggle entre vistas)
// ==========================================

function showEstudianteSubPanel(view) {
  const secciones = {
    resumen: document.getElementById('estudianteSeccionResumen'),
    notas: document.getElementById('estudianteSeccionNotas'),
    horario: document.getElementById('estudianteSeccionHorario')
  };

  if (view === 'resumen') {
    if (secciones.resumen) secciones.resumen.style.display = '';
    if (secciones.notas) secciones.notas.style.display = 'none';
    if (secciones.horario) secciones.horario.style.display = 'none';
    document.getElementById('pageTitle').textContent = 'Mi rendimiento académico';
    const sub = document.getElementById('pageSubtitle');
    if (sub) sub.textContent = 'Consulta tus materias, notas y horario.';
  } else if (view === 'notas') {
    if (secciones.resumen) secciones.resumen.style.display = 'none';
    if (secciones.notas) secciones.notas.style.display = '';
    if (secciones.horario) secciones.horario.style.display = 'none';
    document.getElementById('pageTitle').textContent = 'Mis calificaciones';
    const sub = document.getElementById('pageSubtitle');
    if (sub) sub.textContent = 'Registro detallado de tus notas por materia y período.';
    Estudiante.cargarNotasDetalle();
  } else if (view === 'horario') {
    if (secciones.resumen) secciones.resumen.style.display = 'none';
    if (secciones.notas) secciones.notas.style.display = 'none';
    if (secciones.horario) secciones.horario.style.display = '';
    document.getElementById('pageTitle').textContent = 'Mi horario semanal';
    const sub = document.getElementById('pageSubtitle');
    if (sub) sub.textContent = 'Distribución oficial de clases para tu sección.';
    Estudiante.cargarHorarioCompleto();
  }

  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector(`.sidebar-nav .nav-link[data-estudiante-view="${view}"]`);
  if (btn) btn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// SUB-PANELS PADRE (toggle entre vistas)
// ==========================================
function showPadreSubPanel(view) {
  const vistaResumen = document.getElementById('padreVistaResumen');
  const vistaDetalle = document.getElementById('padreVistaDetalle');

  if (view === 'resumen') {
    if (vistaResumen) vistaResumen.style.display = '';
    if (vistaDetalle) vistaDetalle.style.display = 'none';
    document.getElementById('pageTitle').textContent = 'Panel de familia';
    const sub = document.getElementById('pageSubtitle');
    if (sub) sub.textContent = 'Monitorea el avance de tus hijos.';
  } else if (view === 'hijos') {
    if (vistaResumen) vistaResumen.style.display = 'none';
    if (vistaDetalle) vistaDetalle.style.display = '';
    document.getElementById('pageTitle').textContent = 'Seguimiento de estudiantes';
    const sub = document.getElementById('pageSubtitle');
    if (sub) sub.textContent = 'Consulta detallada de calificaciones y horarios.';
    Padre.mostrarVistaHijos();
  }

  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector(`.sidebar-nav .nav-link[data-padre-view="${view}"]`);
  if (btn) btn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// SUB-PANELS SERVICIOS (toggle entre vistas)
// ==========================================

function showServiciosSubPanel(view) {
  const titles = {
    tareas: { title: 'Mis tareas del día', sub: 'Tickets de tareas diarias asignados a tu cargo.' },
    directorio: { title: 'Directorio del personal', sub: 'Personal activo del instituto.' },
    horario: { title: 'Horario general del instituto', sub: 'Distribución oficial de clases por día.' }
  };

  if (Servicios && titles[view]) {
    Servicios.mostrarVista(view);
    document.getElementById('pageTitle').textContent = titles[view].title;
    const sub = document.getElementById('pageSubtitle');
    if (sub) sub.textContent = titles[view].sub;
  }
}

// ==========================================
// CONTROL DEL MENÚ LATERAL (COLAPSO Y MÓVIL)
// ==========================================

function toggleSidebarCollapse() {
  const dash = document.querySelector('.dashboard');
  if (!dash) return;

  if (window.innerWidth <= 768) {
    toggleSidebar();
    return;
  }

  dash.classList.toggle('sidebar-collapsed');
  const isCollapsed = dash.classList.contains('sidebar-collapsed');
  localStorage.setItem('insavi_sidebar_collapsed', isCollapsed ? '1' : '0');
}

function initSidebarState() {
  if (window.innerWidth > 768 && localStorage.getItem('insavi_sidebar_collapsed') === '1') {
    document.querySelector('.dashboard')?.classList.add('sidebar-collapsed');
  }
}

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

  if (savedTheme === 'light') {
    document.documentElement.removeAttribute('data-theme');
    updateThemeButton(false);
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeButton(true);
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