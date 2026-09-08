const Docente = {
  materiaActiva: null,

  init() {
    const user = DB.getCurrentUser();
    if (!user) return;
    this.cargarEstadisticas(user.id);
    this.cargarMateriasGrid(user.id);
    this.cargarHorario(user.id);
  },


  cargarEstadisticas(docenteId) {
    const materias = DB.getMateriasByDocente(docenteId);
    const elMaterias = document.getElementById('statMisMaterias');
    if (elMaterias) elMaterias.textContent = materias.length;

    const seccionesIds = [...new Set(materias.map(m => m.seccion_id))];
    const usuarios = DB.getUsuariosByRol('estudiante');
    const estudiantesEnSecciones = usuarios.filter(u => {
      const seccion = DB.getSecciones().find(s => s.nombre === u.seccion);
      return seccion && seccionesIds.includes(seccion.id);
    });
    const elEstudiantes = document.getElementById('statMisEstudiantes');
    if (elEstudiantes) elEstudiantes.textContent = estudiantesEnSecciones.length;

    const materiaIds = materias.map(m => m.id);
    const notas = DB.getNotas().filter(n => materiaIds.includes(n.materia_id));
    const elNotas = document.getElementById('statNotasIngresadas');
    if (elNotas) elNotas.textContent = notas.length;
  },

  getMateriaIconInfo(nombre) {
    const n = (nombre || '').toLowerCase();
    if (n.includes('financiera') || n.includes('contabilidad') || n.includes('estadística')) {
      return {
        svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
        colorClass: 'teal'
      };
    }
    if (n.includes('aplicada') || n.includes('técnica') || n.includes('mecatrónica') || n.includes('física')) {
      return {
        svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        colorClass: 'amber'
      };
    }
    return {
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4H6l7 8-7 8h12"/></svg>',
      colorClass: 'purple'
    };
  },

  cargarMateriasGrid(docenteId) {
    const materias = DB.getMateriasByDocente(docenteId);
    const container = document.getElementById('listaMateriasCards');

    if (!container) return;
    container.innerHTML = '';

    if (materias.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; padding: 1rem; text-align: center;">No tienes materias asignadas aún.</p>`;
      return;
    }

    materias.forEach(m => {
      const seccion = DB.getSeccionById(m.seccion_id);
      const secNombre = seccion ? seccion.nombre : 'Sin sección';
      const iconInfo = this.getMateriaIconInfo(m.nombre);

      container.innerHTML += `
        <button class="docente-materia-btn" id="btn-mat-${m.id}" onclick="Docente.seleccionarMateria('${m.id}', '${m.nombre}', '${secNombre}')">
          <div class="docente-materia-badge ${iconInfo.colorClass}">
            ${iconInfo.svg}
          </div>
          <div class="docente-materia-info">
            <span class="docente-materia-name">${m.nombre}</span>
            <span class="docente-materia-sec">Sección: ${secNombre}</span>
          </div>
          <div class="docente-materia-chevron">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </button>
      `;
    });

    if (!this.materiaActiva) {
      const targetMateria = materias.find(m => m.id === 'mat_011') || materias[0];
      if (targetMateria) {
        const seccion = DB.getSeccionById(targetMateria.seccion_id);
        const secNombre = seccion ? seccion.nombre : 'Sin sección';
        this.seleccionarMateria(targetMateria.id, targetMateria.nombre, secNombre);
      }
    } else {
      const btn = document.getElementById(`btn-mat-${this.materiaActiva}`);
      if (btn) btn.classList.add('active');
    }
  },

  seleccionarMateria(materiaId, nombre, seccionNombre) {
    this.materiaActiva = materiaId;

    document.querySelectorAll('.docente-materia-btn').forEach(btn => btn.classList.remove('active'));
    const btnActivo = document.getElementById(`btn-mat-${materiaId}`);
    if (btnActivo) btnActivo.classList.add('active');

    const panelVacio = document.getElementById('panelNotasVacio');
    if (panelVacio) panelVacio.style.display = 'none';
    const panelActivo = document.getElementById('panelNotasActivo');
    if (panelActivo) panelActivo.style.display = 'flex';

    const iconInfo = this.getMateriaIconInfo(nombre);
    const iconoHeader = document.getElementById('iconoMateriaActiva');
    if (iconoHeader) {
      iconoHeader.innerHTML = iconInfo.svg;
      iconoHeader.className = `docente-calif-symbol ${iconInfo.colorClass}`;
    }

    const elTitulo = document.getElementById('tituloMateriaActiva');
    if (elTitulo) elTitulo.textContent = nombre;

    const elSubtitulo = document.getElementById('subtituloSeccionActiva');
    if (elSubtitulo) elSubtitulo.textContent = `Sección: ${seccionNombre}`;

    this.renderTablaEstudiantes(materiaId, seccionNombre);
  },

  renderTablaEstudiantes(materiaId, seccionNombre) {
    const tbody = document.querySelector('#tablaNotasNuevas tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const estudiantes = DB.getUsuariosByRol('estudiante').filter(u => u.seccion === seccionNombre);

    if (estudiantes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 3.5rem; color: var(--text-muted); font-size: 0.95rem;">No hay estudiantes registrados en la sección <b>${seccionNombre}</b>.</td></tr>`;
      this.actualizarResumenFooter(0, 0, 0);
      return;
    }

    let aprobados = 0;
    let reprobados = 0;

    estudiantes.forEach(est => {
      const notaEx = DB.getNotas().find(n => n.estudiante_id === est.id && n.materia_id === materiaId);
      const n1 = notaEx && notaEx.nota1 !== undefined ? notaEx.nota1 : '';
      const n2 = notaEx && notaEx.nota2 !== undefined ? notaEx.nota2 : '';
      const n3 = notaEx && notaEx.nota3 !== undefined ? notaEx.nota3 : '';

      let promFormatted = '-';
      let promClass = 'prom-none';

      if (notaEx) {
        const rawProm = DB.calcularPromedio(notaEx);
        if (rawProm !== '-') {
          const numProm = parseFloat(rawProm);
          promFormatted = numProm.toFixed(2);
          if (numProm >= 9.0) {
            promClass = 'prom-excellent';
            aprobados++;
          } else if (numProm >= 7.5) {
            promClass = 'prom-good';
            aprobados++;
          } else if (numProm >= 6.0) {
            promClass = 'prom-average';
            aprobados++;
          } else {
            promClass = 'prom-poor';
            reprobados++;
          }
        }
      }

      tbody.innerHTML += `
        <tr>
          <td>
            <div class="docente-student-cell">
              <span class="docente-student-name" onclick="Docente.verPerfilEstudiante('${est.id}')" title="Ver perfil de ${est.nombre}">
                ${est.nombre}
              </span>
              <span class="docente-student-email">${est.email}</span>
            </div>
          </td>
          <td>
            <input type="number" class="docente-nota-input" min="0" max="10" step="0.1" value="${n1}" id="new_n1_${est.id}">
          </td>
          <td>
            <input type="number" class="docente-nota-input" min="0" max="10" step="0.1" value="${n2}" id="new_n2_${est.id}">
          </td>
          <td>
            <input type="number" class="docente-nota-input" min="0" max="10" step="0.1" value="${n3}" id="new_n3_${est.id}">
          </td>
          <td>
            <span class="docente-prom-badge ${promClass}">${promFormatted}</span>
          </td>
          <td>
            <div class="docente-actions-group">
              <button class="docente-btn-guardar" onclick="Docente.guardarNuevaNota('${est.id}', '${materiaId}', '${notaEx ? notaEx.id : ''}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>
                Guardar
              </button>
              <button class="docente-btn-dots" onclick="Docente.verPerfilEstudiante('${est.id}')" title="Ver detalles y notas">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    this.actualizarResumenFooter(aprobados, reprobados, estudiantes.length);
  },

  actualizarResumenFooter(aprobados, reprobados, total) {
    const elTexto = document.getElementById('resumenRendimientoTexto');
    if (elTexto) {
      elTexto.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span><strong>Resumen de la clase:</strong> <span style="color: #34d399; margin-left: 0.35rem;">${aprobados} Aprobados</span> | <span style="color: #f87171;">${reprobados} Reprobados</span> | <span style="color: var(--text-muted); margin-left: 0.35rem;">Total: ${total} alumnos</span></span>
      `;
    }

    const elActualizacion = document.getElementById('resumenUltimaActualizacion');
    if (elActualizacion) {
      const now = new Date();
      const horas = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      elActualizacion.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Última actualización: Hoy, ${horas}:${mins}</span>
      `;
    }
  },

  guardarNuevaNota(estudianteId, materiaId, notaId) {
    const input1 = document.getElementById(`new_n1_${estudianteId}`);
    const input2 = document.getElementById(`new_n2_${estudianteId}`);
    const input3 = document.getElementById(`new_n3_${estudianteId}`);

    const nota1 = input1 && input1.value !== '' ? parseFloat(input1.value) : 0;
    const nota2 = input2 && input2.value !== '' ? parseFloat(input2.value) : 0;
    const nota3 = input3 && input3.value !== '' ? parseFloat(input3.value) : 0;

    if (nota1 > 10 || nota2 > 10 || nota3 > 10 || nota1 < 0 || nota2 < 0 || nota3 < 0) {
      showToast('Las notas deben estar comprendidas entre 0.0 y 10.0', 'error');
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

    this.renderTablaEstudiantes(materiaId, seccion.nombre);

    const user = DB.getCurrentUser();
    this.cargarEstadisticas(user.id);

    showToast('Calificación guardada correctamente', 'success');
  },

  cargarHorario(docenteId) {
    const horarios = DB.getHorariosByDocente(docenteId);
    const container = document.getElementById('horarioDocente');
    if (!container) return;

    const dias = [
      { nombre: 'Lunes', classBanner: 'banner-lunes', esHoy: true, icon: 'cal' },
      { nombre: 'Martes', classBanner: 'banner-martes', esHoy: false, icon: 'user' },
      { nombre: 'Miércoles', classBanner: 'banner-miercoles', esHoy: false, icon: 'cal' },
      { nombre: 'Jueves', classBanner: 'banner-jueves', esHoy: false, icon: 'user' },
      { nombre: 'Viernes', classBanner: 'banner-viernes', esHoy: false, icon: 'cal' }
    ];

    const iconCalendarSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.35rem;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
    const iconUserSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.35rem;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

    const barColors = ['#10b981', '#f59e0b', '#38bdf8', '#8b5cf6', '#ec4899'];
    const timeColors = ['#34d399', '#fbbf24', '#38bdf8', '#a78bfa', '#f472b6'];

    container.innerHTML = `
      <div class="docente-horario-grid">
        ${dias.map(d => {
          const clasesDia = horarios.filter(h => h.dia.toLowerCase() === d.nombre.toLowerCase());

          let diaHtml = `
            <div class="docente-dia-col">
              <div class="docente-dia-banner ${d.classBanner}">
                <div style="display: flex; align-items: center;">
                  ${d.icon === 'user' ? iconUserSvg : iconCalendarSvg}
                  ${d.nombre.toUpperCase()}
                </div>
                ${d.esHoy ? '<span class="docente-badge-hoy">Hoy</span>' : ''}
              </div>
          `;

          if (clasesDia.length > 0) {
            diaHtml += `<div class="docente-dia-content">`;
            clasesDia.forEach((h, idx) => {
              const materia = DB.getMateriaById(h.materia_id);
              const seccion = materia ? DB.getSeccionById(materia.seccion_id) : null;
              const secNombre = seccion ? seccion.nombre : '-';
              const barColor = barColors[idx % barColors.length];
              const timeColor = timeColors[idx % timeColors.length];

              diaHtml += `
                <div class="docente-clase-card" style="--clase-accent: ${barColor}; --clase-time: ${timeColor};">
                  <div class="docente-clase-time">${h.hora_inicio} - ${h.hora_fin}</div>
                  <div class="docente-clase-materia">${materia ? materia.nombre : 'Clase'}</div>
                  <div class="docente-clase-seccion">Sección: ${secNombre}</div>
                </div>
              `;
            });
            diaHtml += `</div>`;
          } else {
            diaHtml += `
              <div class="docente-dia-vacio">
                <div class="docente-vacio-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div class="docente-vacio-title">Sin clases</div>
              </div>
            `;
          }

          diaHtml += `</div>`;
          return diaHtml;
        }).join('')}
      </div>
    `;
  },

  verPerfilEstudiante(id) {
    const u = DB.getUsuarioById(id);
    if (!u) return;

    const notas = DB.getNotas().filter(n => n.estudiante_id === id);
    const html = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(139, 92, 246, 0.25); margin-bottom: 1.25rem;">
          <h3 style="margin-bottom: 0.25rem; color: #a78bfa; font-size: 1.25rem;">${u.nombre}</h3>
          <p style="color: var(--text-muted); margin-bottom: 0.85rem; font-size: 0.85rem;">${u.email}</p>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <span class="role-badge estudiante" style="margin: 0;">Estudiante</span>
            <span style="font-size: 0.88rem; color: var(--text-secondary);"><strong>Sección:</strong> ${u.seccion || 'Ninguna'}</span>
          </div>
        </div>
        <div>
          <strong style="color: var(--text-primary); font-size: 1rem; display: block; margin-bottom: 0.75rem;">Historial de Calificaciones:</strong>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${notas.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.88rem;">Sin notas registradas</p>' : notas.map(n => {
              const materia = DB.getMateriaById(n.materia_id);
              const prom = DB.calcularPromedio(n);
              return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; background: var(--bg-canvas); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                  <span style="font-weight: 500; font-size: 0.88rem; color: var(--text-primary);">${materia ? materia.nombre : 'Materia'}</span>
                  <span class="docente-prom-badge ${parseFloat(prom) >= 6.0 ? 'prom-good' : 'prom-poor'}">${prom}</span>
                </div>
              `;
            }).join('')}
          </div>
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

  verCalendarioCompleto() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const horarios = DB.getHorariosByDocente(user.id);
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    const html = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <p style="color: var(--text-muted); margin-bottom: 1.25rem;">Programación completa de clases semanales para <strong>${user.nombre}</strong>.</p>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Día</th>
                <th>Horario</th>
                <th>Materia</th>
                <th>Sección</th>
              </tr>
            </thead>
            <tbody>
              ${horarios.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-muted);">Sin clases registradas</td></tr>' :
                horarios.sort((a,b) => dias.indexOf(a.dia) - dias.indexOf(b.dia)).map(h => {
                  const mat = DB.getMateriaById(h.materia_id);
                  const sec = mat ? DB.getSeccionById(mat.seccion_id) : null;
                  return `
                    <tr>
                      <td><strong style="color: #a78bfa;">${h.dia}</strong></td>
                      <td class="tnum" style="font-weight: 600;">${h.hora_inicio} - ${h.hora_fin}</td>
                      <td>${mat ? mat.nombre : '-'}</td>
                      <td>${sec ? sec.nombre : '-'}</td>
                    </tr>
                  `;
                }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="form-actions mt-3">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cerrar</button>
        <button type="button" class="btn btn-primary" onclick="window.print()">Imprimir horario</button>
      </div>
    `;
    document.getElementById('modalTitle').textContent = 'Calendario Semanal de Docente';
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('active');
  },

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
      'Sección: ' + (seccion ? seccion.nombre : '-') + ' | Docente: ' + (user ? user.nombre : ''),
      columnas,
      datos
    );
  }
};
