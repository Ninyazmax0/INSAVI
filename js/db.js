/**
 * INSAVI - Capa de Base de Datos (localStorage)
 * Operaciones CRUD para el sistema escolar
 */

const DB = {
  // ==========================================
  // UTILIDADES GENERALES
  // ==========================================
  
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

  // ==========================================
  // USUARIOS
  // ==========================================
  
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

  // ==========================================
  // SECCIONES
  // ==========================================
  
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

  // ==========================================
  // MATERIAS
  // ==========================================
  
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

  // ==========================================
  // HORARIOS
  // ==========================================
  
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

  // ==========================================
  // NOTAS
  // ==========================================
  
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

  // ==========================================
  // SESIÓN
  // ==========================================
  
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

// Auto-cargar datos iniciales si no existen
if (typeof INSAVI_SEED !== 'undefined') {
  cargarDatosIniciales();
}
