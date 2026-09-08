/**
 * INSAVI - Datos Iniciales y Semilla de Prueba Enriquecida
 * Instituto Nacional Dr. Sarbelio Navarrete (San Vicente, El Salvador)
 * Versión 3.0 - Ampliada con docentes, estudiantes, materias y calificaciones completas
 */

const INSAVI_SEED = {
  // 1. USUARIOS DEL SISTEMA (Admin, Docentes, Estudiantes, Padres, Servicios)
  usuarios: [
    // --- Administrador ---
    {
      id: 'usr_001',
      nombre: 'Carlos Administrador',
      email: 'admin@insavi.edu.sv',
      password: 'admin123',
      rol: 'admin',
      activo: true
    },

    // --- Docentes Institucionales ---
    {
      id: 'usr_002',
      nombre: 'Profa. María García López',
      email: 'maria.garcia@insavi.edu.sv',
      password: 'docente123',
      rol: 'docente',
      especialidad: 'Matemática y Estadística',
      activo: true
    },
    {
      id: 'usr_003',
      nombre: 'Prof. Roberto Martínez',
      email: 'roberto.martinez@insavi.edu.sv',
      password: 'docente123',
      rol: 'docente',
      especialidad: 'Lenguaje, Literatura y Comunicación',
      activo: true
    },
    {
      id: 'usr_013',
      nombre: 'Prof. José David Cornejo',
      email: 'david.cornejo@insavi.edu.sv',
      password: 'docente123',
      rol: 'docente',
      especialidad: 'Informática y Desarrollo de Software',
      activo: true
    },
    {
      id: 'usr_014',
      nombre: 'Profa. Sandra Beatriz Molina',
      email: 'sandra.molina@insavi.edu.sv',
      password: 'docente123',
      rol: 'docente',
      especialidad: 'Ciencias Naturales, Física y Química',
      activo: true
    },
    {
      id: 'usr_015',
      nombre: 'Prof. Manuel Antonio Gómez',
      email: 'manuel.gomez@insavi.edu.sv',
      password: 'docente123',
      rol: 'docente',
      especialidad: 'Idioma Extranjero Inglés',
      activo: true
    },
    {
      id: 'usr_016',
      nombre: 'Prof. Nelson Enrique Ayala',
      email: 'nelson.ayala@insavi.edu.sv',
      password: 'docente123',
      rol: 'docente',
      especialidad: 'Mantenimiento Automotriz y Tecnología',
      activo: true
    },

    // --- Estudiantes: 1°A (Bachillerato General) ---
    {
      id: 'usr_004',
      nombre: 'Ana López Hernández',
      email: 'ana.lopez@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '1°A',
      activo: true
    },
    {
      id: 'usr_005',
      nombre: 'Luis Martínez Ramos',
      email: 'luis.martinez@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '1°A',
      activo: true
    },
    {
      id: 'usr_017',
      nombre: 'Carlos Daniel Rivas',
      email: 'carlos.rivas@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '1°A',
      activo: true
    },
    {
      id: 'usr_018',
      nombre: 'Valeria Sofía Gómez',
      email: 'valeria.gomez@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '1°A',
      activo: true
    },
    {
      id: 'usr_019',
      nombre: 'Kevin Edgardo Flores',
      email: 'kevin.flores@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '1°A',
      activo: true
    },

    // --- Estudiantes: 1°B (Bachillerato Técnico Automotriz) ---
    {
      id: 'usr_006',
      nombre: 'Sofía Hernández Cruz',
      email: 'sofia.hernandez@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '1°B',
      activo: true
    },
    {
      id: 'usr_020',
      nombre: 'Mateo Alexander Peña',
      email: 'mateo.pena@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '1°B',
      activo: true
    },
    {
      id: 'usr_021',
      nombre: 'Camila Gabriela Méndez',
      email: 'camila.mendez@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '1°B',
      activo: true
    },
    {
      id: 'usr_022',
      nombre: 'Bryan Alexis Portillo',
      email: 'bryan.portillo@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '1°B',
      activo: true
    },

    // --- Estudiantes: 2°A (Bachillerato Técnico Software / Informática) ---
    {
      id: 'usr_007',
      nombre: 'Diego Ramírez Vásquez',
      email: 'diego.ramirez@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '2°A',
      activo: true
    },
    {
      id: 'usr_008',
      nombre: 'Valeria Castillo',
      email: 'valeria.castillo@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '2°A',
      activo: true
    },
    {
      id: 'usr_023',
      nombre: 'Andrea Michelle Santos',
      email: 'andrea.santos@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '2°A',
      activo: true
    },
    {
      id: 'usr_024',
      nombre: 'Fernando José Morales',
      email: 'fernando.morales@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '2°A',
      activo: true
    },

    // --- Estudiantes: 2°B (Bachillerato Técnico Contabilidad / Salud) ---
    {
      id: 'usr_025',
      nombre: 'Josué David Beltrán',
      email: 'josue.beltran@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '2°B',
      activo: true
    },
    {
      id: 'usr_026',
      nombre: 'Daniela Noemí Romero',
      email: 'daniela.romero@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '2°B',
      activo: true
    },
    {
      id: 'usr_027',
      nombre: 'Rodrigo Alfonso Quintanilla',
      email: 'rodrigo.quintanilla@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '2°B',
      activo: true
    },
    {
      id: 'usr_028',
      nombre: 'Fátima Marielos Torres',
      email: 'fatima.torres@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '2°B',
      activo: true
    },

    // --- Estudiantes: 3°A (Graduandos / Bachillerato Técnico Avanzado) ---
    {
      id: 'usr_029',
      nombre: 'Christian Steven Ramos',
      email: 'christian.ramos@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '3°A',
      activo: true
    },
    {
      id: 'usr_030',
      nombre: 'Brenda Abigail Cruz',
      email: 'brenda.cruz@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '3°A',
      activo: true
    },
    {
      id: 'usr_031',
      nombre: 'Javier Antonio Guardado',
      email: 'javier.guardado@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '3°A',
      activo: true
    },
    {
      id: 'usr_032',
      nombre: 'Melissa Stephanie Reyes',
      email: 'melissa.reyes@estudiante.insavi.edu.sv',
      password: 'est123',
      rol: 'estudiante',
      seccion: '3°A',
      activo: true
    },

    // --- Padres / Responsables de Familia ---
    {
      id: 'usr_009',
      nombre: 'Jorge López (Padre)',
      email: 'jorge.lopez@padre.insavi.edu.sv',
      password: 'padre123',
      rol: 'padre',
      hijos: ['usr_004', 'usr_005'],
      activo: true
    },
    {
      id: 'usr_010',
      nombre: 'Carmen Martínez (Madre)',
      email: 'carmen.martinez@padre.insavi.edu.sv',
      password: 'padre123',
      rol: 'padre',
      hijos: ['usr_005', 'usr_007'],
      activo: true
    },
    {
      id: 'usr_033',
      nombre: 'Silvia Elena Ramos (Madre)',
      email: 'silvia.ramos@padre.insavi.edu.sv',
      password: 'padre123',
      rol: 'padre',
      hijos: ['usr_017', 'usr_029'],
      activo: true
    },
    {
      id: 'usr_034',
      nombre: 'Mauricio Antonio Peña (Padre)',
      email: 'mauricio.pena@padre.insavi.edu.sv',
      password: 'padre123',
      rol: 'padre',
      hijos: ['usr_020', 'usr_025'],
      activo: true
    },

    // --- Personal de Servicios y Mantenimiento ---
    {
      id: 'usr_011',
      nombre: 'Pedro Sánchez Rivas',
      email: 'pedro.sanchez@insavi.edu.sv',
      password: 'serv123',
      rol: 'servicios',
      cargo: 'Mantenimiento General y Electricidad',
      activo: true
    },
    {
      id: 'usr_012',
      nombre: 'Rosa Elena Mejía',
      email: 'rosa.mejia@insavi.edu.sv',
      password: 'serv123',
      rol: 'servicios',
      cargo: 'Limpieza y Orden de Instalaciones',
      activo: true
    },
    {
      id: 'usr_035',
      nombre: 'Tomás Alberto Orellana',
      email: 'tomas.orellana@insavi.edu.sv',
      password: 'serv123',
      rol: 'servicios',
      cargo: 'Seguridad y Vigilancia Institucional',
      activo: true
    }
  ],

  // 2. SECCIONES EDUCATIVAS
  secciones: [
    { id: 'sec_001', nombre: '1°A', grado: 1, especialidad: 'Bachillerato General' },
    { id: 'sec_002', nombre: '1°B', grado: 1, especialidad: 'Técnico Automotriz' },
    { id: 'sec_003', nombre: '2°A', grado: 2, especialidad: 'Técnico Desarrollo de Software' },
    { id: 'sec_004', nombre: '2°B', grado: 2, especialidad: 'Técnico Contabilidad' },
    { id: 'sec_005', nombre: '3°A', grado: 3, especialidad: 'Técnico Vocacional Superior' }
  ],

  // 3. MATERIAS POR SECCIÓN Y DOCENTE
  materias: [
    // --- 1°A (General) ---
    { id: 'mat_001', nombre: 'Matemática I', seccion_id: 'sec_001', docente_id: 'usr_002' },
    { id: 'mat_002', nombre: 'Lenguaje y Literatura I', seccion_id: 'sec_001', docente_id: 'usr_003' },
    { id: 'mat_003', nombre: 'Ciencias Naturales I', seccion_id: 'sec_001', docente_id: 'usr_014' },
    { id: 'mat_004', nombre: 'Idioma Inglés I', seccion_id: 'sec_001', docente_id: 'usr_015' },
    { id: 'mat_005', nombre: 'Informática y Ofimática', seccion_id: 'sec_001', docente_id: 'usr_013' },

    // --- 1°B (Técnico Automotriz) ---
    { id: 'mat_006', nombre: 'Matemática I', seccion_id: 'sec_002', docente_id: 'usr_002' },
    { id: 'mat_007', nombre: 'Lenguaje y Literatura I', seccion_id: 'sec_002', docente_id: 'usr_003' },
    { id: 'mat_008', nombre: 'Ciencias y Física Básica', seccion_id: 'sec_002', docente_id: 'usr_014' },
    { id: 'mat_009', nombre: 'Tecnología Automotriz I', seccion_id: 'sec_002', docente_id: 'usr_016' },
    { id: 'mat_010', nombre: 'Inglés Técnico I', seccion_id: 'sec_002', docente_id: 'usr_015' },

    // --- 2°A (Técnico Desarrollo de Software) ---
    { id: 'mat_011', nombre: 'Matemática II', seccion_id: 'sec_003', docente_id: 'usr_002' },
    { id: 'mat_012', nombre: 'Lenguaje y Literatura II', seccion_id: 'sec_003', docente_id: 'usr_003' },
    { id: 'mat_013', nombre: 'Programación Web y BD', seccion_id: 'sec_003', docente_id: 'usr_013' },
    { id: 'mat_014', nombre: 'Física II', seccion_id: 'sec_003', docente_id: 'usr_014' },
    { id: 'mat_015', nombre: 'Inglés Intermedio', seccion_id: 'sec_003', docente_id: 'usr_015' },

    // --- 2°B (Técnico Contabilidad) ---
    { id: 'mat_016', nombre: 'Matemática Financiera', seccion_id: 'sec_004', docente_id: 'usr_002' },
    { id: 'mat_017', nombre: 'Lenguaje y Redacción Mercantil', seccion_id: 'sec_004', docente_id: 'usr_003' },
    { id: 'mat_018', nombre: 'Química Aplicada', seccion_id: 'sec_004', docente_id: 'usr_014' },
    { id: 'mat_019', nombre: 'Contabilidad General y Costos', seccion_id: 'sec_004', docente_id: 'usr_013' },
    { id: 'mat_020', nombre: 'Inglés Técnico II', seccion_id: 'sec_004', docente_id: 'usr_015' },

    // --- 3°A (Técnico Avanzado / Graduandos) ---
    { id: 'mat_021', nombre: 'Matemática Aplicada', seccion_id: 'sec_005', docente_id: 'usr_002' },
    { id: 'mat_022', nombre: 'Seminario de Graduación', seccion_id: 'sec_005', docente_id: 'usr_003' },
    { id: 'mat_023', nombre: 'Desarrollo de Software Avanzado', seccion_id: 'sec_005', docente_id: 'usr_013' },
    { id: 'mat_024', nombre: 'Mecatrónica y Diagnóstico', seccion_id: 'sec_005', docente_id: 'usr_016' },
    { id: 'mat_025', nombre: 'Emprendimiento y Proyectos', seccion_id: 'sec_005', docente_id: 'usr_014' }
  ],

  // 4. HORARIOS SEMANALES
  horarios: [
    // 1°A
    { id: 'hor_001', materia_id: 'mat_001', dia: 'Lunes', hora_inicio: '07:00', hora_fin: '07:45' },
    { id: 'hor_002', materia_id: 'mat_002', dia: 'Lunes', hora_inicio: '07:45', hora_fin: '08:30' },
    { id: 'hor_003', materia_id: 'mat_003', dia: 'Martes', hora_inicio: '07:00', hora_fin: '07:45' },
    { id: 'hor_004', materia_id: 'mat_004', dia: 'Martes', hora_inicio: '07:45', hora_fin: '08:30' },
    { id: 'hor_005', materia_id: 'mat_005', dia: 'Miércoles', hora_inicio: '07:00', hora_fin: '08:30' },
    { id: 'hor_006', materia_id: 'mat_001', dia: 'Jueves', hora_inicio: '07:00', hora_fin: '07:45' },
    { id: 'hor_007', materia_id: 'mat_002', dia: 'Jueves', hora_inicio: '07:45', hora_fin: '08:30' },
    { id: 'hor_008', materia_id: 'mat_003', dia: 'Viernes', hora_inicio: '07:00', hora_fin: '07:45' },
    { id: 'hor_009', materia_id: 'mat_004', dia: 'Viernes', hora_inicio: '07:45', hora_fin: '08:30' },

    // 1°B
    { id: 'hor_010', materia_id: 'mat_006', dia: 'Lunes', hora_inicio: '08:45', hora_fin: '09:30' },
    { id: 'hor_011', materia_id: 'mat_007', dia: 'Lunes', hora_inicio: '09:30', hora_fin: '10:15' },
    { id: 'hor_012', materia_id: 'mat_009', dia: 'Martes', hora_inicio: '08:45', hora_fin: '10:15' },
    { id: 'hor_013', materia_id: 'mat_008', dia: 'Miércoles', hora_inicio: '08:45', hora_fin: '09:30' },
    { id: 'hor_014', materia_id: 'mat_010', dia: 'Miércoles', hora_inicio: '09:30', hora_fin: '10:15' },
    { id: 'hor_015', materia_id: 'mat_009', dia: 'Jueves', hora_inicio: '08:45', hora_fin: '10:15' },
    { id: 'hor_016', materia_id: 'mat_006', dia: 'Viernes', hora_inicio: '08:45', hora_fin: '09:30' },

    // 2°A
    { id: 'hor_017', materia_id: 'mat_011', dia: 'Lunes', hora_inicio: '07:00', hora_fin: '07:45' },
    { id: 'hor_018', materia_id: 'mat_012', dia: 'Lunes', hora_inicio: '07:45', hora_fin: '08:30' },
    { id: 'hor_019', materia_id: 'mat_013', dia: 'Martes', hora_inicio: '07:00', hora_fin: '08:30' },
    { id: 'hor_020', materia_id: 'mat_014', dia: 'Miércoles', hora_inicio: '07:00', hora_fin: '07:45' },
    { id: 'hor_021', materia_id: 'mat_015', dia: 'Miércoles', hora_inicio: '07:45', hora_fin: '08:30' },
    { id: 'hor_022', materia_id: 'mat_013', dia: 'Jueves', hora_inicio: '07:00', hora_fin: '08:30' },
    { id: 'hor_023', materia_id: 'mat_011', dia: 'Viernes', hora_inicio: '07:00', hora_fin: '07:45' },

    // 2°B
    { id: 'hor_024', materia_id: 'mat_016', dia: 'Lunes', hora_inicio: '08:45', hora_fin: '09:30' },
    { id: 'hor_025', materia_id: 'mat_017', dia: 'Lunes', hora_inicio: '09:30', hora_fin: '10:15' },
    { id: 'hor_026', materia_id: 'mat_019', dia: 'Martes', hora_inicio: '08:45', hora_fin: '10:15' },
    { id: 'hor_027', materia_id: 'mat_018', dia: 'Miércoles', hora_inicio: '08:45', hora_fin: '09:30' },
    { id: 'hor_028', materia_id: 'mat_020', dia: 'Jueves', hora_inicio: '08:45', hora_fin: '09:30' },
    { id: 'hor_029', materia_id: 'mat_019', dia: 'Viernes', hora_inicio: '08:45', hora_fin: '10:15' },

    // 3°A
    { id: 'hor_030', materia_id: 'mat_021', dia: 'Lunes', hora_inicio: '10:30', hora_fin: '11:15' },
    { id: 'hor_031', materia_id: 'mat_022', dia: 'Lunes', hora_inicio: '11:15', hora_fin: '12:00' },
    { id: 'hor_032', materia_id: 'mat_023', dia: 'Martes', hora_inicio: '10:30', hora_fin: '12:00' },
    { id: 'hor_033', materia_id: 'mat_024', dia: 'Miércoles', hora_inicio: '10:30', hora_fin: '12:00' },
    { id: 'hor_034', materia_id: 'mat_025', dia: 'Jueves', hora_inicio: '10:30', hora_fin: '11:15' },
    { id: 'hor_035', materia_id: 'mat_023', dia: 'Viernes', hora_inicio: '10:30', hora_fin: '12:00' }
  ],

  // 5. CALIFICACIONES Y NOTAS REGISTRADAS
  notas: [
    // --- 1°A: Ana López (usr_004) ---
    { id: 'nota_001', estudiante_id: 'usr_004', materia_id: 'mat_001', nota1: 8.5, nota2: 7.5, nota3: 9.0 },
    { id: 'nota_002', estudiante_id: 'usr_004', materia_id: 'mat_002', nota1: 9.0, nota2: 8.5, nota3: 8.5 },
    { id: 'nota_003', estudiante_id: 'usr_004', materia_id: 'mat_003', nota1: 7.5, nota2: 8.0, nota3: 8.0 },
    { id: 'nota_004', estudiante_id: 'usr_004', materia_id: 'mat_004', nota1: 8.0, nota2: 9.0, nota3: 8.5 },
    { id: 'nota_005', estudiante_id: 'usr_004', materia_id: 'mat_005', nota1: 9.5, nota2: 9.0, nota3: 10.0 },

    // --- 1°A: Luis Martínez (usr_005) ---
    { id: 'nota_006', estudiante_id: 'usr_005', materia_id: 'mat_001', nota1: 6.5, nota2: 7.0, nota3: 7.5 },
    { id: 'nota_007', estudiante_id: 'usr_005', materia_id: 'mat_002', nota1: 7.0, nota2: 6.5, nota3: 7.0 },
    { id: 'nota_008', estudiante_id: 'usr_005', materia_id: 'mat_003', nota1: 8.0, nota2: 7.5, nota3: 8.0 },
    { id: 'nota_009', estudiante_id: 'usr_005', materia_id: 'mat_004', nota1: 7.5, nota2: 7.0, nota3: 6.5 },
    { id: 'nota_010', estudiante_id: 'usr_005', materia_id: 'mat_005', nota1: 8.0, nota2: 8.5, nota3: 8.0 },

    // --- 1°A: Carlos Daniel Rivas (usr_017) ---
    { id: 'nota_011', estudiante_id: 'usr_017', materia_id: 'mat_001', nota1: 9.0, nota2: 8.5, nota3: 9.5 },
    { id: 'nota_012', estudiante_id: 'usr_017', materia_id: 'mat_002', nota1: 8.5, nota2: 9.0, nota3: 8.5 },
    { id: 'nota_013', estudiante_id: 'usr_017', materia_id: 'mat_003', nota1: 9.0, nota2: 9.5, nota3: 9.0 },
    { id: 'nota_014', estudiante_id: 'usr_017', materia_id: 'mat_004', nota1: 8.0, nota2: 8.0, nota3: 8.5 },
    { id: 'nota_015', estudiante_id: 'usr_017', materia_id: 'mat_005', nota1: 9.5, nota2: 10.0, nota3: 9.5 },

    // --- 1°A: Valeria Sofía Gómez (usr_018) ---
    { id: 'nota_016', estudiante_id: 'usr_018', materia_id: 'mat_001', nota1: 8.0, nota2: 8.5, nota3: 8.0 },
    { id: 'nota_017', estudiante_id: 'usr_018', materia_id: 'mat_002', nota1: 9.5, nota2: 9.0, nota3: 9.5 },
    { id: 'nota_018', estudiante_id: 'usr_018', materia_id: 'mat_003', nota1: 8.5, nota2: 8.0, nota3: 8.5 },
    { id: 'nota_019', estudiante_id: 'usr_018', materia_id: 'mat_004', nota1: 9.0, nota2: 9.5, nota3: 9.0 },
    { id: 'nota_020', estudiante_id: 'usr_018', materia_id: 'mat_005', nota1: 8.5, nota2: 9.0, nota3: 8.5 },

    // --- 1°A: Kevin Edgardo Flores (usr_019) ---
    { id: 'nota_021', estudiante_id: 'usr_019', materia_id: 'mat_001', nota1: 7.0, nota2: 6.5, nota3: 7.0 },
    { id: 'nota_022', estudiante_id: 'usr_019', materia_id: 'mat_002', nota1: 6.5, nota2: 7.0, nota3: 7.5 },
    { id: 'nota_023', estudiante_id: 'usr_019', materia_id: 'mat_003', nota1: 7.5, nota2: 8.0, nota3: 7.0 },
    { id: 'nota_024', estudiante_id: 'usr_019', materia_id: 'mat_004', nota1: 6.0, nota2: 6.5, nota3: 7.0 },
    { id: 'nota_025', estudiante_id: 'usr_019', materia_id: 'mat_005', nota1: 8.0, nota2: 7.5, nota3: 8.0 },

    // --- 1°B: Sofía Hernández (usr_006) ---
    { id: 'nota_026', estudiante_id: 'usr_006', materia_id: 'mat_006', nota1: 9.5, nota2: 9.0, nota3: 9.5 },
    { id: 'nota_027', estudiante_id: 'usr_006', materia_id: 'mat_007', nota1: 8.5, nota2: 9.0, nota3: 8.5 },
    { id: 'nota_028', estudiante_id: 'usr_006', materia_id: 'mat_008', nota1: 9.0, nota2: 8.5, nota3: 9.0 },
    { id: 'nota_029', estudiante_id: 'usr_006', materia_id: 'mat_009', nota1: 9.5, nota2: 9.5, nota3: 10.0 },
    { id: 'nota_030', estudiante_id: 'usr_006', materia_id: 'mat_010', nota1: 8.5, nota2: 9.0, nota3: 8.5 },

    // --- 1°B: Mateo Alexander Peña (usr_020) ---
    { id: 'nota_031', estudiante_id: 'usr_020', materia_id: 'mat_006', nota1: 8.0, nota2: 7.5, nota3: 8.5 },
    { id: 'nota_032', estudiante_id: 'usr_020', materia_id: 'mat_007', nota1: 7.5, nota2: 8.0, nota3: 7.5 },
    { id: 'nota_033', estudiante_id: 'usr_020', materia_id: 'mat_008', nota1: 8.5, nota2: 8.0, nota3: 8.5 },
    { id: 'nota_034', estudiante_id: 'usr_020', materia_id: 'mat_009', nota1: 9.0, nota2: 9.5, nota3: 9.0 },
    { id: 'nota_035', estudiante_id: 'usr_020', materia_id: 'mat_010', nota1: 7.0, nota2: 7.5, nota3: 8.0 },

    // --- 2°A: Diego Ramírez (usr_007) ---
    { id: 'nota_036', estudiante_id: 'usr_007', materia_id: 'mat_011', nota1: 7.0, nota2: 7.5, nota3: 8.0 },
    { id: 'nota_037', estudiante_id: 'usr_007', materia_id: 'mat_012', nota1: 8.0, nota2: 7.5, nota3: 7.0 },
    { id: 'nota_038', estudiante_id: 'usr_007', materia_id: 'mat_013', nota1: 9.0, nota2: 9.5, nota3: 9.0 },
    { id: 'nota_039', estudiante_id: 'usr_007', materia_id: 'mat_014', nota1: 6.5, nota2: 7.0, nota3: 6.5 },
    { id: 'nota_040', estudiante_id: 'usr_007', materia_id: 'mat_015', nota1: 7.5, nota2: 8.0, nota3: 7.5 },

    // --- 2°A: Valeria Castillo (usr_008) ---
    { id: 'nota_041', estudiante_id: 'usr_008', materia_id: 'mat_011', nota1: 9.0, nota2: 9.5, nota3: 9.0 },
    { id: 'nota_042', estudiante_id: 'usr_008', materia_id: 'mat_012', nota1: 8.5, nota2: 8.0, nota3: 9.0 },
    { id: 'nota_043', estudiante_id: 'usr_008', materia_id: 'mat_013', nota1: 10.0, nota2: 9.5, nota3: 10.0 },
    { id: 'nota_044', estudiante_id: 'usr_008', materia_id: 'mat_014', nota1: 9.0, nota2: 8.5, nota3: 9.0 },
    { id: 'nota_045', estudiante_id: 'usr_008', materia_id: 'mat_015', nota1: 8.5, nota2: 9.0, nota3: 9.5 },

    // --- 2°A: Andrea Michelle Santos (usr_023) ---
    { id: 'nota_046', estudiante_id: 'usr_023', materia_id: 'mat_011', nota1: 8.5, nota2: 9.0, nota3: 8.5 },
    { id: 'nota_047', estudiante_id: 'usr_023', materia_id: 'mat_012', nota1: 9.0, nota2: 9.5, nota3: 9.0 },
    { id: 'nota_048', estudiante_id: 'usr_023', materia_id: 'mat_013', nota1: 8.5, nota2: 9.0, nota3: 8.5 },
    { id: 'nota_049', estudiante_id: 'usr_023', materia_id: 'mat_014', nota1: 8.0, nota2: 8.5, nota3: 8.0 },
    { id: 'nota_050', estudiante_id: 'usr_023', materia_id: 'mat_015', nota1: 9.0, nota2: 9.0, nota3: 9.5 },

    // --- 2°B: Josué David Beltrán (usr_025) ---
    { id: 'nota_051', estudiante_id: 'usr_025', materia_id: 'mat_016', nota1: 8.5, nota2: 8.0, nota3: 9.0 },
    { id: 'nota_052', estudiante_id: 'usr_025', materia_id: 'mat_017', nota1: 7.5, nota2: 8.0, nota3: 8.0 },
    { id: 'nota_053', estudiante_id: 'usr_025', materia_id: 'mat_018', nota1: 7.0, nota2: 7.5, nota3: 7.5 },
    { id: 'nota_054', estudiante_id: 'usr_025', materia_id: 'mat_019', nota1: 9.0, nota2: 9.5, nota3: 9.0 },
    { id: 'nota_055', estudiante_id: 'usr_025', materia_id: 'mat_020', nota1: 8.0, nota2: 8.5, nota3: 8.0 },

    // --- 2°B: Daniela Noemí Romero (usr_026) ---
    { id: 'nota_056', estudiante_id: 'usr_026', materia_id: 'mat_016', nota1: 9.0, nota2: 9.5, nota3: 9.0 },
    { id: 'nota_057', estudiante_id: 'usr_026', materia_id: 'mat_017', nota1: 8.5, nota2: 9.0, nota3: 8.5 },
    { id: 'nota_058', estudiante_id: 'usr_026', materia_id: 'mat_018', nota1: 8.0, nota2: 8.0, nota3: 8.5 },
    { id: 'nota_059', estudiante_id: 'usr_026', materia_id: 'mat_019', nota1: 9.5, nota2: 9.5, nota3: 10.0 },
    { id: 'nota_060', estudiante_id: 'usr_026', materia_id: 'mat_020', nota1: 8.5, nota2: 9.0, nota3: 9.0 },

    // --- 3°A: Christian Steven Ramos (usr_029) ---
    { id: 'nota_061', estudiante_id: 'usr_029', materia_id: 'mat_021', nota1: 9.0, nota2: 9.5, nota3: 9.5 },
    { id: 'nota_062', estudiante_id: 'usr_029', materia_id: 'mat_022', nota1: 9.5, nota2: 10.0, nota3: 9.5 },
    { id: 'nota_063', estudiante_id: 'usr_029', materia_id: 'mat_023', nota1: 10.0, nota2: 9.5, nota3: 10.0 },
    { id: 'nota_064', estudiante_id: 'usr_029', materia_id: 'mat_024', nota1: 8.5, nota2: 9.0, nota3: 9.0 },
    { id: 'nota_065', estudiante_id: 'usr_029', materia_id: 'mat_025', nota1: 9.5, nota2: 9.0, nota3: 10.0 },

    // --- 3°A: Brenda Abigail Cruz (usr_030) ---
    { id: 'nota_066', estudiante_id: 'usr_030', materia_id: 'mat_021', nota1: 8.5, nota2: 8.0, nota3: 8.5 },
    { id: 'nota_067', estudiante_id: 'usr_030', materia_id: 'mat_022', nota1: 9.0, nota2: 9.5, nota3: 9.0 },
    { id: 'nota_068', estudiante_id: 'usr_030', materia_id: 'mat_023', nota1: 9.0, nota2: 9.0, nota3: 9.5 },
    { id: 'nota_069', estudiante_id: 'usr_030', materia_id: 'mat_024', nota1: 8.0, nota2: 8.5, nota3: 8.0 },
    { id: 'nota_070', estudiante_id: 'usr_030', materia_id: 'mat_025', nota1: 9.0, nota2: 9.5, nota3: 9.0 }
  ],

  // 6. PLANTILLAS DE TAREAS DE SERVICIOS (por tipo de cargo)
  tareas_plantillas: [
    // Mantenimiento General
    { id: 'tpl_001', cargo: 'mantenimiento', turno: 'manana', titulo: 'Revisión eléctrica del edificio A', descripcion: 'Verificar tableros, enchufes y alumbrado de las aulas 1 al 8.' },
    { id: 'tpl_002', cargo: 'mantenimiento', turno: 'manana', titulo: 'Inspección de sanitarios bloque norte', descripcion: 'Revisar tuberías, llaves de agua y estado general de los baños.' },
    { id: 'tpl_003', cargo: 'mantenimiento', turno: 'tarde', titulo: 'Reparación de mobiliario reportado', descripcion: 'Atender los reportes de pupitres o mesas dañadas entregados por docentes.' },
    { id: 'tpl_004', cargo: 'mantenimiento', turno: 'tarde', titulo: 'Revisión de techos y filtraciones', descripcion: 'Inspeccionar el techo del laboratorio y la cancha tras lluvia reciente.' },
    { id: 'tpl_005', cargo: 'mantenimiento', turno: 'manana', titulo: 'Mantenimiento de aires y ventiladores', descripcion: 'Limpiar filtros y verificar funcionamiento de equipos de ventilación.' },

    // Limpieza
    { id: 'tpl_006', cargo: 'limpieza', turno: 'manana', titulo: 'Limpieza de aulas 1°A y 1°B', descripcion: 'Barrer, limpiar pizarras y desinfectar superficies antes de entrada.' },
    { id: 'tpl_007', cargo: 'limpieza', turno: 'manana', titulo: 'Limpieza de baños y lavamanos', descripcion: 'Desinfectar todos los sanitarios y reponer papel y jabón.' },
    { id: 'tpl_008', cargo: 'limpieza', turno: 'manana', titulo: 'Limpieza de pasillos y áreas comunes', descripcion: 'Barrer y trapejar los pasillos del edificio principal.' },
    { id: 'tpl_009', cargo: 'limpieza', turno: 'tarde', titulo: 'Limpieza de laboratorio de informática', descripcion: 'Limpiar pantallas, teclados y superficies del laboratorio.' },
    { id: 'tpl_010', cargo: 'limpieza', turno: 'tarde', titulo: 'Recolección de basura general', descripcion: 'Vaciar los basureros de todas las aulas y áreas y llevar al punto de recolección.' },

    // Seguridad
    { id: 'tpl_011', cargo: 'seguridad', turno: 'manana', titulo: 'Control de ingreso matutino', descripcion: 'Registrar la entrada de estudiantes y personal entre 6:30 y 7:30.' },
    { id: 'tpl_012', cargo: 'seguridad', turno: 'manana', titulo: 'Ronda perimetral — mañana', descripcion: 'Inspeccionar el perímetro del instituto y verificar portones.' },
    { id: 'tpl_013', cargo: 'seguridad', turno: 'tarde', titulo: 'Ronda perimetral — tarde', descripcion: 'Segunda ronda de inspección del perímetro tras el recreo.' },
    { id: 'tpl_014', cargo: 'seguridad', turno: 'tarde', titulo: 'Control de salida vespertina', descripcion: 'Supervisar la salida de estudiantes y cierre de puertas al finalizar el día.' },
    { id: 'tpl_015', cargo: 'seguridad', turno: 'tarde', titulo: 'Revisión de cámaras y equipo de vigilancia', descripcion: 'Verificar que las cámaras de seguridad estén operativas.' }
  ]
};

