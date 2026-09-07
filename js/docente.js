/**
 * INSAVI - Panel de Docente (Rediseñado)
 * Ingreso de notas interactivo y visualización de horarios
 */

const Docente = {
  materiaActiva: null,

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================

  init() {
    const user = DB.getCurrentUser();
    if (!user) return;

    this.cargarEstadisticas(user.id);
    this.cargarMateriasGrid(user.id);
    this.cargarHorario(user.id);
  },

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  cargarEstadisticas(docenteId) {
    const materias = DB.getMateriasByDocente(docenteId);
    document.getElementById('statMisMaterias').textContent = materias.length;

    const seccionesIds = [...new Set(materias.map(m => m.seccion_id))];
    const usuarios = DB.getUsuariosByRol('estudiante');
    const estudiantesEnSecciones = usuarios.filter(u => {
      const seccion = DB.getSecciones().find(s => s.nombre === u.seccion);
      return seccion && seccionesIds.includes(seccion.id);
    });
    document.getElementById('statMisEstudiantes').textContent = estudiantesEnSecciones.length;

    const materiaIds = materias.map(m => m.id);
    const notas = DB.getNotas().filter(n => materiaIds.includes(n.materia_id));
    document.getElementById('statNotasIngresadas').textContent = notas.length;
  },

  // ==========================================
  // GRID DE MATERIAS (MENÚ LATERAL)
  // ==========================================

  cargarMateriasGrid(docenteId) {
    const materias = DB.getMateriasByDocente(docenteId);
    const container = document.getElementById('listaMateriasCards');
    
    if (!container) return; // Por seguridad si no ha cargado el DOM
    
    container.innerHTML = '';

    if (materias.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No tienes materias asignadas aún.</p>`;
      return;
    }

    materias.forEach(m => {
      const seccion = DB.getSeccionById(m.seccion_id);
      const secNombre = seccion ? seccion.nombre : 'Sin sección';
      
      container.innerHTML += `
        <button class="materia-card-btn" id="btn-mat-${m.id}" onclick="Docente.seleccionarMateria('${m.id}', '${m.nombre}', '${secNombre}')">
          <span class="m-title">${m.nombre}</span>
          <span class="m-sec">Sección: ${secNombre}</span>
        </button>
      `;
    });

    // Stagger animation para cards de materias
    const cards = container.querySelectorAll('.materia-card-btn');
    cards.forEach((card, i) => {
      card.classList.add('list-item-enter');
      card.style.animationDelay = `${i * 0.05}s`;
    });
  },

  // ==========================================
  // SELECCIÓN Y CARGA DE ESTUDIANTES
  // ==========================================

  seleccionarMateria(materiaId, nombre, seccionNombre) {
    this.materiaActiva = materiaId;
    
    // UI Update (botones)
    document.querySelectorAll('.materia-card-btn').forEach(btn => btn.classList.remove('active'));
    const btnActivo = document.getElementById(`btn-mat-${materiaId}`);
    if(btnActivo) btnActivo.classList.add('active');
    
    // Alternar paneles
    document.getElementById('panelNotasVacio').style.display = 'none';
    const panelActivo = document.getElementById('panelNotasActivo');
    panelActivo.style.display = 'flex';
    
    // Textos cabecera
    document.getElementById('tituloMateriaActiva').textContent = nombre;
    document.getElementById('subtituloSeccionActiva').textContent = `Sección ${seccionNombre}`;
    
    this.renderTablaEstudiantes(materiaId, seccionNombre);
  },

  renderTablaEstudiantes(materiaId, seccionNombre) {
    const tbody = document.querySelector('#tablaNotasNuevas tbody');
    tbody.innerHTML = '';
    
    const estudiantes = DB.getUsuariosByRol('estudiante').filter(u => u.seccion === seccionNombre);
    
    if (estudiantes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 3rem; color: var(--text-muted);">No hay estudiantes registrados en la sección <b>${seccionNombre}</b>.</td></tr>`;
      return;
    }
    
    let aprobados = 0;
    let reprobados = 0;

    estudiantes.forEach(est => {
      const notaEx = DB.getNotas().find(n => n.estudiante_id === est.id && n.materia_id === materiaId);
      const n1 = notaEx ? notaEx.nota1 : '';
      const n2 = notaEx ? notaEx.nota2 : '';
      const n3 = notaEx ? notaEx.nota3 : '';
      const prom = notaEx ? DB.calcularPromedio(notaEx) : '-';
      
      if (prom !== '-') {
        if (parseFloat(prom) >= 6.0) aprobados++;
        else reprobados++;
      }

      tbody.innerHTML += `
        <tr>
          <td style="padding-left: 1.5rem;">
            <div style="font-weight: 600; color: var(--accent); margin-bottom: 0.1rem; cursor: pointer; text-decoration: underline;" onclick="Docente.verPerfilEstudiante('${est.id}')">${est.nombre}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${est.email}</div>
          </td>
          <td style="text-align:center;">
            <input type="number" class="input" style="width: 70px; padding: 0.4rem; text-align:center; margin: 0 auto;" min="0" max="10" step="0.1" value="${n1}" id="new_n1_${est.id}">
          </td>
          <td style="text-align:center;">
            <input type="number" class="input" style="width: 70px; padding: 0.4rem; text-align:center; margin: 0 auto;" min="0" max="10" step="0.1" value="${n2}" id="new_n2_${est.id}">
          </td>
          <td style="text-align:center;">
            <input type="number" class="input" style="width: 70px; padding: 0.4rem; text-align:center; margin: 0 auto;" min="0" max="10" step="0.1" value="${n3}" id="new_n3_${est.id}">
          </td>
          <td style="text-align:center;">
            <span class="nota-badge ${this.getNotaClass(prom)}">${prom}</span>
          </td>
          <td style="text-align:center; padding-right: 1.5rem;">
            <button class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;" onclick="Docente.guardarNuevaNota('${est.id}', '${materiaId}', '${notaEx ? notaEx.id : ''}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.2rem;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Guardar
            </button>
          </td>
        </tr>
      `;
    });

    // Stagger animation para filas de estudiantes
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      row.classList.add('list-item-enter');
      row.style.animationDelay = `${i * 0.03}s`;
    });

    // Inyectar el resumen en la vista
    let sumContainer = document.getElementById('resumenRendimiento');
    if (!sumContainer) {
      sumContainer = document.createElement('div');
      sumContainer.id = 'resumenRendimiento';
      sumContainer.style = 'padding: 1rem 1.5rem; background: var(--bg-hover); border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;';
      document.getElementById('panelNotasActivo').appendChild(sumContainer);
    }
    
    sumContainer.innerHTML = `
      <div style="font-size: 0.9rem; color: var(--text-secondary);">
        <strong>Resumen de la clase:</strong> 
        <span style="color: var(--success); margin-left: 0.5rem;">${aprobados} Aprobados</span> | 
        <span style="color: var(--error-600);">${reprobados} Reprobados</span> |
        <span class="muted" style="margin-left: 0.5rem;">Total: ${estudiantes.length} alumnos</span>
      </div>
    `;
  },

  verPerfilEstudiante(id) {
    const u = DB.getUsuarioById(id);
    if (!u) return;
    
    const notas = DB.getNotas().filter(n => n.estudiante_id === id);
    const html = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <div style="background: var(--bg-canvas); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
          <h4 style="margin-bottom: 0.25rem; color: var(--accent);">${u.nombre}</h4>
          <p class="muted" style="margin-bottom: 0.75rem;">${u.email}</p>
          <span class="role-badge estudiante">Estudiante</span>
          <strong>Sección:</strong> ${u.seccion || 'Ninguna'}
        </div>
        <div class="mt-2">
          <strong>Rendimiento Académico:</strong>
          <ul style="margin-top: 0.5rem; padding-left: 1.25rem;">
            ${notas.length === 0 ? '<li>Sin notas registradas</li>' : notas.map(n => {
              const materia = DB.getMateriaById(n.materia_id);
              const prom = DB.calcularPromedio(n);
              return `<li>${materia ? materia.nombre : 'Materia borrada'}: Promedio <strong>${prom}</strong></li>`;
            }).join('')}
          </ul>
        </div>
      </div>
      <div class="form-actions mt-3">
        <button type="button" class="btn btn-primary" onclick="closeModal()">Cerrar perfil</button>
      </div>
    `;
    document.getElementById('modalTitle').textContent = 'Perfil del Estudiante';
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('active');
  },

  // ==========================================
  // GUARDAR NOTA
  // ==========================================

  guardarNuevaNota(estudianteId, materiaId, notaId) {
    const nota1 = parseFloat(document.getElementById(`new_n1_${estudianteId}`).value) || 0;
    const nota2 = parseFloat(document.getElementById(`new_n2_${estudianteId}`).value) || 0;
    const nota3 = parseFloat(document.getElementById(`new_n3_${estudianteId}`).value) || 0;

    if (nota1 > 10 || nota2 > 10 || nota3 > 10) {
      showToast('Las notas no pueden ser mayores a 10', 'error');
      return;
    }

    const datosNota = {
      estudiante_id: estudianteId,
      materia_id: materiaId,
      nota1: nota1,
      nota2: nota2,
      nota3: nota3
    };

    if (notaId) {
      DB.actualizarNota(notaId, datosNota);
    } else {
      DB.crearNota(datosNota);
    }

    const materia = DB.getMateriaById(materiaId);
    const seccion = DB.getSeccionById(materia.seccion_id);
    
    // Recargar tabla para mostrar el nuevo promedio
    this.renderTablaEstudiantes(materiaId, seccion.nombre);

    // Recargar KPI
    const user = DB.getCurrentUser();
    this.cargarEstadisticas(user.id);

    showToast('Calificación guardada correctamente', 'success');
  },

  // ==========================================
  // HORARIO DEL DOCENTE
  // ==========================================

  cargarHorario(docenteId) {
    const horarios = DB.getHorariosByDocente(docenteId);
    const container = document.getElementById('horarioDocente');

    if (horarios.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${SVG.clock}</div>
          <h4>Sin horarios asignados</h4>
          <p>No tienes clases programadas esta semana</p>
        </div>
      `;
      return;
    }

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    container.innerHTML = `
      <div class="horario-grid">
        ${dias.map(dia => {
          const horariosDia = horarios.filter(h => h.dia === dia);
          return `
            <div class="horario-dia">
              <div class="horario-dia-header">${dia}</div>
              <div class="horario-dia-content">
                ${horariosDia.length > 0 ? horariosDia.map(h => {
                  const materia = DB.getMateriaById(h.materia_id);
                  const seccion = materia ? DB.getSeccionById(materia.seccion_id) : null;
                  const secNombre = seccion ? seccion.nombre : '-';
                  return `
                    <div class="horario-clase" style="border-left: 3px solid var(--accent); padding-left: 0.75rem; background: var(--bg-canvas); margin-bottom: 0.5rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
                      <div class="time" style="color: var(--accent); font-weight: 600; font-size: 0.85rem; margin-bottom: 0.2rem;">${h.hora_inicio} - ${h.hora_fin}</div>
                      <div class="materia" style="font-weight: 500; color: var(--text-primary);">${materia ? materia.nombre : '-'}</div>
                      <div class="seccion" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.1rem;">Sección: ${secNombre}</div>
                    </div>
                  `;
                }).join('') : '<p class="horario-vacio" style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1rem 0;">Sin clases</p>'}
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

  // ==========================================
  // IMPRESIÓN
  // ==========================================

  imprimirNotas() {
    if (!this.materiaActiva) {
      showToast('Selecciona una materia primero', 'warning');
      return;
    }

    const user = DB.getCurrentUser();
    const materia = DB.getMateriaById(this.materiaActiva);
    const seccion = materia ? DB.getSeccionById(materia.seccion_id) : null;
    const estudiantes = DB.getUsuariosByRol('estudiante').filter(u => u.seccion === (seccion ? seccion.nombre : ''));

    const columnas = ['ESTUDIANTE', 'NOTA 1', 'NOTA 2', 'NOTA 3', 'PROMEDIO', 'ESTADO'];
    const datos = estudiantes.map(est => {
      const nota = DB.getNotas().find(n => n.estudiante_id === est.id && n.materia_id === this.materiaActiva);
      const n1 = nota ? nota.nota1 : '-';
      const n2 = nota ? nota.nota2 : '-';
      const n3 = nota ? nota.nota3 : '-';
      const prom = nota ? DB.calcularPromedio(nota) : '-';
      const estado = prom !== '-' ? (parseFloat(prom) >= 6.0 ? 'Aprobado' : 'Reprobado') : '-';
      return [est.nombre, n1, n2, n3, prom, estado];
    });

    imprimirTabla(
      'Registro de Notas - ' + (materia ? materia.nombre : ''),
      'Seccion: ' + (seccion ? seccion.nombre : '-') + ' | Docente: ' + (user ? user.nombre : ''),
      columnas,
      datos
    );
  }
};
