const Estudiante = {
  diaHorarioActivo: 'Lunes',

  init() {
    const user = DB.getCurrentUser();
    if (!user) return;

    this.cargarEstadisticas(user.id, user.seccion);
    this.cargarNotasResumen(user.id, user.seccion);

    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoyIndex = new Date().getDay();
    const hoyNombre = (hoyIndex >= 1 && hoyIndex <= 5) ? dias[hoyIndex] : 'Lunes';
    this.seleccionarDiaHorario(hoyNombre);

    this.cargarWidgets(user.id, user.seccion);
  },

  getMateriaIconInfo(nombre) {
    const n = (nombre || '').toLowerCase();
    if (n.includes('matemática') || n.includes('calculo') || n.includes('algebra')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4H6l7 8-7 8h12"/></svg>',
        colorClass: 'purple',
        badgeBg: 'rgba(168, 85, 247, 0.16)',
        badgeColor: '#c084fc',
        dotColor: '#a855f7'
      };
    }
    if (n.includes('lenguaje') || n.includes('literatura') || n.includes('español')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        colorClass: 'green',
        badgeBg: 'rgba(16, 185, 129, 0.16)',
        badgeColor: '#34d399',
        dotColor: '#10b981'
      };
    }
    if (n.includes('ciencia') || n.includes('química') || n.includes('física') || n.includes('biología')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.69 18.25A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.71-2.75L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/></svg>',
        colorClass: 'amber',
        badgeBg: 'rgba(245, 158, 11, 0.16)',
        badgeColor: '#fbbf24',
        dotColor: '#f59e0b'
      };
    }
    if (n.includes('inglés') || n.includes('idioma') || n.includes('english')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        colorClass: 'indigo',
        badgeBg: 'rgba(99, 102, 241, 0.16)',
        badgeColor: '#818cf8',
        dotColor: '#6366f1'
      };
    }
    if (n.includes('informática') || n.includes('ofimática') || n.includes('computación') || n.includes('tecnología')) {
      return {
        symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
        colorClass: 'cyan',
        badgeBg: 'rgba(6, 182, 212, 0.16)',
        badgeColor: '#38bdf8',
        dotColor: '#06b6d4'
      };
    }
    return {
      symbol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      colorClass: 'purple',
      badgeBg: 'rgba(139, 92, 246, 0.16)',
      badgeColor: '#a78bfa',
      dotColor: '#8b5cf6'
    };
  },

  cargarEstadisticas(estudianteId, seccionNombre) {
    const promedio = DB.getPromedioGeneral(estudianteId);
    const elProm = document.getElementById('statPromedioGeneral');
    if (elProm) elProm.textContent = promedio !== '-' ? promedio : '—';

    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);
    let matCount = 0;
    if (seccion) {
      const materias = DB.getMateriasBySeccion(seccion.id);
      matCount = materias.length;
      const elMat = document.getElementById('statMisMateriasEst');
      if (elMat) elMat.textContent = matCount;
    }

    const notas = DB.getNotasByEstudiante(estudianteId);
    const elNotas = document.getElementById('statTotalNotasEst');
    if (elNotas) elNotas.textContent = notas.length;

    const aprobadas = notas.filter(n => {
      const prom = DB.calcularPromedio(n);
      return parseFloat(prom) >= 6;
    }).length;
    const elAprob = document.getElementById('statAprobadas');
    if (elAprob) elAprob.textContent = aprobadas;
  },

  cargarNotasResumen(estudianteId, seccionNombre) {
    const container = document.getElementById('notasEstudiante');
    if (!container) return;

    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);
    if (!seccion) {
      container.innerHTML = `<p style="padding: 2rem; text-align: center; color: var(--text-muted);">No se encontró la sección asignada.</p>`;
      return;
    }

    const materias = DB.getMateriasBySeccion(seccion.id);
    const notas = DB.getNotasByEstudiante(estudianteId);

    if (materias.length === 0) {
      container.innerHTML = `<p style="padding: 2rem; text-align: center; color: var(--text-muted);">No tienes materias registradas.</p>`;
      return;
    }

    container.innerHTML = materias.map((materia, i) => {
      const nota = notas.find(n => n.materia_id === materia.id);
      const promedio = nota ? DB.calcularPromedio(nota) : '-';
      const promNum = parseFloat(promedio);
      const icon = this.getMateriaIconInfo(materia.nombre);
      const docente = DB.getUsuarioById(materia.docente_id);

      return `
        <div class="est-nota-card list-item-enter" style="animation-delay: ${i * 0.04}s">
          <div class="est-nota-left">
            <div class="est-materia-icon ${icon.colorClass}">
              ${icon.symbol}
            </div>
            <div class="est-materia-meta">
              <span class="est-materia-title">${materia.nombre}</span>
              <span class="est-materia-prof">${docente ? docente.nombre : 'Docente asignado'}</span>
            </div>
          </div>

          <div class="est-nota-mid">
            <div class="est-score-pill">
              <span class="est-pill-tag">Nota 1</span>
              <span class="est-pill-val tnum">${nota ? nota.nota1 : '—'}</span>
            </div>
            <div class="est-score-pill">
              <span class="est-pill-tag">Nota 2</span>
              <span class="est-pill-val tnum">${nota ? nota.nota2 : '—'}</span>
            </div>
            <div class="est-score-pill">
              <span class="est-pill-tag">Nota 3</span>
              <span class="est-pill-val tnum">${nota ? nota.nota3 : '—'}</span>
            </div>
          </div>

          <div class="est-nota-right-badge">
            <div class="est-promedio-pill ${promNum >= 6 ? 'aprobado' : (isNaN(promNum) ? 'sin-nota' : 'reprobado')}">
              <span class="tnum">${promedio !== '-' ? promedio : '—'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  seleccionarDiaHorario(dia) {
    this.diaHorarioActivo = dia;

    document.querySelectorAll('#estDiaPills .est-dia-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-dia') === dia);
    });

    const user = DB.getCurrentUser();
    if (!user) return;

    const container = document.getElementById('estudianteHorarioHoy');
    if (!container) return;

    const seccion = DB.getSecciones().find(s => s.nombre === user.seccion);
    if (!seccion) {
      container.innerHTML = `<p style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">Sin datos de sección.</p>`;
      return;
    }

    const horarios = DB.getHorariosBySeccion(seccion.id).filter(h => h.dia === dia)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

    if (horarios.length === 0) {
      container.innerHTML = `
        <div class="est-horario-vacio">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Sin clases programadas para ${dia}</span>
        </div>
      `;
      return;
    }

    container.innerHTML = horarios.map(h => {
      const materia = DB.getMateriaById(h.materia_id);
      const icon = this.getMateriaIconInfo(materia ? materia.nombre : '');
      return `
        <div class="est-clase-mini-card">
          <div class="est-clase-time-badge">${h.hora_inicio} - ${h.hora_fin}</div>
          <div class="est-clase-info">
            <div class="est-clase-title">${materia ? materia.nombre : 'Clase'}</div>
            <div class="est-clase-sec">Sección: ${user.seccion || '1°A'}</div>
          </div>
          <div class="est-clase-dot" style="background: ${icon.dotColor};"></div>
        </div>
      `;
    }).join('');
  },

  cargarWidgets(estudianteId, seccionNombre) {
    const calGrid = document.getElementById('estCalGrid');
    if (calGrid) {
      const diasSemana = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
      let calHtml = diasSemana.map(d => `<div class="est-cal-head">${d}</div>`).join('');

      const offset = 1;
      for (let i = 0; i < offset; i++) {
        calHtml += `<div class="est-cal-day muted">31</div>`;
      }
      const hoyNum = new Date().getDate();
      for (let d = 1; d <= 30; d++) {
        const esHoy = d === hoyNum;
        calHtml += `<div class="est-cal-day ${esHoy ? 'hoy' : ''}">${d}</div>`;
      }
      calGrid.innerHTML = calHtml;
    }

    const seccion = DB.getSecciones().find(s => s.nombre === seccionNombre);
    const notas = DB.getNotasByEstudiante(estudianteId);
    let totalMaterias = seccion ? DB.getMateriasBySeccion(seccion.id).length : 5;
    if (totalMaterias === 0) totalMaterias = 5;

    const aprobadas = notas.filter(n => {
      const p = DB.calcularPromedio(n);
      return parseFloat(p) >= 6;
    }).length;

    const pct = Math.round((aprobadas / totalMaterias) * 100);
    const elPct = document.getElementById('estProgresoPct');
    if (elPct) elPct.textContent = `${pct}%`;

    const elDesc = document.getElementById('estProgresoDesc');
    if (elDesc) elDesc.textContent = `${aprobadas} de ${totalMaterias} materias al día`;

    const ringBar = document.getElementById('estRingBar');
    if (ringBar) {
      const radius = 36;
      const circumference = 2 * Math.PI * radius;
      ringBar.style.strokeDasharray = `${circumference}`;
      const offsetVal = circumference - (circumference * pct) / 100;
      ringBar.style.strokeDashoffset = `${offsetVal}`;
    }

    const chartWrap = document.getElementById('estChartWrap');
    if (chartWrap) {
      const promActual = parseFloat(DB.getPromedioGeneral(estudianteId)) || 8.5;
      const p1 = Math.max(7.0, (promActual - 0.4)).toFixed(1);
      const p2 = Math.max(7.0, (promActual - 0.1)).toFixed(1);
      const p3 = promActual.toFixed(2);

      chartWrap.innerHTML = `
        <div class="est-chart-container">
          <svg class="est-chart-svg" viewBox="0 0 460 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.45"/>
                <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.0"/>
              </linearGradient>
            </defs>

            <!-- Grid lines -->
            <line x1="40" y1="30" x2="440" y2="30" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>
            <line x1="40" y1="70" x2="440" y2="70" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>
            <line x1="40" y1="110" x2="440" y2="110" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>

            <!-- Area bajo la curva -->
            <path d="M 60 95 C 130 95, 170 65, 230 65 C 290 65, 330 45, 380 45 L 380 140 L 60 140 Z" fill="url(#chartGradient)"/>

            <!-- Curva SVG de progreso -->
            <path d="M 60 95 C 130 95, 170 65, 230 65 C 290 65, 330 45, 380 45" fill="none" stroke="#a78bfa" stroke-width="3" stroke-linecap="round"/>

            <!-- Puntos interactivos -->
            <circle cx="60" cy="95" r="5" fill="#8b5cf6" stroke="#fff" stroke-width="2"/>
            <circle cx="230" cy="65" r="5" fill="#8b5cf6" stroke="#fff" stroke-width="2"/>
            <circle cx="380" cy="45" r="6" fill="#06b6d4" stroke="#fff" stroke-width="2.5"/>
          </svg>

          <div class="est-chart-x-labels">
            <div class="est-x-col">
              <span class="periodo-num">1P</span>
              <span class="periodo-val tnum">${p1}</span>
            </div>
            <div class="est-x-col">
              <span class="periodo-num">2P</span>
              <span class="periodo-val tnum">${p2}</span>
            </div>
            <div class="est-x-col current">
              <span class="periodo-num">3P (Actual)</span>
              <span class="periodo-val tnum badge">${p3}</span>
            </div>
            <div class="est-x-col muted">
              <span class="periodo-num">4P</span>
              <span class="periodo-val">—</span>
            </div>
          </div>
        </div>
      `;
    }

    const rankingList = document.getElementById('estRankingList');
    if (rankingList && seccion) {
      const materias = DB.getMateriasBySeccion(seccion.id);
      const ranking = materias.map(m => {
        const n = notas.find(item => item.materia_id === m.id);
        const prom = n ? parseFloat(DB.calcularPromedio(n)) : 0;
        return {
          nombre: m.nombre,
          promedio: n ? DB.calcularPromedio(n) : '-',
          promNum: prom,
          icon: this.getMateriaIconInfo(m.nombre)
        };
      }).sort((a, b) => b.promNum - a.promNum);

      rankingList.innerHTML = ranking.map(item => `
        <div class="est-ranking-item">
          <div class="est-ranking-left">
            <span class="est-rank-dot" style="background: ${item.icon.dotColor};"></span>
            <span class="est-rank-nombre">${item.nombre}</span>
          </div>
          <div class="est-rank-score tnum">${item.promedio}</div>
        </div>
      `).join('');
    }
  },

  cargarNotasDetalle() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const tbody = document.getElementById('notasEstudianteTablaBody');
    if (!tbody) return;

    const seccion = DB.getSecciones().find(s => s.nombre === user.seccion);
    if (!seccion) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-muted);">Sin datos de sección</td></tr>`;
      return;
    }

    const materias = DB.getMateriasBySeccion(seccion.id);
    const notas = DB.getNotasByEstudiante(user.id);

    const sub = document.getElementById('subtituloDetalleEstudiante');
    if (sub) sub.textContent = `Sección ${user.seccion || '1°A'} · Estudiante: ${user.nombre}`;

    tbody.innerHTML = materias.map(materia => {
      const nota = notas.find(n => n.materia_id === materia.id);
      const promedio = nota ? DB.calcularPromedio(nota) : '-';
      const promNum = parseFloat(promedio);
      const aprobado = !isNaN(promNum) && promNum >= 6;
      const docente = DB.getUsuarioById(materia.docente_id);
      const icon = this.getMateriaIconInfo(materia.nombre);

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="est-materia-icon ${icon.colorClass}" style="width: 32px; height: 32px; flex-shrink: 0;">
                ${icon.symbol}
              </div>
              <strong style="color: var(--text-primary); font-size: 0.92rem;">${materia.nombre}</strong>
            </div>
          </td>
          <td style="color: var(--text-muted); font-size: 0.88rem;">${docente ? docente.nombre : 'Sin asignar'}</td>
          <td class="tnum" style="text-align: center; font-weight: 600;">${nota ? nota.nota1 : '—'}</td>
          <td class="tnum" style="text-align: center; font-weight: 600;">${nota ? nota.nota2 : '—'}</td>
          <td class="tnum" style="text-align: center; font-weight: 600;">${nota ? nota.nota3 : '—'}</td>
          <td style="text-align: center;">
            <span class="est-promedio-pill ${aprobado ? 'aprobado' : (isNaN(promNum) ? 'sin-nota' : 'reprobado')}" style="display: inline-flex;">
              <span class="tnum">${promedio}</span>
            </span>
          </td>
          <td style="text-align: center;">
            ${nota ? `
              <span style="display: inline-block; font-size: 0.78rem; font-weight: 600; padding: 0.25rem 0.65rem; border-radius: 20px; color: ${aprobado ? '#34d399' : '#f87171'}; background: ${aprobado ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)'}; border: 1px solid ${aprobado ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'};">
                ${aprobado ? 'Aprobada' : 'Reprobada'}
              </span>
            ` : `<span style="color: var(--text-muted); font-size: 0.8rem;">Sin notas</span>`}
          </td>
        </tr>
      `;
    }).join('');
  },

  cargarHorarioCompleto() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const container = document.getElementById('horarioEstudianteCompleto');
    if (!container) return;

    const seccion = DB.getSecciones().find(s => s.nombre === user.seccion);
    if (!seccion) {
      container.innerHTML = `<p style="padding: 2rem; color: var(--text-muted);">Sin datos de sección asignada.</p>`;
      return;
    }

    const horarios = DB.getHorariosBySeccion(seccion.id);
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const hoyLong = new Date().toLocaleDateString('es-SV', { weekday: 'long' });
    const hoyCapital = hoyLong.charAt(0).toUpperCase() + hoyLong.slice(1);
    const colores = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

    container.innerHTML = `
      <div class="docente-horario-grid">
        ${dias.map((dia, idx) => {
          const clases = horarios.filter(h => h.dia === dia).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
          const esHoy = dia === hoyCapital;
          const barColor = colores[idx % colores.length];

          return `
            <div class="docente-dia-col ${esHoy ? 'hoy' : ''}">
              <div class="docente-dia-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>${dia}</span>
                ${esHoy ? '<span class="docente-hoy-badge">Hoy</span>' : ''}
              </div>
              <div class="docente-dia-body">
                ${clases.length > 0 ? clases.map(h => {
                  const materia = DB.getMateriaById(h.materia_id);
                  const docente = materia ? DB.getUsuarioById(materia.docente_id) : null;
                  return `
                    <div class="docente-clase-card" style="--clase-accent: ${barColor}; --clase-time: ${barColor};">
                      <div class="docente-clase-time">${h.hora_inicio} - ${h.hora_fin}</div>
                      <div class="docente-clase-materia">${materia ? materia.nombre : 'Clase'}</div>
                      <div class="docente-clase-seccion">${docente ? docente.nombre : ''}</div>
                    </div>
                  `;
                }).join('') : `
                  <div class="docente-dia-vacio">
                    <div class="docente-vacio-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div class="docente-vacio-title">Sin clases</div>
                  </div>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  imprimirNotas() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const notas = DB.getNotas().filter(n => n.estudiante_id === user.id);
    const columnas = ['MATERIA', 'NOTA 1', 'NOTA 2', 'NOTA 3', 'PROMEDIO', 'ESTADO'];
    const datos = notas.map(n => {
      const materia = DB.getMateriaById(n.materia_id);
      const prom = DB.calcularPromedio(n);
      const estado = prom !== '-' ? (parseFloat(prom) >= 6.0 ? 'Aprobado' : 'Reprobado') : '-';
      return [materia ? materia.nombre : 'Materia', n.nota1, n.nota2, n.nota3, prom, estado];
    });

    imprimirTabla(
      'Mis Notas - Reporte Académico Oficial',
      'Estudiante: ' + user.nombre + ' | Sección: ' + (user.seccion || '-'),
      columnas,
      datos
    );
  }
};