/**
 * INSAVI - Panel de Padre de Familia
 * Visualización de notas e hijos
 */

const Padre = {
  // ==========================================
  // INICIALIZACIÓN
  // ==========================================

  init() {
    const user = DB.getCurrentUser();
    if (!user) return;

    this.cargarHijos(user.hijos || []);
  },

  hijoActivoId: null,

  // ==========================================
  // CARGAR HIJOS
  // ==========================================

  cargarHijos(hijosIds) {
    const container = document.getElementById('listaHijosCards');
    if (!container) return;

    if (hijosIds.length === 0) {
      container.innerHTML = '<p class="muted" style="padding: 1rem; text-align: center;">No tienes hijos asignados en el sistema.</p>';
      return;
    }

    container.innerHTML = hijosIds.map(hijoId => {
      const hijo = DB.getUsuarioById(hijoId);
      if (!hijo) return '';
      return `
        <button class="materia-card-btn" id="btnHijo_${hijo.id}" onclick="Padre.seleccionarHijo('${hijo.id}')" style="display: flex; align-items: center; gap: 0.85rem; padding: 0.85rem 1rem; width: 100%;">
          <div class="user-table-avatar estudiante" style="width: 40px; height: 40px; font-size: 0.95rem; flex-shrink: 0;">
            ${Auth.getUserInitials(hijo.nombre)}
          </div>
          <div style="flex: 1; text-align: left; overflow: hidden;">
            <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${hijo.nombre}</div>
            <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--text-muted);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Sección: <strong>${hijo.seccion || 'Sin asignar'}</strong></span>
            </div>
          </div>
        </button>
      `;
    }).join('');

    // Stagger animation para cards de hijos
    const cards = container.querySelectorAll('.materia-card-btn');
    cards.forEach((card, i) => {
      card.classList.add('list-item-enter');
      card.style.animationDelay = `${i * 0.05}s`;
    });

    if (hijosIds.length > 0) {
      this.seleccionarHijo(hijosIds[0]);
    }
  },

  // ==========================================
  // SELECCIONAR HIJO
  // ==========================================

  seleccionarHijo(hijoId) {
    this.hijoActivoId = hijoId;

    // Actualizar UI activa
    document.querySelectorAll('#listaHijosCards .materia-card-btn').forEach(btn => btn.classList.remove('active'));
    const btnActivo = document.getElementById(`btnHijo_${hijoId}`);
    if (btnActivo) btnActivo.classList.add('active');

    // Cambiar paneles
    document.getElementById('panelPadreVacio').style.display = 'none';
    const container = document.getElementById('infoHijo');
    container.style.display = 'block';

    const hijo = DB.getUsuarioById(hijoId);
    if (!hijo) return;

    // Llenar header
    document.getElementById('nombreHijoActivo').textContent = hijo.nombre;
    document.getElementById('statSeccionHijo').textContent = hijo.seccion ? `Sección ${hijo.seccion}` : 'Sin asignar';
    const promedio = DB.getPromedioGeneral(hijoId);
    document.getElementById('statPromedioHijo').textContent = promedio;

    this.renderNotas(hijoId, hijo.seccion);
    this.renderHorario(hijo.seccion);
  },

  // ==========================================
  // RENDER NOTAS
  // ==========================================

  renderNotas(estudianteId, seccionNombre) {
    const container = document.getElementById('notasHijo');
    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);

    if (!seccion) {
      container.innerHTML = this.emptyState('No se encontró la sección asignada', SVG.building);
      return;
    }

    const materias = DB.getMateriasBySeccion(seccion.id);
    const notas = DB.getNotasByEstudiante(estudianteId);

    if (materias.length === 0) {
      container.innerHTML = this.emptyState('No hay materias registradas para esta sección', SVG.book);
      return;
    }

    container.innerHTML = materias.map(materia => {
      const nota = notas.find(n => n.materia_id === materia.id);
      const promedio = nota ? DB.calcularPromedio(nota) : '-';
      const promedioClass = this.getNotaClass(promedio);
      const docente = DB.getUsuarioById(materia.docente_id);

      return `
        <div class="nota-card">
          <div>
            <div class="materia-name">${materia.nombre}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">
              Docente: ${docente ? docente.nombre : 'Sin asignar'}
            </div>
            <div class="notas-grid">
              <div class="nota-item">
                <div class="label">Nota 1</div>
                <div class="value">${nota ? nota.nota1 : '-'}</div>
              </div>
              <div class="nota-item">
                <div class="label">Nota 2</div>
                <div class="value">${nota ? nota.nota2 : '-'}</div>
              </div>
              <div class="nota-item">
                <div class="label">Nota 3</div>
                <div class="value">${nota ? nota.nota3 : '-'}</div>
              </div>
            </div>
          </div>
          <div class="promedio ${promedioClass}">
            ${promedio}
          </div>
        </div>
      `;
    }).join('');

    // Stagger animation para cards de notas
    const cards = container.querySelectorAll('.nota-card');
    cards.forEach((card, i) => {
      card.classList.add('list-item-enter');
      card.style.animationDelay = `${i * 0.05}s`;
    });
  },

  // ==========================================
  // RENDER HORARIO
  // ==========================================

  renderHorario(seccionNombre) {
    const container = document.getElementById('horarioHijo');
    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);

    if (!seccion) {
      container.innerHTML = this.emptyState('No se encontró la sección', SVG.building);
      return;
    }

    const horarios = DB.getHorariosBySeccion(seccion.id);

    if (horarios.length === 0) {
      container.innerHTML = this.emptyState('No hay horarios asignados', SVG.clock);
      return;
    }

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    container.innerHTML = `
      <div class="horario-grid">
        ${dias.map(dia => {
          const horariosDia = horarios.filter(h => h.dia === dia);
          horariosDia.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

          return `
            <div class="horario-dia">
              <div class="horario-dia-header">${dia}</div>
              <div class="horario-dia-content">
                ${horariosDia.length > 0 ? horariosDia.map(h => {
                  const materia = DB.getMateriaById(h.materia_id);
                  const docente = materia ? DB.getUsuarioById(materia.docente_id) : null;
                  return `
                    <div class="horario-clase">
                      <div class="time">${h.hora_inicio} - ${h.hora_fin}</div>
                      <div class="materia">${materia ? materia.nombre : '-'}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${docente ? docente.nombre : ''}</div>
                    </div>
                  `;
                }).join('') : '<p class="horario-vacio">Sin clases</p>'}
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
  },

  emptyState(mensaje, icon) {
    return `
      <div class="empty-state">
        <div class="empty-icon">${icon}</div>
        <h4>${mensaje}</h4>
      </div>
    `;
  }
};

