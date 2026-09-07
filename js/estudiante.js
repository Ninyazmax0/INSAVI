/**
 * INSAVI - Panel de Estudiante
 * Visualización de notas, horarios y promedios
 */

const Estudiante = {
  // ==========================================
  // INICIALIZACIÓN
  // ==========================================

  init() {
    const user = DB.getCurrentUser();
    if (!user) return;

    this.cargarEstadisticas(user.id, user.seccion);
    this.cargarNotas(user.id, user.seccion);
    this.cargarHorario(user.seccion);
  },

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  cargarEstadisticas(estudianteId, seccionNombre) {
    const promedio = DB.getPromedioGeneral(estudianteId);
    document.getElementById('statPromedioGeneral').textContent = promedio;

    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);
    if (seccion) {
      const materias = DB.getMateriasBySeccion(seccion.id);
      document.getElementById('statMisMateriasEst').textContent = materias.length;
    }

    const notas = DB.getNotasByEstudiante(estudianteId);
    document.getElementById('statTotalNotasEst').textContent = notas.length;
  },

  // ==========================================
  // NOTAS DEL ESTUDIANTE
  // ==========================================

  cargarNotas(estudianteId, seccionNombre) {
    const container = document.getElementById('notasEstudiante');
    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);

    if (!seccion) {
      container.innerHTML = this.emptyState('No se encontró tu sección', SVG.building);
      return;
    }

    const materias = DB.getMateriasBySeccion(seccion.id);
    const notas = DB.getNotasByEstudiante(estudianteId);

    if (materias.length === 0) {
      container.innerHTML = this.emptyState('No hay materias asignadas', SVG.book);
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
  // HORARIO DEL ESTUDIANTE
  // ==========================================

  cargarHorario(seccionNombre) {
    const container = document.getElementById('horarioEstudiante');
    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);

    if (!seccion) {
      container.innerHTML = this.emptyState('No se encontró tu sección', SVG.building);
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
          // Ordenar por hora
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
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${docente ? docente.nombre : ''}</div>
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
  },

  // ==========================================
  // IMPRESIÓN
  // ==========================================

  imprimirNotas() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const notas = DB.getNotas().filter(n => n.estudiante_id === user.id);
    const columnas = ['MATERIA', 'NOTA 1', 'NOTA 2', 'NOTA 3', 'PROMEDIO', 'ESTADO'];
    const datos = notas.map(n => {
      const materia = DB.getMateriaById(n.materia_id);
      const prom = DB.calcularPromedio(n);
      const estado = prom !== '-' ? (parseFloat(prom) >= 6.0 ? 'Aprobado' : 'Reprobado') : '-';
      return [materia ? materia.nombre : 'Materia borrada', n.nota1, n.nota2, n.nota3, prom, estado];
    });

    imprimirTabla(
      'Mis Notas - Reporte Academico',
      'Estudiante: ' + user.nombre + ' | Seccion: ' + (user.seccion || '-'),
      columnas,
      datos
    );
  }
};

