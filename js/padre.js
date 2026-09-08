/**
 * INSAVI - Panel de Padre de Familia (Rediseño de Alta Fidelidad)
 * Vista resumen familiar (KPIs + previsualización) → Vista detalle (selector de hijos, calificaciones y horario)
 */

const Padre = {
  hijoActivoId: null,
  hijosIds: [],

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================

  init() {
    const user = DB.getCurrentUser();
    if (!user) return;

    this.hijosIds = user.hijos || [];
    this.cargarResumen(this.hijosIds);
  },

  // ==========================================
  // ICONOS Y COLORES POR MATERIA (SVG)
  // ==========================================

  getMateriaIconInfo(nombre) {
    const n = (nombre || '').toLowerCase();
    if (n.includes('matemática') || n.includes('calculo') || n.includes('algebra')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4H6l7 8-7 8h12"/></svg>',
        colorClass: 'purple'
      };
    }
    if (n.includes('lenguaje') || n.includes('literatura') || n.includes('español')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        colorClass: 'green'
      };
    }
    if (n.includes('ciencia') || n.includes('química') || n.includes('física') || n.includes('biología')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.69 18.25A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.71-2.75L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/></svg>',
        colorClass: 'amber'
      };
    }
    if (n.includes('inglés') || n.includes('idioma') || n.includes('english')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        colorClass: 'indigo'
      };
    }
    if (n.includes('informática') || n.includes('ofimática') || n.includes('computación') || n.includes('tecnología')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
        colorClass: 'cyan'
      };
    }
    return {
      symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      colorClass: 'purple'
    };
  },

  // ==========================================
  // VISTA RESUMEN: KPIs + preview cards
  // ==========================================

  cargarResumen(hijosIds) {
    const elHijos = document.getElementById('statTotalHijos');
    if (elHijos) elHijos.textContent = hijosIds.length;

    if (hijosIds.length === 0) {
      document.getElementById('statPromedioFamilia').textContent = '-';
      document.getElementById('statHijosAprobados').textContent = '0';
      return;
    }

    // Calcular promedio familiar
    const promedios = hijosIds.map(id => parseFloat(DB.getPromedioGeneral(id))).filter(p => !isNaN(p));
    const promFamilia = promedios.length > 0
      ? (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(2)
      : '-';
    document.getElementById('statPromedioFamilia').textContent = promFamilia;

    // Contar hijos con promedio >= 6
    const aprobados = promedios.filter(p => p >= 6).length;
    document.getElementById('statHijosAprobados').textContent = aprobados;

    // Renderizar preview cards
    this.renderPreviewCards(hijosIds);
  },

  renderPreviewCards(hijosIds) {
    const container = document.getElementById('padreHijosPreview');
    if (!container) return;

    container.innerHTML = hijosIds.map(hijoId => {
      const hijo = DB.getUsuarioById(hijoId);
      if (!hijo) return '';
      const promedio = DB.getPromedioGeneral(hijoId);
      const promNum = parseFloat(promedio);
      const estado = !isNaN(promNum) ? (promNum >= 6 ? 'Al día' : 'En riesgo') : 'Sin notas';
      const estadoClass = !isNaN(promNum) ? (promNum >= 6 ? 'estado-aprobado' : 'estado-riesgo') : 'estado-sin';
      const initials = Auth.getUserInitials(hijo.nombre);

      const notas = DB.getNotasByEstudiante(hijoId);
      const seccion = DB.getSecciones().find(s => s.nombre === hijo.seccion);
      const materias = seccion ? DB.getMateriasBySeccion(seccion.id) : [];
      const matCount = materias.length;

      return `
        <div class="padre-preview-card" onclick="Padre.irADetalle('${hijo.id}')">
          <div class="padre-preview-avatar">${initials}</div>
          <div class="padre-preview-info">
            <div class="padre-preview-nombre">${hijo.nombre}</div>
            <div class="padre-preview-seccion">Sección: <strong>${hijo.seccion || 'Sin asignar'}</strong></div>
            <div class="padre-preview-materias">${matCount} materias · ${notas.length} calificaciones registradas</div>
          </div>
          <div class="padre-preview-right">
            <div class="padre-preview-promedio">${promedio !== '-' ? promedio : '—'}</div>
            <div class="padre-preview-promedio-label">promedio global</div>
            <span class="padre-estado-badge ${estadoClass}">${estado}</span>
          </div>
          <svg class="padre-preview-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      `;
    }).join('');
  },

  // ==========================================
  // TRANSICIÓN ENTRE VISTAS
  // ==========================================

  mostrarVistaHijos() {
    const vistaResumen = document.getElementById('padreVistaResumen');
    const vistaDetalle = document.getElementById('padreVistaDetalle');
    if (vistaResumen) vistaResumen.style.display = 'none';
    if (vistaDetalle) vistaDetalle.style.display = 'block';

    // Sidebar active state
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.sidebar-nav .nav-link[data-padre-view="hijos"]`);
    if (btn) btn.classList.add('active');

    this.cargarHijos(this.hijosIds);

    // Auto-seleccionar primer hijo si no hay ninguno activo
    if (!this.hijoActivoId && this.hijosIds.length > 0) {
      this.seleccionarHijo(this.hijosIds[0]);
    } else if (this.hijoActivoId) {
      this.seleccionarHijo(this.hijoActivoId);
    }
  },

  irADetalle(hijoId) {
    this.hijoActivoId = hijoId;
    this.mostrarVistaHijos();
    setTimeout(() => this.seleccionarHijo(hijoId), 50);
  },

  volverResumen() {
    const vistaResumen = document.getElementById('padreVistaResumen');
    const vistaDetalle = document.getElementById('padreVistaDetalle');
    if (vistaDetalle) vistaDetalle.style.display = 'none';
    if (vistaResumen) vistaResumen.style.display = 'block';

    // Sidebar active state
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.sidebar-nav .nav-link[data-padre-view="resumen"]`);
    if (btn) btn.classList.add('active');

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = 'Panel de familia';
    const sub = document.getElementById('pageSubtitle');
    if (sub) sub.textContent = 'Monitorea el avance de tus hijos.';
  },

  // ==========================================
  // CARGAR HIJOS (lista lateral en vista detalle)
  // ==========================================

  cargarHijos(hijosIds) {
    const container = document.getElementById('listaHijosCards');
    if (!container) return;

    if (hijosIds.length === 0) {
      container.innerHTML = '<p style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.88rem;">No tienes hijos asignados.</p>';
      return;
    }

    container.innerHTML = hijosIds.map((hijoId, i) => {
      const hijo = DB.getUsuarioById(hijoId);
      if (!hijo) return '';
      const initials = Auth.getUserInitials(hijo.nombre);
      return `
        <button class="docente-materia-btn ${this.hijoActivoId === hijo.id ? 'active' : ''}" id="btnHijo_${hijo.id}" onclick="Padre.seleccionarHijo('${hijo.id}')" style="animation-delay: ${i * 0.05}s">
          <div class="docente-materia-avatar estudiante-avatar">${initials}</div>
          <div class="docente-materia-info">
            <span class="docente-materia-name">${hijo.nombre}</span>
            <span class="docente-materia-sec">Sección: <strong>${hijo.seccion || '—'}</strong></span>
          </div>
          <div class="docente-materia-chevron">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </button>
      `;
    }).join('');

    const cards = container.querySelectorAll('.docente-materia-btn');
    cards.forEach(c => c.classList.add('list-item-enter'));
  },

  // ==========================================
  // SELECCIONAR HIJO
  // ==========================================

  seleccionarHijo(hijoId) {
    this.hijoActivoId = hijoId;

    document.querySelectorAll('#listaHijosCards .docente-materia-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`btnHijo_${hijoId}`);
    if (btn) btn.classList.add('active');

    const panelVacio = document.getElementById('panelPadreVacio');
    if (panelVacio) panelVacio.style.display = 'none';

    const infoHijo = document.getElementById('infoHijo');
    if (infoHijo) infoHijo.style.display = 'flex';

    const hijo = DB.getUsuarioById(hijoId);
    if (!hijo) return;

    // Header del perfil del hijo
    const icono = document.getElementById('iconoHijoActivo');
    if (icono) icono.textContent = Auth.getUserInitials(hijo.nombre);

    const nombre = document.getElementById('nombreHijoActivo');
    if (nombre) nombre.textContent = hijo.nombre;

    const seccion = document.getElementById('statSeccionHijo');
    if (seccion) seccion.textContent = hijo.seccion ? `Sección ${hijo.seccion}` : 'Sin asignar';

    const prom = document.getElementById('statPromedioHijo');
    if (prom) prom.textContent = DB.getPromedioGeneral(hijoId);

    this.renderNotas(hijoId, hijo.seccion);
    this.renderHorario(hijo.seccion);
  },

  // ==========================================
  // RENDER NOTAS (con iconos y footer)
  // ==========================================

  renderNotas(estudianteId, seccionNombre) {
    const tbody = document.getElementById('notasHijo');
    if (!tbody) return;

    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);
    if (!seccion) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">Sección no encontrada</td></tr>`;
      return;
    }

    const materias = DB.getMateriasBySeccion(seccion.id);
    const notas = DB.getNotasByEstudiante(estudianteId);

    if (materias.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">Sin materias registradas</td></tr>`;
      return;
    }

    let aprobadasCount = 0;
    let reprobadasCount = 0;

    tbody.innerHTML = materias.map(materia => {
      const nota = notas.find(n => n.materia_id === materia.id);
      const promedio = nota ? DB.calcularPromedio(nota) : '-';
      const promNum = parseFloat(promedio);
      const aprobado = !isNaN(promNum) && promNum >= 6;
      if (nota) {
        if (aprobado) aprobadasCount++;
        else reprobadasCount++;
      }
      const promedioClass = this.getNotaClass(promedio);
      const docente = DB.getUsuarioById(materia.docente_id);
      const icon = this.getMateriaIconInfo(materia.nombre);

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="est-materia-icon ${icon.colorClass}" style="width: 32px; height: 32px; flex-shrink: 0;">
                ${icon.symbol}
              </div>
              <div>
                <div style="font-weight: 600; color: var(--text-primary); font-size: 0.92rem;">${materia.nombre}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">${docente ? docente.nombre : 'Docente asignado'}</div>
              </div>
            </div>
          </td>
          <td class="tnum" style="text-align: center; font-weight: 600;">${nota ? nota.nota1 : '—'}</td>
          <td class="tnum" style="text-align: center; font-weight: 600;">${nota ? nota.nota2 : '—'}</td>
          <td class="tnum" style="text-align: center; font-weight: 600;">${nota ? nota.nota3 : '—'}</td>
          <td style="text-align: center;">
            <span class="docente-prom-badge ${promedioClass}">${promedio}</span>
          </td>
          <td style="text-align: center;">
            ${nota
              ? `<span style="font-size: 0.78rem; font-weight: 600; color: ${aprobado ? '#34d399' : '#f87171'}; padding: 0.25rem 0.65rem; background: ${aprobado ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)'}; border-radius: 20px; border: 1px solid ${aprobado ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'};">${aprobado ? 'Aprobada' : 'Reprobada'}</span>`
              : '<span style="font-size: 0.78rem; color: var(--text-muted);">Sin notas</span>'
            }
          </td>
        </tr>
      `;
    }).join('');

    // Actualizar texto del footer
    const footerTexto = document.getElementById('resumenHijoTexto');
    if (footerTexto) {
      footerTexto.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>Resumen: <strong>${aprobadasCount} Aprobadas</strong> | <strong>${reprobadasCount} Reprobadas</strong> | Total: ${materias.length} materias</span>
      `;
    }
  },

  // ==========================================
  // RENDER HORARIO (5 columnas estilizadas)
  // ==========================================

  renderHorario(seccionNombre) {
    const container = document.getElementById('horarioHijo');
    if (!container) return;

    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);
    if (!seccion) {
      container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.88rem;">Sección no encontrada.</p>`;
      return;
    }

    const horarios = DB.getHorariosBySeccion(seccion.id);
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const diaCorto = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
    const hoyLong = new Date().toLocaleDateString('es-SV', { weekday: 'long' });
    const hoyCapital = hoyLong.charAt(0).toUpperCase() + hoyLong.slice(1);

    container.innerHTML = `
      <div class="padre-horario-grid">
        ${dias.map((dia, idx) => {
          const clases = horarios.filter(h => h.dia === dia).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
          const esHoy = dia === hoyCapital;
          return `
            <div class="padre-horario-dia">
              <div class="padre-horario-dia-header ${esHoy ? 'hoy' : ''}">
                <span>${diaCorto[idx]}</span>
                ${esHoy ? '<span class="padre-hoy-tag">Hoy</span>' : ''}
              </div>
              <div class="padre-horario-dia-body">
                ${clases.length > 0 ? clases.map(h => {
                  const materia = DB.getMateriaById(h.materia_id);
                  return `
                    <div class="padre-horario-clase">
                      <div class="padre-clase-time">${h.hora_inicio} - ${h.hora_fin}</div>
                      <div class="padre-clase-nombre">${materia ? materia.nombre : '—'}</div>
                      <div class="padre-clase-sec">Sección: ${seccion.nombre}</div>
                    </div>
                  `;
                }).join('') : `
                  <div class="padre-horario-vacio">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>Sin clases</span>
                  </div>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // ==========================================
  // UTILIDADES
  // ==========================================

  getNotaClass(promedio) {
    const num = parseFloat(promedio);
    if (isNaN(num)) return '';
    if (num >= 9) return 'excellent';
    if (num >= 7.5) return 'good';
    if (num >= 6) return 'average';
    return 'poor';
  }
};

