/**
 * INSAVI - Panel de Administrador
 * CRUD de usuarios, secciones, materias y horarios
 */

const Admin = {
  // ==========================================
  // INICIALIZACIÓN
  // ==========================================

  init() {
    this.currentPageUsuarios = 1;
    this.currentPageSecciones = 1;
    this.currentPageMaterias = 1;
    this.currentPageHorarios = 1;
    this.pageSize = 7;
    this.cargarEstadisticas();
    this.cargarUsuarios();
    this.cargarSecciones();
    this.cargarMaterias();
    this.cargarHorarios();
    this.populateFilterDropdowns();
  },

  // ==========================================
  // POBLAR DROPDOWN DE FILTROS
  // ==========================================

  populateFilterDropdowns() {
    // Secciones dropdown for Materias filter
    const filterSeccionMat = document.getElementById('filterSeccionMat');
    if (filterSeccionMat) {
      const secciones = DB.getSecciones();
      filterSeccionMat.innerHTML = '<option value="todas">Todas las secciones</option>' +
        secciones.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('');
    }

    // Docentes dropdown for Materias filter
    const filterDocenteMat = document.getElementById('filterDocenteMat');
    if (filterDocenteMat) {
      const docentes = DB.getUsuariosByRol('docente');
      filterDocenteMat.innerHTML = '<option value="todos">Todos los docentes</option>' +
        '<option value="sin_asignar">Sin asignar</option>' +
        docentes.map(d => `<option value="${d.id}">${d.nombre}</option>`).join('');
    }

    // Secciones dropdown for Horarios filter
    const filterSeccionHor = document.getElementById('filterSeccionHor');
    if (filterSeccionHor) {
      const secciones = DB.getSecciones();
      filterSeccionHor.innerHTML = '<option value="todas">Todas las secciones</option>' +
        secciones.map(s => `<option value="${s.nombre}">${s.nombre}</option>`).join('');
    }
  },

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  cargarEstadisticas() {
    const el = (id) => document.getElementById(id);
    const usuarios = DB.getUsuarios();
    
    el('statUsuarios').textContent = usuarios.length;
    
    const docentes = usuarios.filter(u => u.rol === 'docente').length;
    if (el('statDocentesKpi')) el('statDocentesKpi').textContent = docentes;
    
    const estudiantes = usuarios.filter(u => u.rol === 'estudiante').length;
    if (el('statEstudiantesKpi')) el('statEstudiantesKpi').textContent = estudiantes;
    
    const padres = usuarios.filter(u => u.rol === 'padre').length;
    if (el('statPadresKpi')) el('statPadresKpi').textContent = padres;
  },

  // ==========================================
  // USUARIOS
  // ==========================================

  filtrarUsuarios() {
    const term = (document.getElementById('searchUsuarios')?.value || '').toLowerCase();
    const rolFiltro = document.getElementById('filterRol')?.value || 'todos';
    const estadoFiltro = document.getElementById('filterEstado')?.value || 'todos';

    let usuarios = DB.getUsuarios();

    if (term) {
      usuarios = usuarios.filter(u => 
        u.nombre.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.rol.toLowerCase().includes(term)
      );
    }

    if (rolFiltro !== 'todos') {
      usuarios = usuarios.filter(u => u.rol === rolFiltro);
    }

    if (estadoFiltro !== 'todos') {
      const isActive = estadoFiltro === 'activo';
      usuarios = usuarios.filter(u => !!u.activo === isActive);
    }

    this.currentPageUsuarios = 1;
    this._usuariosFiltrados = usuarios;
    this.cargarUsuarios();
  },

  cargarUsuarios(listaUsuarios = null) {
    if (listaUsuarios) this._usuariosFiltrados = listaUsuarios;
    const todos = this._usuariosFiltrados || DB.getUsuarios();
    const total = todos.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));

    if (this.currentPageUsuarios > totalPages) this.currentPageUsuarios = totalPages;

    const start = (this.currentPageUsuarios - 1) * this.pageSize;
    const paginados = todos.slice(start, start + this.pageSize);

    const tbody = document.querySelector('#tablaUsuarios tbody');
    const paginationEl = document.getElementById('paginationUsuarios');

    if (!tbody) return;

    if (total === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron usuarios que coincidan con la búsqueda.</td></tr>`;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    tbody.innerHTML = paginados.map(u => {
      let roleSub = '';
      if (u.rol === 'admin') roleSub = 'Administrador del sistema';
      else if (u.rol === 'docente') roleSub = 'Profesor';
      else if (u.rol === 'estudiante') roleSub = 'Estudiante';
      else if (u.rol === 'padre') roleSub = 'Padre de familia';
      else if (u.rol === 'servicios') roleSub = 'Servicios Varios';

      return `
      <tr>
        <td>
          <div class="user-table-cell">
            <div class="user-table-avatar ${u.rol}">${Auth.getUserInitials(u.nombre)}</div>
            <div class="user-table-info">
              <strong>${u.nombre}</strong>
              <span>${roleSub}</span>
            </div>
          </div>
        </td>
        <td class="muted" style="font-size: 0.85rem;">${u.email}</td>
        <td><span class="role-badge ${u.rol}">${this.getRolLabel(u.rol)}</span></td>
        <td class="muted" style="font-size: 0.85rem;">${u.rol === 'estudiante' ? (u.seccion || '-') : (u.rol === 'padre' ? ((u.hijos && u.hijos.length) + ' hijos' || '0 hijos') : '-')}</td>
        <td>
          <span class="status-dot ${u.activo ? 'activo' : ''}">
            ${u.activo ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td>
          <div style="display: flex; flex-direction: row; gap: 0.35rem; flex-wrap: nowrap; white-space: nowrap;">
            <button class="btn btn-ghost btn-sm btn-icon" aria-label="Ver detalles de ${u.nombre}" onclick="Admin.verDetallesUsuario('${u.id}')" style="width: 34px; height: 34px; color: var(--accent);">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn btn-ghost btn-sm btn-icon" aria-label="Editar ${u.nombre}" onclick="Admin.editarUsuario('${u.id}')" style="width: 34px; height: 34px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            <button class="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar ${u.nombre}" onclick="Admin.eliminarUsuario('${u.id}')" style="width: 34px; height: 34px; color: var(--error-700);">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
      `;
    }).join('');

    // Stagger animation para filas
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      row.classList.add('list-item-enter');
      row.style.animationDelay = `${i * 0.03}s`;
    });

    if (paginationEl) {
      if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
      }

      let html = '';
      html += `<button class="pagination-btn" onclick="Admin.goToPageUsuarios(${this.currentPageUsuarios - 1})" ${this.currentPageUsuarios === 1 ? 'disabled' : ''}>&lt;</button>`;

      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn ${i === this.currentPageUsuarios ? 'active' : ''}" onclick="Admin.goToPageUsuarios(${i})">${i}</button>`;
      }

      html += `<button class="pagination-btn" onclick="Admin.goToPageUsuarios(${this.currentPageUsuarios + 1})" ${this.currentPageUsuarios === totalPages ? 'disabled' : ''}>&gt;</button>`;

      paginationEl.innerHTML = html;
    }
  },

  goToPageUsuarios(page) {
    const todos = this._usuariosFiltrados || DB.getUsuarios();
    const totalPages = Math.max(1, Math.ceil(todos.length / this.pageSize));
    if (page < 1 || page > totalPages) return;
    this.currentPageUsuarios = page;
    this.cargarUsuarios();
  },

  getRolLabel(rol) {
    const labels = {
      admin: 'Administración',
      docente: 'Docente',
      estudiante: 'Estudiante',
      padre: 'Familia'
    };
    return labels[rol] || rol;
  },

  editarUsuario(id) {
    const usuario = DB.getUsuarioById(id);
    if (!usuario) return;

    const secciones = DB.getSecciones();
    const estudiantes = DB.getUsuariosByRol('estudiante');

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
      <form onsubmit="Admin.guardarUsuario(event, '${id}')">
        <div class="stack">
          <div class="field">
            <label for="editNombre">Nombre completo</label>
            <input type="text" class="input" id="editNombre" value="${usuario.nombre}" required>
          </div>
          <div class="field">
            <label for="editEmail">Correo electrónico</label>
            <input type="email" class="input" id="editEmail" value="${usuario.email}" required>
          </div>
          <div class="field">
            <label for="editPassword">Contraseña (dejar vacío para no cambiar)</label>
            <input type="password" class="input" id="editPassword" placeholder="••••••••">
          </div>
          <div class="field">
            <label for="editRol">Rol</label>
            <select class="input" id="editRol" onchange="toggleEditUserFields()">
              <option value="admin" ${usuario.rol === 'admin' ? 'selected' : ''}>Administración</option>
              <option value="docente" ${usuario.rol === 'docente' ? 'selected' : ''}>Docente</option>
              <option value="estudiante" ${usuario.rol === 'estudiante' ? 'selected' : ''}>Estudiante</option>
              <option value="padre" ${usuario.rol === 'padre' ? 'selected' : ''}>Padre de familia</option>
            </select>
          </div>
          <div class="field" id="grupoSeccion" style="display: ${usuario.rol === 'estudiante' ? 'flex' : 'none'};">
            <label for="editSeccion">Sección</label>
            <select class="input" id="editSeccion">
              ${secciones.map(s => `<option value="${s.nombre}" ${usuario.seccion === s.nombre ? 'selected' : ''}>${s.nombre}</option>`).join('')}
            </select>
          </div>
          <div class="field" id="grupoHijos" style="display: ${usuario.rol === 'padre' ? 'flex' : 'none'};">
            <label for="editHijos">Hijos (mantén Ctrl para seleccionar varios)</label>
            <select class="input" id="editHijos" multiple size="4">
              ${estudiantes.map(e => `<option value="${e.id}" ${usuario.hijos && usuario.hijos.includes(e.id) ? 'selected' : ''}>${e.nombre}</option>`).join('')}
            </select>
          </div>
          <label class="row" style="gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
            <input type="checkbox" id="editActivo" ${usuario.activo ? 'checked' : ''} style="width: 18px; height: 18px;">
            Cuenta activa
          </label>
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar cambios</button>
          </div>
        </div>
      </form>
    `;

    document.getElementById('modalTitle').textContent = `Editar: ${usuario.nombre}`;
    document.getElementById('modalOverlay').classList.add('active');
  },

  guardarUsuario(e, id) {
    e.preventDefault();

    const datos = {
      nombre: document.getElementById('editNombre').value.trim(),
      email: document.getElementById('editEmail').value.trim(),
      rol: document.getElementById('editRol').value,
      activo: document.getElementById('editActivo').checked
    };

    const password = document.getElementById('editPassword').value;
    if (password) {
      datos.password = password;
    }

    if (datos.rol === 'estudiante') {
      datos.seccion = document.getElementById('editSeccion').value;
    }

    if (datos.rol === 'padre') {
      const hijosSelect = document.getElementById('editHijos');
      datos.hijos = Array.from(hijosSelect.selectedOptions).map(o => o.value);
    }

    DB.actualizarUsuario(id, datos);
    this._usuariosFiltrados = null;
    this.cargarUsuarios();
    this.cargarEstadisticas();
    closeModal();
    showToast('Usuario actualizado correctamente', 'success');
  },

  eliminarUsuario(id) {
    const usuario = DB.getUsuarioById(id);
    const nombre = usuario ? usuario.nombre : 'este usuario';
    if (confirm(`¿Seguro que deseas eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      DB.eliminarUsuario(id);
      this._usuariosFiltrados = null;
      this.cargarUsuarios();
      this.cargarEstadisticas();
      showToast('Usuario eliminado', 'success');
    }
  },

  // ==========================================
  // SECCIONES
  // ==========================================

  filtrarSecciones() {
    const term = (document.getElementById('searchSecciones')?.value || '').toLowerCase();
    const gradoFiltro = document.getElementById('filterGrado')?.value || 'todos';
    let secciones = DB.getSecciones();

    if (term) {
      secciones = secciones.filter(s =>
        s.nombre.toLowerCase().includes(term)
      );
    }

    if (gradoFiltro !== 'todos') {
      secciones = secciones.filter(s => s.grado === parseInt(gradoFiltro, 10));
    }

    this.currentPageSecciones = 1;
    this._seccionesFiltradas = secciones;
    this.cargarSecciones();
  },

  cargarSecciones(listaSecciones = null) {
    if (listaSecciones) this._seccionesFiltradas = listaSecciones;
    const todos = this._seccionesFiltradas || DB.getSecciones();
    const total = todos.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));

    if (this.currentPageSecciones > totalPages) this.currentPageSecciones = totalPages;

    const start = (this.currentPageSecciones - 1) * this.pageSize;
    const paginados = todos.slice(start, start + this.pageSize);

    const estudiantes = DB.getUsuariosByRol('estudiante');
    const tbody = document.querySelector('#tablaSecciones tbody');
    const paginationEl = document.getElementById('paginationSecciones');
    if (!tbody) return;

    if (total === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron secciones que coincidan con la búsqueda.</td></tr>`;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    tbody.innerHTML = paginados.map(s => {
      const cantidadAlumnos = estudiantes.filter(u => u.seccion === s.nombre).length;
      return `
        <tr>
          <td><strong>${s.nombre}</strong></td>
          <td>${s.grado}° grado</td>
          <td class="muted">${cantidadAlumnos} alumnos</td>
          <td>
            <div style="display: flex; flex-direction: row; gap: 0.35rem; flex-wrap: nowrap; white-space: nowrap;">
              <button class="btn btn-ghost btn-sm btn-icon" aria-label="Ver detalles de ${s.nombre}" onclick="Admin.verDetallesSeccion('${s.id}')" style="width: 34px; height: 34px; color: var(--accent);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" aria-label="Editar ${s.nombre}" onclick="Admin.editarSeccion('${s.id}')" style="width: 34px; height: 34px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar ${s.nombre}" onclick="Admin.eliminarSeccion('${s.id}')" style="width: 34px; height: 34px; color: var(--error-700);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Stagger animation para filas
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      row.classList.add('list-item-enter');
      row.style.animationDelay = `${i * 0.03}s`;
    });

    // Paginación
    if (paginationEl) {
      if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
      }
      let html = `<button class="pagination-btn" onclick="Admin.goToPageSecciones(${this.currentPageSecciones - 1})" ${this.currentPageSecciones === 1 ? 'disabled' : ''}>&lt;</button>`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn ${i === this.currentPageSecciones ? 'active' : ''}" onclick="Admin.goToPageSecciones(${i})">${i}</button>`;
      }
      html += `<button class="pagination-btn" onclick="Admin.goToPageSecciones(${this.currentPageSecciones + 1})" ${this.currentPageSecciones === totalPages ? 'disabled' : ''}>&gt;</button>`;
      paginationEl.innerHTML = html;
    }
  },

  goToPageSecciones(page) {
    const todos = this._seccionesFiltradas || DB.getSecciones();
    const totalPages = Math.max(1, Math.ceil(todos.length / this.pageSize));
    if (page < 1 || page > totalPages) return;
    this.currentPageSecciones = page;
    this.cargarSecciones();
  },

  editarSeccion(id) {
    const seccion = DB.getSeccionById(id);
    if (!seccion) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
      <form onsubmit="Admin.guardarSeccion(event, '${id}')">
        <div class="stack">
          <div class="field">
            <label for="editNombreSec">Nombre de la sección</label>
            <input type="text" class="input" id="editNombreSec" value="${seccion.nombre}" required placeholder="Ej: 1°A">
          </div>
          <div class="field">
            <label for="editGrado">Grado</label>
            <select class="input" id="editGrado">
              <option value="1" ${seccion.grado === 1 ? 'selected' : ''}>1° grado</option>
              <option value="2" ${seccion.grado === 2 ? 'selected' : ''}>2° grado</option>
              <option value="3" ${seccion.grado === 3 ? 'selected' : ''}>3° grado</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar cambios</button>
          </div>
        </div>
      </form>
    `;

    document.getElementById('modalTitle').textContent = `Editar sección ${seccion.nombre}`;
    document.getElementById('modalOverlay').classList.add('active');
  },

  guardarSeccion(e, id) {
    e.preventDefault();
    const datos = {
      nombre: document.getElementById('editNombreSec').value.trim(),
      grado: parseInt(document.getElementById('editGrado').value, 10)
    };
    DB.actualizarSeccion(id, datos);
    this.cargarSecciones();
    this.cargarEstadisticas();
    closeModal();
    showToast('Sección actualizada', 'success');
  },

  eliminarSeccion(id) {
    if (confirm('¿Seguro que deseas eliminar esta sección?')) {
      DB.eliminarSeccion(id);
      this.cargarSecciones();
      this.cargarEstadisticas();
      showToast('Sección eliminada', 'success');
    }
  },

  // ==========================================
  // MATERIAS
  // ==========================================

  filtrarMaterias() {
    const term = (document.getElementById('searchMaterias')?.value || '').toLowerCase();
    const seccionFiltro = document.getElementById('filterSeccionMat')?.value || 'todas';
    const docenteFiltro = document.getElementById('filterDocenteMat')?.value || 'todos';
    let materias = DB.getMaterias();

    if (term) {
      materias = materias.filter(m => m.nombre.toLowerCase().includes(term));
    }

    if (seccionFiltro !== 'todas') {
      materias = materias.filter(m => m.seccion_id === seccionFiltro);
    }

    if (docenteFiltro === 'sin_asignar') {
      materias = materias.filter(m => !m.docente_id);
    } else if (docenteFiltro !== 'todos') {
      materias = materias.filter(m => m.docente_id === docenteFiltro);
    }

    this.currentPageMaterias = 1;
    this._materiasFiltradas = materias;
    this.cargarMaterias();
  },

  cargarMaterias(listaMaterias = null) {
    if (listaMaterias) this._materiasFiltradas = listaMaterias;
    const todos = this._materiasFiltradas || DB.getMaterias();
    const total = todos.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));

    if (this.currentPageMaterias > totalPages) this.currentPageMaterias = totalPages;

    const start = (this.currentPageMaterias - 1) * this.pageSize;
    const paginados = todos.slice(start, start + this.pageSize);

    const tbody = document.querySelector('#tablaMaterias tbody');
    const paginationEl = document.getElementById('paginationMaterias');
    if (!tbody) return;

    if (total === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron materias que coincidan con la búsqueda.</td></tr>`;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    tbody.innerHTML = paginados.map(m => {
      const seccion = DB.getSeccionById(m.seccion_id);
      const docente = DB.getUsuarioById(m.docente_id);
      return `
        <tr>
          <td><strong>${m.nombre}</strong></td>
          <td>${seccion ? seccion.nombre : '-'}</td>
          <td>${docente ? docente.nombre : '<span class="muted">Sin asignar</span>'}</td>
          <td>
            <div style="display: flex; flex-direction: row; gap: 0.35rem; flex-wrap: nowrap; white-space: nowrap;">
              <button class="btn btn-ghost btn-sm btn-icon" aria-label="Ver detalles de ${m.nombre}" onclick="Admin.verDetallesMateria('${m.id}')" style="width: 34px; height: 34px; color: var(--accent);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" aria-label="Editar ${m.nombre}" onclick="Admin.editarMateria('${m.id}')" style="width: 34px; height: 34px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar ${m.nombre}" onclick="Admin.eliminarMateria('${m.id}')" style="width: 34px; height: 34px; color: var(--error-700);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Stagger animation para filas
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      row.classList.add('list-item-enter');
      row.style.animationDelay = `${i * 0.03}s`;
    });

    // Paginación
    if (paginationEl) {
      if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
      }
      let html = `<button class="pagination-btn" onclick="Admin.goToPageMaterias(${this.currentPageMaterias - 1})" ${this.currentPageMaterias === 1 ? 'disabled' : ''}>&lt;</button>`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn ${i === this.currentPageMaterias ? 'active' : ''}" onclick="Admin.goToPageMaterias(${i})">${i}</button>`;
      }
      html += `<button class="pagination-btn" onclick="Admin.goToPageMaterias(${this.currentPageMaterias + 1})" ${this.currentPageMaterias === totalPages ? 'disabled' : ''}>&gt;</button>`;
      paginationEl.innerHTML = html;
    }
  },

  goToPageMaterias(page) {
    const todos = this._materiasFiltradas || DB.getMaterias();
    const totalPages = Math.max(1, Math.ceil(todos.length / this.pageSize));
    if (page < 1 || page > totalPages) return;
    this.currentPageMaterias = page;
    this.cargarMaterias();
  },

  editarMateria(id) {
    const materia = DB.getMateriaById(id);
    if (!materia) return;

    const secciones = DB.getSecciones();
    const docentes = DB.getUsuariosByRol('docente');

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
      <form onsubmit="Admin.guardarMateria(event, '${id}')">
        <div class="stack">
          <div class="field">
            <label for="editNombreMat">Nombre de la materia</label>
            <input type="text" class="input" id="editNombreMat" value="${materia.nombre}" required>
          </div>
          <div class="field">
            <label for="editSeccionMat">Sección</label>
            <select class="input" id="editSeccionMat">
              ${secciones.map(s => `<option value="${s.id}" ${materia.seccion_id === s.id ? 'selected' : ''}>${s.nombre}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="editDocenteMat">Docente</label>
            <select class="input" id="editDocenteMat">
              <option value="">Sin asignar</option>
              ${docentes.map(d => `<option value="${d.id}" ${materia.docente_id === d.id ? 'selected' : ''}>${d.nombre}</option>`).join('')}
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar cambios</button>
          </div>
        </div>
      </form>
    `;

    document.getElementById('modalTitle').textContent = `Editar materia`;
    document.getElementById('modalOverlay').classList.add('active');
  },

  guardarMateria(e, id) {
    e.preventDefault();
    const datos = {
      nombre: document.getElementById('editNombreMat').value.trim(),
      seccion_id: document.getElementById('editSeccionMat').value,
      docente_id: document.getElementById('editDocenteMat').value || null
    };
    DB.actualizarMateria(id, datos);
    this.cargarMaterias();
    this.cargarEstadisticas();
    closeModal();
    showToast('Materia actualizada', 'success');
  },

  eliminarMateria(id) {
    if (confirm('¿Seguro que deseas eliminar esta materia?')) {
      DB.eliminarMateria(id);
      this.cargarMaterias();
      this.cargarEstadisticas();
      showToast('Materia eliminada', 'success');
    }
  },

  // ==========================================
  // HORARIOS
  // ==========================================

  filtrarHorarios() {
    const term = (document.getElementById('searchHorarios')?.value || '').toLowerCase();
    const diaFiltro = document.getElementById('filterDiaHor')?.value || 'todos';
    const seccionFiltro = document.getElementById('filterSeccionHor')?.value || 'todas';
    let horarios = DB.getHorarios();

    if (term) {
      horarios = horarios.filter(h => {
        const materia = DB.getMateriaById(h.materia_id);
        return (materia && materia.nombre.toLowerCase().includes(term));
      });
    }

    if (diaFiltro !== 'todos') {
      horarios = horarios.filter(h => h.dia === diaFiltro);
    }

    if (seccionFiltro !== 'todas') {
      horarios = horarios.filter(h => {
        const materia = DB.getMateriaById(h.materia_id);
        if (!materia) return false;
        const seccion = DB.getSeccionById(materia.seccion_id);
        return seccion && seccion.nombre === seccionFiltro;
      });
    }

    this.currentPageHorarios = 1;
    this._horariosFiltrados = horarios;
    this.cargarHorarios();
  },

  cargarHorarios(listaHorarios = null) {
    if (listaHorarios) this._horariosFiltrados = listaHorarios;
    const todos = this._horariosFiltrados || DB.getHorarios();
    const total = todos.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));

    if (this.currentPageHorarios > totalPages) this.currentPageHorarios = totalPages;

    const start = (this.currentPageHorarios - 1) * this.pageSize;
    const paginados = todos.slice(start, start + this.pageSize);

    const tbody = document.querySelector('#tablaHorarios tbody');
    const paginationEl = document.getElementById('paginationHorarios');
    if (!tbody) return;

    if (total === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron horarios que coincidan con la búsqueda.</td></tr>`;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    tbody.innerHTML = paginados.map(h => {
      const materia = DB.getMateriaById(h.materia_id);
      const seccion = materia ? DB.getSeccionById(materia.seccion_id) : null;
      return `
        <tr class="draggable" draggable="true" data-id="${h.id}">
          <td>
            <div class="drag-handle" title="Arrastrar para reordenar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
            </div>
          </td>
          <td><strong>${h.dia}</strong></td>
          <td>${materia ? materia.nombre : '-'}</td>
          <td class="muted">${seccion ? seccion.nombre : '-'}</td>
          <td class="tnum">${h.hora_inicio}</td>
          <td class="tnum">${h.hora_fin}</td>
          <td>
            <div style="display: flex; flex-direction: row; gap: 0.35rem; flex-wrap: nowrap; white-space: nowrap;">
              <button class="btn btn-ghost btn-sm btn-icon" aria-label="Ver detalles" onclick="Admin.verDetallesHorario('${h.id}')" style="width: 34px; height: 34px; color: var(--accent);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" aria-label="Editar horario" onclick="Admin.editarHorario('${h.id}')" style="width: 34px; height: 34px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar horario" onclick="Admin.eliminarHorario('${h.id}')" style="width: 34px; height: 34px; color: var(--error-700);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Stagger animation para filas
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      row.classList.add('list-item-enter');
      row.style.animationDelay = `${i * 0.03}s`;
    });

    // Drag & Drop para horarios
    this.initDragAndDrop(todos);

    // Paginación
    if (paginationEl) {
      if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
      }
      let html = `<button class="pagination-btn" onclick="Admin.goToPageHorarios(${this.currentPageHorarios - 1})" ${this.currentPageHorarios === 1 ? 'disabled' : ''}>&lt;</button>`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn ${i === this.currentPageHorarios ? 'active' : ''}" onclick="Admin.goToPageHorarios(${i})">${i}</button>`;
      }
      html += `<button class="pagination-btn" onclick="Admin.goToPageHorarios(${this.currentPageHorarios + 1})" ${this.currentPageHorarios === totalPages ? 'disabled' : ''}>&gt;</button>`;
      paginationEl.innerHTML = html;
    }
  },

  goToPageHorarios(page) {
    const todos = this._horariosFiltrados || DB.getHorarios();
    const totalPages = Math.max(1, Math.ceil(todos.length / this.pageSize));
    if (page < 1 || page > totalPages) return;
    this.currentPageHorarios = page;
    this.cargarHorarios();
  },

  // ==========================================
  // DRAG & DROP PARA HORARIOS
  // ==========================================

  initDragAndDrop(horarios) {
    const tbody = document.querySelector('#tablaHorarios tbody');
    if (!tbody) return;

    const draggables = tbody.querySelectorAll('.draggable');
    let draggedId = null;

    draggables.forEach(row => {
      row.addEventListener('dragstart', (e) => {
        draggedId = row.dataset.id;
        row.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', row.dataset.id);
      });

      row.addEventListener('dragend', () => {
        row.classList.remove('dragging');
        draggables.forEach(r => r.classList.remove('drag-over'));
        draggedId = null;
      });

      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (row.dataset.id !== draggedId) {
          row.classList.add('drag-over');
        }
      });

      row.addEventListener('dragleave', () => {
        row.classList.remove('drag-over');
      });

      row.addEventListener('drop', (e) => {
        e.preventDefault();
        row.classList.remove('drag-over');
        
        const fromId = e.dataTransfer.getData('text/plain');
        const toId = row.dataset.id;
        
        if (fromId === toId) return;

        // Reordenar en la base de datos
        const allHorarios = DB.getHorarios();
        const fromIndex = allHorarios.findIndex(h => h.id === fromId);
        const toIndex = allHorarios.findIndex(h => h.id === toId);

        if (fromIndex === -1 || toIndex === -1) return;

        // Intercambiar posiciones
        const temp = allHorarios[fromIndex];
        allHorarios[fromIndex] = allHorarios[toIndex];
        allHorarios[toIndex] = temp;

        // Guardar en localStorage
        localStorage.setItem('INSAVI_HORARIOS', JSON.stringify(allHorarios));

        // Recargar vista
        this.currentPageHorarios = 1;
        this._horariosFiltrados = null;
        this.cargarHorarios();
        showToast('Horario reordenado', 'success');
      });
    });
  },

  editarHorario(id) {
    const horario = DB.getHorarioById(id);
    if (!horario) return;

    const materias = DB.getMaterias();
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
      <form onsubmit="Admin.guardarHorario(event, '${id}')">
        <div class="stack">
          <div class="field">
            <label for="editDia">Día</label>
            <select class="input" id="editDia">
              ${dias.map(d => `<option value="${d}" ${horario.dia === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="editMateriaHor">Materia</label>
            <select class="input" id="editMateriaHor">
              ${materias.map(m => `<option value="${m.id}" ${horario.materia_id === m.id ? 'selected' : ''}>${m.nombre}</option>`).join('')}
            </select>
          </div>
          <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="field">
              <label for="editHoraInicio">Hora inicio</label>
              <input type="time" class="input" id="editHoraInicio" value="${horario.hora_inicio}" required>
            </div>
            <div class="field">
              <label for="editHoraFin">Hora fin</label>
              <input type="time" class="input" id="editHoraFin" value="${horario.hora_fin}" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar cambios</button>
          </div>
        </div>
      </form>
    `;

    document.getElementById('modalTitle').textContent = 'Editar horario';
    document.getElementById('modalOverlay').classList.add('active');
  },

  guardarHorario(e, id) {
    e.preventDefault();
    const datos = {
      dia: document.getElementById('editDia').value,
      materia_id: document.getElementById('editMateriaHor').value,
      hora_inicio: document.getElementById('editHoraInicio').value,
      hora_fin: document.getElementById('editHoraFin').value
    };
    DB.actualizarHorario(id, datos);
    this.cargarHorarios();
    closeModal();
    showToast('Horario actualizado', 'success');
  },

  eliminarHorario(id) {
    if (confirm('¿Seguro que deseas eliminar este horario?')) {
      DB.eliminarHorario(id);
      this.cargarHorarios();
      showToast('Horario eliminado', 'success');
    }
  },

  // ==========================================
  // VISTAS DE DETALLES
  // ==========================================

  verDetallesUsuario(id) {
    const u = DB.getUsuarioById(id);
    if(!u) return;

    let extraInfo = '';
    
    if (u.rol === 'estudiante') {
      const notas = DB.getNotas().filter(n => n.estudiante_id === id);
      extraInfo = `
        <div class="mt-2">
          <strong>Sección asignada:</strong> ${u.seccion || 'Ninguna'}<br><br>
          <strong>Rendimiento Académico:</strong>
          <ul style="margin-top: 0.5rem; padding-left: 1.25rem;">
            ${notas.length === 0 ? '<li>Sin notas registradas</li>' : notas.map(n => {
              const materia = DB.getMateriaById(n.materia_id);
              const prom = DB.calcularPromedio(n);
              return `<li>${materia ? materia.nombre : 'Materia borrada'}: Promedio <strong>${prom}</strong></li>`;
            }).join('')}
          </ul>
        </div>
      `;
    } else if (u.rol === 'docente') {
      const materias = DB.getMateriasByDocente(id);
      extraInfo = `
        <div class="mt-2">
          <strong>Materias impartidas (${materias.length}):</strong>
          <ul style="margin-top: 0.5rem; padding-left: 1.25rem;">
            ${materias.length === 0 ? '<li>No imparte materias</li>' : materias.map(m => {
              const s = DB.getSeccionById(m.seccion_id);
              return `<li>${m.nombre} (Sección: ${s ? s.nombre : '-'})</li>`;
            }).join('')}
          </ul>
        </div>
      `;
    } else if (u.rol === 'padre') {
      const hijos = u.hijos || [];
      extraInfo = `
        <div class="mt-2">
          <strong>Hijos a cargo (${hijos.length}):</strong>
          <ul style="margin-top: 0.5rem; padding-left: 1.25rem;">
            ${hijos.length === 0 ? '<li>Sin hijos asignados</li>' : hijos.map(hId => {
              const hijo = DB.getUsuarioById(hId);
              return `<li>${hijo ? hijo.nombre : 'Usuario borrado'} (Sección: ${hijo ? hijo.seccion : '-'})</li>`;
            }).join('')}
          </ul>
        </div>
      `;
    }

    const html = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <div style="background: var(--bg-canvas); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
          <h4 style="margin-bottom: 0.25rem; color: var(--accent);">${u.nombre}</h4>
          <p class="muted" style="margin-bottom: 0.75rem;">${u.email}</p>
          <span class="role-badge ${u.rol}">${this.getRolLabel(u.rol)}</span>
          <span class="status-dot ${u.activo ? 'activo' : ''}" style="margin-left: 1rem;">${u.activo ? 'Activo' : 'Inactivo'}</span>
        </div>
        ${extraInfo}
      </div>
      <div class="form-actions mt-3">
        <button type="button" class="btn btn-primary" onclick="closeModal()">Cerrar detalles</button>
      </div>
    `;

    document.getElementById('modalTitle').textContent = `Detalles del Usuario`;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('active');
  },

  verDetallesSeccion(id) {
    const s = DB.getSeccionById(id);
    if(!s) return;

    const estudiantes = DB.getUsuariosByRol('estudiante').filter(u => u.seccion === s.nombre);
    const materias = DB.getMaterias().filter(m => m.seccion_id === id);

    const html = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <div style="background: var(--bg-canvas); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
          <h4 style="margin-bottom: 0.25rem; color: var(--accent);">${s.nombre}</h4>
          <p class="muted">Grado: ${s.grado}°</p>
        </div>
        
        <strong>Materias asignadas (${materias.length}):</strong>
        <ul style="margin-top: 0.5rem; padding-left: 1.25rem; margin-bottom: 1.25rem;">
          ${materias.length === 0 ? '<li>Sin materias</li>' : materias.map(m => {
            const docente = DB.getUsuarioById(m.docente_id);
            return `<li>${m.nombre} (Docente: ${docente ? docente.nombre : 'Sin asignar'})</li>`;
          }).join('')}
        </ul>

        <strong>Estudiantes inscritos (${estudiantes.length}):</strong>
        <div style="max-height: 150px; overflow-y: auto; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.5rem; margin-top: 0.5rem;">
          <ul style="margin: 0; padding-left: 1rem;">
            ${estudiantes.length === 0 ? '<li>Sin estudiantes</li>' : estudiantes.map(e => `<li>${e.nombre}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="form-actions mt-3">
        <button type="button" class="btn btn-primary" onclick="closeModal()">Cerrar detalles</button>
      </div>
    `;

    document.getElementById('modalTitle').textContent = `Detalles de la Sección`;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('active');
  },

  verDetallesMateria(id) {
    const m = DB.getMateriaById(id);
    if(!m) return;

    const docente = DB.getUsuarioById(m.docente_id);
    const seccion = DB.getSeccionById(m.seccion_id);
    const horarios = DB.getHorarios().filter(h => h.materia_id === id);

    const html = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <div style="background: var(--bg-canvas); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
          <h4 style="margin-bottom: 0.25rem; color: var(--accent);">${m.nombre}</h4>
          <p class="muted">Sección: ${seccion ? seccion.nombre : 'Huérfana'}</p>
        </div>
        
        <p><strong>Docente a cargo:</strong> ${docente ? docente.nombre : '<span class="muted">Sin asignar</span>'}</p>
        
        <strong style="display:block; margin-top: 1rem;">Horarios de clase (${horarios.length}):</strong>
        <ul style="margin-top: 0.5rem; padding-left: 1.25rem;">
          ${horarios.length === 0 ? '<li>Sin horarios programados</li>' : horarios.map(h => `<li>${h.dia} de ${h.hora_inicio} a ${h.hora_fin}</li>`).join('')}
        </ul>
      </div>
      <div class="form-actions mt-3">
        <button type="button" class="btn btn-primary" onclick="closeModal()">Cerrar detalles</button>
      </div>
    `;

    document.getElementById('modalTitle').textContent = `Detalles de la Materia`;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('active');
  },

  verDetallesHorario(id) {
    const h = DB.getHorarioById(id);
    if(!h) return;

    const materia = DB.getMateriaById(h.materia_id);
    const seccion = materia ? DB.getSeccionById(materia.seccion_id) : null;
    const docente = materia ? DB.getUsuarioById(materia.docente_id) : null;

    const html = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <div style="background: var(--bg-canvas); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
          <h4 style="margin-bottom: 0.25rem; color: var(--accent);">${h.dia}</h4>
          <p class="muted" style="font-size: 1.2rem; font-weight: 600;">${h.hora_inicio} - ${h.hora_fin}</p>
        </div>
        
        <p><strong>Materia:</strong> ${materia ? materia.nombre : 'Borrada'}</p>
        <p><strong>Sección:</strong> ${seccion ? seccion.nombre : '-'}</p>
        <p><strong>Docente:</strong> ${docente ? docente.nombre : '-'}</p>
      </div>
      <div class="form-actions mt-3">
        <button type="button" class="btn btn-primary" onclick="closeModal()">Cerrar detalles</button>
      </div>
    `;

    document.getElementById('modalTitle').textContent = `Detalles del Horario`;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('active');
  }
};

// ==========================================
// FUNCIONES GLOBALES PARA CREAR NUEVOS
// ==========================================

function openModal(tipo) {
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');
  const secciones = DB.getSecciones();

  const ICON_PLUS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  const btnCrear = (label, fn) => `
    <div class="form-actions">
      <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button type="submit" class="btn btn-primary">${label}</button>
    </div>
  `;

  switch (tipo) {
    case 'usuario':
      modalTitle.textContent = 'Nuevo usuario';
      modalBody.innerHTML = `
        <form onsubmit="Admin.crearUsuario(event)">
          <div class="stack">
            <div class="field">
              <label for="newNombre">Nombre completo</label>
              <input type="text" class="input" id="newNombre" required placeholder="Nombre y apellido">
            </div>
            <div class="field">
              <label for="newEmail">Correo electrónico</label>
              <input type="email" class="input" id="newEmail" required placeholder="nombre@insavi.edu.sv">
            </div>
            <div class="field">
              <label for="newPassword">Contraseña</label>
              <input type="password" class="input" id="newPassword" required minlength="6" placeholder="Mínimo 6 caracteres">
            </div>
            <div class="field">
              <label for="newRol">Rol</label>
              <select class="input" id="newRol" onchange="toggleNewUserFields()">
                <option value="estudiante" selected>Estudiante</option>
                <option value="docente">Docente</option>
                <option value="admin">Administración</option>
                <option value="padre">Padre de familia</option>
              </select>
            </div>
            <div class="field" id="newGrupoSeccion">
              <label for="newSeccion">Sección</label>
              <select class="input" id="newSeccion">
                ${secciones.map(s => `<option value="${s.nombre}">${s.nombre}</option>`).join('')}
              </select>
            </div>
            ${btnCrear('Crear usuario')}
          </div>
        </form>
      `;
      break;

    case 'seccion':
      modalTitle.textContent = 'Nueva sección';
      modalBody.innerHTML = `
        <form onsubmit="Admin.crearSeccion(event)">
          <div class="stack">
            <div class="field">
              <label for="newNombreSec">Nombre de la sección</label>
              <input type="text" class="input" id="newNombreSec" required placeholder="Ej: 1°A">
            </div>
            <div class="field">
              <label for="newGrado">Grado</label>
              <select class="input" id="newGrado">
                <option value="1">1° grado</option>
                <option value="2">2° grado</option>
                <option value="3">3° grado</option>
              </select>
            </div>
            ${btnCrear('Crear sección')}
          </div>
        </form>
      `;
      break;

    case 'materia':
      modalTitle.textContent = 'Nueva materia';
      modalBody.innerHTML = `
        <form onsubmit="Admin.crearMateria(event)">
          <div class="stack">
            <div class="field">
              <label for="newNombreMat">Nombre de la materia</label>
              <input type="text" class="input" id="newNombreMat" required placeholder="Ej: Matemática">
            </div>
            <div class="field">
              <label for="newSeccionMat">Sección</label>
              <select class="input" id="newSeccionMat">
                ${secciones.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label for="newDocenteMat">Docente</label>
              <select class="input" id="newDocenteMat">
                <option value="">Sin asignar</option>
                ${DB.getUsuariosByRol('docente').map(d => `<option value="${d.id}">${d.nombre}</option>`).join('')}
              </select>
            </div>
            ${btnCrear('Crear materia')}
          </div>
        </form>
      `;
      break;

    case 'horario':
      modalTitle.textContent = 'Nuevo horario';
      const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
      modalBody.innerHTML = `
        <form onsubmit="Admin.crearHorario(event)">
          <div class="stack">
            <div class="field">
              <label for="newDia">Día</label>
              <select class="input" id="newDia">
                ${dias.map(d => `<option value="${d}">${d}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label for="newMateriaHor">Materia</label>
              <select class="input" id="newMateriaHor">
                ${DB.getMaterias().map(m => `<option value="${m.id}">${m.nombre}</option>`).join('')}
              </select>
            </div>
            <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="field">
                <label for="newHoraInicio">Hora inicio</label>
                <input type="time" class="input" id="newHoraInicio" required>
              </div>
              <div class="field">
                <label for="newHoraFin">Hora fin</label>
                <input type="time" class="input" id="newHoraFin" required>
              </div>
            </div>
            ${btnCrear('Crear horario')}
          </div>
        </form>
      `;
      break;
  }

  document.getElementById('modalOverlay').classList.add('active');
}

// ==========================================
// FUNCIONES DE CREACIÓN
// ==========================================

Admin.crearUsuario = function (e) {
  e.preventDefault();

  const nombre = document.getElementById('newNombre').value.trim();
  const email = document.getElementById('newEmail').value.trim();
  const password = document.getElementById('newPassword').value;
  const rol = document.getElementById('newRol').value;

  if (DB.getUsuarioByEmail(email)) {
    showToast('Ya existe un usuario con ese correo', 'error');
    return;
  }

  const usuario = {
    nombre,
    email,
    password,
    rol,
    activo: true
  };

  if (rol === 'estudiante') {
    usuario.seccion = document.getElementById('newSeccion').value;
  }

  DB.crearUsuario(usuario);
  Admin._usuariosFiltrados = null;
  Admin.cargarUsuarios();
  Admin.cargarEstadisticas();
  closeModal();
  showToast('Usuario creado correctamente', 'success');
};

Admin.crearSeccion = function (e) {
  e.preventDefault();
  const seccion = {
    nombre: document.getElementById('newNombreSec').value.trim(),
    grado: parseInt(document.getElementById('newGrado').value, 10)
  };
  DB.crearSeccion(seccion);
  this.cargarSecciones();
  this.cargarEstadisticas();
  closeModal();
  showToast('Sección creada', 'success');
};

Admin.crearMateria = function (e) {
  e.preventDefault();
  const materia = {
    nombre: document.getElementById('newNombreMat').value.trim(),
    seccion_id: document.getElementById('newSeccionMat').value,
    docente_id: document.getElementById('newDocenteMat').value || null
  };
  DB.crearMateria(materia);
  this.cargarMaterias();
  this.cargarEstadisticas();
  closeModal();
  showToast('Materia creada', 'success');
};

Admin.crearHorario = function (e) {
  e.preventDefault();
  const horario = {
    dia: document.getElementById('newDia').value,
    materia_id: document.getElementById('newMateriaHor').value,
    hora_inicio: document.getElementById('newHoraInicio').value,
    hora_fin: document.getElementById('newHoraFin').value
  };
  DB.crearHorario(horario);
  this.cargarHorarios();
  closeModal();
  showToast('Horario creado', 'success');
};

// ==========================================
// TÓGGLES DE CAMPOS SEGÚN ROL
// ==========================================

function toggleNewUserFields() {
  const rol = document.getElementById('newRol').value;
  document.getElementById('newGrupoSeccion').style.display = rol === 'estudiante' ? 'flex' : 'none';
}

function toggleEditUserFields() {
  const rol = document.getElementById('editRol').value;
  document.getElementById('grupoSeccion').style.display = rol === 'estudiante' ? 'flex' : 'none';
  document.getElementById('grupoHijos').style.display = rol === 'padre' ? 'flex' : 'none';
}

// ==========================================
// UTILIDADES GLOBALES
// ==========================================

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  const modal = overlay.querySelector('.modal');
  if (modal) {
    modal.style.animation = 'none';
    modal.offsetHeight; // reflow
    modal.style.animation = '';
  }
  overlay.classList.remove('active');
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';
  toast.style.animation = 'none';
  toast.offsetHeight; // reflow
  toast.style.animation = 'toastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both';

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.style.animation = 'toastOut 0.25s ease-in both';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 250);
  }, 3200);
}

