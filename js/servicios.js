/**
 * INSAVI - Panel de Servicios Varios
 * Visualización de horarios generales y directorio
 */

const Servicios = {
  init() {
    const user = DB.getCurrentUser();
    if (!user) return;

    this.cargarDirectorio();
    this.cargarHorarioGeneral();
  },

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
