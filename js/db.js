const DB = {
  generateId(prefix = 'item') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`[DB] Error leyendo ${key}:`, e);
      return [];
    }
  },

  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`[DB] Error guardando ${key}:`, e);
      return false;
    }
  },

  getUsuarios() {
    return this.get('insavi_usuarios');
  },

  getUsuarioById(id) {
    return this.getUsuarios().find(u => u.id === id) || null;
  },

  getUsuarioByEmail(email) {
    return this.getUsuarios().find(u => u.email === email) || null;
  },

  getUsuariosByRol(rol) {
    return this.getUsuarios().filter(u => u.rol === rol);
  },

  crearUsuario(usuario) {
    const usuarios = this.getUsuarios();
    const nuevo = {
      id: this.generateId('usr'),
      ...usuario,
      activo: true
    };
    usuarios.push(nuevo);
    this.set('insavi_usuarios', usuarios);
    return nuevo;
  },

  actualizarUsuario(id, datos) {
    const usuarios = this.getUsuarios();
    const idx = usuarios.findIndex(u => u.id === id);
    if (idx === -1) return null;

    usuarios[idx] = { ...usuarios[idx], ...datos };
    this.set('insavi_usuarios', usuarios);
    return usuarios[idx];
  },

  eliminarUsuario(id) {
    const usuarios = this.getUsuarios().filter(u => u.id !== id);
    this.set('insavi_usuarios', usuarios);
    return true;
  },

  getSecciones() {
    return this.get('insavi_secciones');
  },

  getSeccionById(id) {
    return this.getSecciones().find(s => s.id === id) || null;
  },

  crearSeccion(seccion) {
    const secciones = this.getSecciones();
    const nueva = {
      id: this.generateId('sec'),
      ...seccion
    };
    secciones.push(nueva);
    this.set('insavi_secciones', secciones);
    return nueva;
  },

  actualizarSeccion(id, datos) {
    const secciones = this.getSecciones();
    const idx = secciones.findIndex(s => s.id === id);
    if (idx === -1) return null;

    secciones[idx] = { ...secciones[idx], ...datos };
    this.set('insavi_secciones', secciones);
    return secciones[idx];
  },

  eliminarSeccion(id) {
    const secciones = this.getSecciones().filter(s => s.id !== id);
    this.set('insavi_secciones', secciones);
    return true;
  },

  getMaterias() {
    return this.get('insavi_materias');
  },

  getMateriaById(id) {
    return this.getMaterias().find(m => m.id === id) || null;
  },

  getMateriasBySeccion(seccionId) {
    return this.getMaterias().filter(m => m.seccion_id === seccionId);
  },

  getMateriasByDocente(docenteId) {
    return this.getMaterias().filter(m => m.docente_id === docenteId);
  },

  crearMateria(materia) {
    const materias = this.getMaterias();
    const nueva = {
      id: this.generateId('mat'),
      ...materia
    };
    materias.push(nueva);
    this.set('insavi_materias', materias);
    return nueva;
  },

  actualizarMateria(id, datos) {
    const materias = this.getMaterias();
    const idx = materias.findIndex(m => m.id === id);
    if (idx === -1) return null;

    materias[idx] = { ...materias[idx], ...datos };
    this.set('insavi_materias', materias);
    return materias[idx];
  },

  eliminarMateria(id) {
    const materias = this.getMaterias().filter(m => m.id !== id);
    this.set('insavi_materias', materias);
    return true;
  },

  getHorarios() {
    return this.get('insavi_horarios');
  },

  getHorarioById(id) {
    return this.getHorarios().find(h => h.id === id) || null;
  },

  getHorariosBySeccion(seccionId) {
    const materias = this.getMateriasBySeccion(seccionId);
    const materiaIds = materias.map(m => m.id);
    return this.getHorarios().filter(h => materiaIds.includes(h.materia_id));
  },

  getHorariosByDocente(docenteId) {
    const materias = this.getMateriasByDocente(docenteId);
    const materiaIds = materias.map(m => m.id);
    return this.getHorarios().filter(h => materiaIds.includes(h.materia_id));
  },

  crearHorario(horario) {
    const horarios = this.getHorarios();
    const nuevo = {
      id: this.generateId('hor'),
      ...horario
    };
    horarios.push(nuevo);
    this.set('insavi_horarios', horarios);
    return nuevo;
  },

  actualizarHorario(id, datos) {
    const horarios = this.getHorarios();
    const idx = horarios.findIndex(h => h.id === id);
    if (idx === -1) return null;

    horarios[idx] = { ...horarios[idx], ...datos };
    this.set('insavi_horarios', horarios);
    return horarios[idx];
  },

  eliminarHorario(id) {
    const horarios = this.getHorarios().filter(h => h.id !== id);
    this.set('insavi_horarios', horarios);
    return true;
  },

  getNotas() {
    return this.get('insavi_notas');
  },

  getNotaById(id) {
    return this.getNotas().find(n => n.id === id) || null;
  },

  getNotasByEstudiante(estudianteId) {
    return this.getNotas().filter(n => n.estudiante_id === estudianteId);
  },

  getNotasByMateria(materiaId) {
    return this.getNotas().filter(n => n.materia_id === materiaId);
  },

  getNotasByEstudianteYSeccion(estudianteId, seccionId) {
    const materias = this.getMateriasBySeccion(seccionId);
    const materiaIds = materias.map(m => m.id);
    return this.getNotas().filter(n =>
      n.estudiante_id === estudianteId && materiaIds.includes(n.materia_id)
    );
  },

  calcularPromedio(nota) {
    if (!nota) return 0;
    const { nota1 = 0, nota2 = 0, nota3 = 0 } = nota;
    return ((nota1 + nota2 + nota3) / 3).toFixed(2);
  },

  getPromedioGeneral(estudianteId) {
    const notas = this.getNotasByEstudiante(estudianteId);
    if (notas.length === 0) return 0;

    const total = notas.reduce((sum, nota) => {
      return sum + parseFloat(this.calcularPromedio(nota));
    }, 0);

    return (total / notas.length).toFixed(2);
  },

  getPromedioPorMateria(materiaId) {
    const notas = this.getNotasByMateria(materiaId);
    if (notas.length === 0) return 0;

    const total = notas.reduce((sum, nota) => {
      return sum + parseFloat(this.calcularPromedio(nota));
    }, 0);

    return (total / notas.length).toFixed(2);
  },

  crearNota(nota) {
    const notas = this.getNotas();
    const nueva = {
      id: this.generateId('nota'),
      ...nota
    };
    notas.push(nueva);
    this.set('insavi_notas', notas);
    return nueva;
  },

  actualizarNota(id, datos) {
    const notas = this.getNotas();
    const idx = notas.findIndex(n => n.id === id);
    if (idx === -1) return null;

    notas[idx] = { ...notas[idx], ...datos };
    this.set('insavi_notas', notas);
    return notas[idx];
  },

  eliminarNota(id) {
    const notas = this.getNotas().filter(n => n.id !== id);
    this.set('insavi_notas', notas);
    return true;
  },

  getFechaHoy() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dia}`;
  },

  getFechaKey(fecha) {
    return `insavi_tareas_${fecha}`;
  },

  getTareasPlantillas() {
    return this.get('insavi_tareas_plantillas');
  },

  getTareasDiarias(fecha) {
    return this.get(this.getFechaKey(fecha));
  },

  guardarTareasDiarias(tareas, fecha) {
    return this.set(this.getFechaKey(fecha), tareas);
  },

  obtenerCargoKey(usuario) {
    if (!usuario || !usuario.cargo) return null;
    const cargo = usuario.cargo.toLowerCase();
    if (cargo.includes('mantenimiento')) return 'mantenimiento';
    if (cargo.includes('limpieza')) return 'limpieza';
    if (cargo.includes('seguridad')) return 'seguridad';
    return null;
  },

  generarTareasDelDia(fecha) {
    const existentes = this.getTareasDiarias(fecha);
    if (existentes.length > 0) return existentes;

    const usuarios = this.getUsuariosByRol('servicios').filter(u => u.activo);
    const plantillas = this.getTareasPlantillas();
    const nuevas = [];

    usuarios.forEach(user => {
      const cargoKey = this.obtenerCargoKey(user);
      if (!cargoKey) return;

      const plantillasCargo = plantillas.filter(p => p.cargo === cargoKey);
      plantillasCargo.forEach((pl, i) => {
        nuevas.push({
          id: `tarea_${fecha}_${user.id}_${i}`,
          plantilla_id: pl.id,
          usuario_id: user.id,
          cargo: cargoKey,
          titulo: pl.titulo,
          descripcion: pl.descripcion,
          turno: pl.turno,
          estado: 'pendiente',
          creada_en: new Date().toISOString(),
          actualizada_en: null
        });
      });
    });

    this.guardarTareasDiarias(nuevas, fecha);
    return nuevas;
  },

  getTareasDelUsuario(usuarioId, fecha) {
    const tareas = this.getTareasDiarias(fecha);
    return tareas.filter(t => t.usuario_id === usuarioId);
  },

  getTareasDelCargo(cargo, fecha) {
    const tareas = this.getTareasDiarias(fecha);
    return tareas.filter(t => t.cargo === cargo);
  },

  actualizarEstadoTarea(tareaId, estado, fecha) {
    const tareas = this.getTareasDiarias(fecha);
    const idx = tareas.findIndex(t => t.id === tareaId);
    if (idx === -1) return null;

    tareas[idx].estado = estado;
    tareas[idx].actualizada_en = new Date().toISOString();
    this.guardarTareasDiarias(tareas, fecha);
    return tareas[idx];
  },

  resetTareasDelDia(fecha) {
    localStorage.removeItem(this.getFechaKey(fecha));
    return this.generarTareasDelDia(fecha);
  },

  setSession(user) {
    localStorage.setItem('insavi_session', JSON.stringify({
      user_id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: true,
      timestamp: Date.now()
    }));
  },

  getSession() {
    try {
      const session = localStorage.getItem('insavi_session');
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  clearSession() {
    localStorage.removeItem('insavi_session');
  },

  isLoggedIn() {
    const session = this.getSession();
    return session && session.activo;
  },

  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    return this.getUsuarioById(session.user_id);
  }
};

if (typeof INSAVI_SEED !== 'undefined') {
  cargarDatosIniciales();
}