// ==========================================
// FUNCIONES DE IMPRESIÓN
// ==========================================

function imprimirTabla(titulo, subtitulo, columnas, datos) {
  const fecha = new Date().toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' });
  
  let tablaHTML = columnas.map(col => `<th>${col}</th>`).join('');
  let filasHTML = datos.map(fila => 
    `<tr>${fila.map(celda => `<td>${celda}</td>`).join('')}</tr>`
  ).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${titulo} - INSAVI</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #1a1a2e; padding-bottom: 12px; margin-bottom: 20px; }
        .header .logo { width: 45px; height: 45px; background: #e8e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.6rem; color: #1a1a2e; }
        .header .info h2 { margin: 0; font-size: 16pt; color: #1a1a2e; }
        .header .info p { margin: 2px 0 0; font-size: 9pt; color: #666; }
        .header .date { font-size: 9pt; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9pt; }
        th { background: #f0f0f5; color: #1a1a2e; padding: 8px 10px; text-align: left; border: 1px solid #ddd; font-weight: 700; text-transform: uppercase; font-size: 8pt; letter-spacing: 0.5px; }
        td { padding: 6px 10px; border: 1px solid #e0e0e0; }
        tr:nth-child(even) { background: #f9f9fc; }
        .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 8pt; color: #888; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="logo">INSAVI</div>
          <div class="info">
            <h2>${titulo}</h2>
            <p>${subtitulo}</p>
          </div>
        </div>
        <div class="date">${fecha}</div>
      </div>
      <table>
        <thead><tr>${tablaHTML}</tr></thead>
        <tbody>${filasHTML}</tbody>
      </table>
      <div class="footer">
        Instituto Nacional Dr. Sarbelio Navarrete (INSAVI) - Sistema Academico - Generado el ${fecha}
      </div>
    </body>
    </html>
  `;

  const ventana = window.open('', '_blank');
  ventana.document.write(html);
  ventana.document.close();
  ventana.print();
}

Admin.imprimirUsuarios = function() {
  const usuarios = DB.getUsuarios();
  const columnas = ['USUARIO', 'CORREO', 'ROL', 'SECCION/HIJOS', 'ESTADO'];
  const datos = usuarios.map(u => {
    let rolLabel = u.rol.charAt(0).toUpperCase() + u.rol.slice(1);
    let detalle = u.rol === 'estudiante' ? (u.seccion || '-') : 
                  (u.rol === 'padre' ? ((u.hijos?.length || 0) + ' hijos') : '-');
    let estado = u.activo ? 'Activo' : 'Inactivo';
    return [u.nombre, u.email, rolLabel, detalle, estado];
  });
  imprimirTabla('Gestion de Usuarios', 'Listado completo de usuarios del sistema', columnas, datos);
};

Admin.imprimirSecciones = function() {
  const secciones = DB.getSecciones();
  const estudiantes = DB.getUsuariosByRol('estudiante');
  const columnas = ['SECCION', 'GRADO', 'CANTIDAD ALUMNOS'];
  const datos = secciones.map(s => {
    const cant = estudiantes.filter(u => u.seccion === s.nombre).length;
    return [s.nombre, s.grado + ' grado', cant + ' alumnos'];
  });
  imprimirTabla('Gestion de Secciones', 'Listado de secciones y capacidades', columnas, datos);
};

Admin.imprimirMaterias = function() {
  const materias = DB.getMaterias();
  const columnas = ['MATERIA', 'SECCION', 'DOCENTE'];
  const datos = materias.map(m => {
    const s = DB.getSeccionById(m.seccion_id);
    const d = DB.getUsuarioById(m.docente_id);
    return [m.nombre, s ? s.nombre : '-', d ? d.nombre : 'Sin asignar'];
  });
  imprimirTabla('Gestion de Materias', 'Listado de materias asignadas', columnas, datos);
};

Admin.imprimirHorarios = function() {
  const horarios = DB.getHorarios();
  const columnas = ['DIA', 'MATERIA', 'SECCION', 'INICIO', 'FIN'];
  const datos = horarios.map(h => {
    const m = DB.getMateriaById(h.materia_id);
    const s = m ? DB.getSeccionById(m.seccion_id) : null;
    return [h.dia, m ? m.nombre : '-', s ? s.nombre : '-', h.hora_inicio, h.hora_fin];
  });
  imprimirTabla('Gestion de Horarios', 'Horario general de clases', columnas, datos);
};