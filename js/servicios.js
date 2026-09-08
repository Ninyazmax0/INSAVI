/**
 * INSAVI - Panel de Servicios Varios
 * Sistema de tareas diarias (tickets) por cargo:
 *  - Limpieza, Mantenimiento y Seguridad
 *  - El trabajador marca el estado: pendiente / en progreso / completada
 *  - El estado se guarda en localStorage por día
 */

const Servicios = {
  init() {
    const user = DB.getCurrentUser();
    if (!user) return;

    this.user = user;
    this.fecha = DB.getFechaHoy();

    // Generar los tickets del día si aún no existen
    DB.generarTareasDelDia(this.fecha);

    if (user.rol === 'servicios') {
      this.mostrarVista('tareas');
    } else {
      this.mostrarVista('directorio');
    }
  },

  // ==========================================
  // SUB-PANELS (toggle entre vistas)
  // ==========================================

  mostrarVista(view) {
    const secciones = {
      tareas: document.getElementById('serviciosVistaTareas'),
      directorio: document.getElementById('serviciosVistaDirectorio'),
      horario: document.getElementById('serviciosVistaHorario')
    };

    Object.values(secciones).forEach(s => { if (s) s.style.display = 'none'; });
    if (secciones[view]) secciones[view].style.display = '';

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.sidebar-nav .nav-link[data-servicios-view="${view}"]`);
    if (btn) btn.classList.add('active');

    if (view === 'tareas') this.cargarTareas();
    else if (view === 'directorio') this.cargarDirectorio();
    else if (view === 'horario') this.cargarHorarioGeneral();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // ==========================================
  // MIS TAREAS DEL DÍA
  // ==========================================

  cargarTareas() {
    const container = document.getElementById('serviciosTareas');
    if (!container) return;

    const tareas = DB.getTareasDelUsuario(this.user.id, this.fecha);

    if (tareas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <h4>Sin tareas asignadas</h4>
          <p>No hay tickets programados para tu cargo hoy.</p>
        </div>
      `;
      return;
    }

    const estados = {
      pendiente: tareas.filter(t => t.estado === 'pendiente').length,
      en_progreso: tareas.filter(t => t.estado === 'en_progreso').length,
      completada: tareas.filter(t => t.estado === 'completada').length
    };

    const total = tareas.length;
    const porcentaje = Math.round((estados.completada / total) * 100);

    container.innerHTML = `
      <div class="servicios-progreso mb-2">
        <div class="servicios-progreso-info">
          <span class="servicios-fecha">Tareas del día — ${this.formatFecha(this.fecha)}</span>
          <span class="servicios-progreso-valor">${estados.completada}/${total} completadas</span>
        </div>
        <div class="servicios-progreso-bar">
          <div class="servicios-progreso-fill" style="width: ${porcentaje}%"></div>
        </div>
        <div class="servicios-progreso-pills">
          <span class="pill pill-pendiente">${estados.pendiente} pendientes</span>
          <span class="pill pill-progreso">${estados.en_progreso} en progreso</span>
          <span class="pill pill-completada">${estados.completada} completadas</span>
        </div>
      </div>

      <div class="tareas-lista">
        ${tareas.map((t, i) => this.renderTarea(t, i)).join('')}
      </div>
    `;
  },

  renderTarea(tarea, index) {
    const estado = tarea.estado;
    const etiquetas = {
      pendiente: { text: 'Pendiente', cls: 'estado-pendiente' },
      en_progreso: { text: 'En progreso', cls: 'estado-progreso' },
      completada: { text: 'Completada', cls: 'estado-completada' }
    };
    const et = etiquetas[estado] || etiquetas.pendiente;

    const iconoTurno = tarea.turno === 'manana'
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

    return `
      <div class="tarea-card servicio-tarea-enter tarea--${estado}" style="animation-delay: ${index * 0.05}s">
        <div class="tarea-borde"></div>
        <div class="tarea-contenido">
          <div class="tarea-top">
            <h4 class="tarea-titulo">${tarea.titulo}</h4>
            <span class="tarea-estado ${et.cls}">${et.text}</span>
          </div>
          <p class="tarea-descripcion">${tarea.descripcion}</p>
          <div class="tarea-meta">
            <span class="badge-turno ${tarea.turno}">
              ${iconoTurno} ${tarea.turno === 'manana' ? 'Turno mañana' : 'Turno tarde'}
            </span>
          </div>
          <div class="tarea-acciones">
            ${estado === 'pendiente' ? `
              <button class="btn btn-soft btn-sm" onclick="Servicios.cambiarEstado('${tarea.id}', 'en_progreso')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Iniciar
              </button>
            ` : ''}
            ${estado !== 'completada' ? `
              <button class="btn btn-success btn-sm" onclick="Servicios.cambiarEstado('${tarea.id}', 'completada')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Completar
              </button>
            ` : `
              <span class="tarea-check">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                Hecho
              </span>
            `}
            ${estado === 'en_progreso' ? `
              <button class="btn btn-ghost btn-sm" onclick="Servicios.cambiarEstado('${tarea.id}', 'pendiente')">Cancelar</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  cambiarEstado(tareaId, estado) {
    if (estado === 'completada' && !confirm('¿Marcar esta tarea como completada?')) return;

    DB.actualizarEstadoTarea(tareaId, estado, this.fecha);
    this.cargarTareas();

    const mensajes = {
      en_progreso: 'Tarea en progreso',
      completada: '¡Tarea completada!',
      pendiente: 'Tarea devuelta a pendiente'
    };
    showToast(mensajes[estado] || 'Estado actualizado', estado === 'completada' ? 'success' : 'info');
  },

  formatFecha(fecha) {
    const d = new Date(fecha + 'T00:00:00');
    return d.toLocaleDateString('es-SV', { weekday: 'long', day: 'numeric', month: 'long' });
  },

  // ==========================================
  // DIRECTORIO
  // ==========================================

  cargarDirectorio() {
    const container = document.getElementById('directorioServicios');
    if (!container) return;

    const admins = DB.getUsuariosByRol('admin');
    const docentes = DB.getUsuariosByRol('docente');
    const personal = [...admins, ...docentes].filter(u => u.activo);

    if (personal.length === 0) {
      container.innerHTML = '<p class="muted">No hay personal registrado.</p>';
      return;
    }

    container.innerHTML = personal.map(p => `
      <div class="nota-card" style="margin-bottom: 0.5rem; padding: 1rem;">
        <div>
          <div class="materia-name">${p.nombre}</div>
          <div class="muted" style="font-size: 0.85rem;">${p.email}</div>
        </div>
        <div class="role-badge ${p.rol}">${p.rol === 'admin' ? 'Administración' : 'Docente'}</div>
      </div>
    `).join('');
  },

  // ==========================================
  // HORARIO GENERAL
  // ==========================================

  cargarHorarioGeneral() {
    const container = document.getElementById('horarioServicios');
    if (!container) return;

    const horarios = DB.getHorarios();
    if (horarios.length === 0) {
      container.innerHTML = '<p class="muted">No hay clases programadas.</p>';
      return;
    }

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    container.innerHTML = `
      <div class="horario-grid">
        ${dias.map(dia => {
          const horariosDia = horarios.filter(h => h.dia === dia);
          // Sort by time
          horariosDia.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

          return `
            <div class="horario-dia">
              <div class="horario-dia-header">${dia}</div>
              <div class="horario-dia-content">
                ${horariosDia.length > 0 ? horariosDia.map(h => {
                  const materia = DB.getMateriaById(h.materia_id);
                  const seccion = materia ? DB.getSeccionById(materia.seccion_id) : null;
                  return `
                    <div class="horario-clase" style="padding: 0.5rem;">
                      <div class="time">${h.hora_inicio} - ${h.hora_fin}</div>
                      <div class="materia">${materia ? materia.nombre : '-'}</div>
                      <div class="muted" style="font-size: 0.8rem;">Sección: ${seccion ? seccion.nombre : '-'}</div>
                    </div>
                  `;
                }).join('') : '<p class="horario-vacio">Libre</p>'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};