// Versión de control para actualización de datos en el cliente
const INSAVI_SEED_VERSION = 'v3.2_servicios_tickets';

// Función para cargar o actualizar datos iniciales
// Se verifica que los datos EXISTAN y no estén vacíos; si la versión coincide
// pero falta info (por un fallo anterior), se repuebla igualmente.
function cargarDatosIniciales() {
  const currentVersion = localStorage.getItem('insavi_seed_version');
  const usuarios = localStorage.getItem('insavi_usuarios');

  const datosValidos = currentVersion === INSAVI_SEED_VERSION &&
    usuarios && usuarios !== '[]' && usuarios !== 'null';

  if (datosValidos) {
    return false;
  }

  localStorage.setItem('insavi_usuarios', JSON.stringify(INSAVI_SEED.usuarios));
  localStorage.setItem('insavi_secciones', JSON.stringify(INSAVI_SEED.secciones));
  localStorage.setItem('insavi_materias', JSON.stringify(INSAVI_SEED.materias));
  localStorage.setItem('insavi_horarios', JSON.stringify(INSAVI_SEED.horarios));
  localStorage.setItem('insavi_notas', JSON.stringify(INSAVI_SEED.notas));
  localStorage.setItem('insavi_tareas_plantillas', JSON.stringify(INSAVI_SEED.tareas_plantillas));
  localStorage.setItem('insavi_seed_version', INSAVI_SEED_VERSION);

  console.log(`%c[INSAVI] Base de datos cargada (${INSAVI_SEED_VERSION})`, 'color: #8b5cf6; font-weight: bold;');
  return true;
}

// Auto-ejecutar al cargar el script
cargarDatosIniciales();

