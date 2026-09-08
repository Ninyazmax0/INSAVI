# INSAVI - Portal Academico
### Instituto Nacional Dr. Sarbelio Navarrete

---

## Que es esto

INSAVI es el portal academico del Instituto Nacional Dr. Sarbelio Navarrete, desarrollado como proyecto estudiantil. Permite a diferentes personas de la institucion (administradores, docentes, estudiantes, padres de familia y personal de servicios) acceder a informacion academica desde un mismo sistema, cada quien con su propia vista y sus propios datos.

Todo corre en el navegador, sin servidor, sin base de datos real. Los datos son simulados mediante un archivo de semilla, al cual nombre en la carpeta data y el archivo dentro llamado seed.js, el cual contiene informacion como (usuarios, notas, horarios, plantillas de tareas diarias, etc) y carga la informacion en memoria al abrir la pagina. 

---

## Como era antes

La version original era basicamente una pagina institucional de una sola hoja. Tenia un navbar (una barra de navegacion pues) con secciones (Inicio, Nosotros, Galeria, Contacto y aja), un hero con texto de bienvenida, algunas imagenes del instituto y un formulario de contacto simple (segun imagenes que anteriormente tenia). Funcionaba con un archivo HTML, un CSS de unas 400 lineas aprox y un JS minimo que manejaba el menu hamburguesa y el modo oscuro/claro. No habia logica de roles, no habia login real, no habia panel de control.

---

## Que fue lo que modifique

### primero, la estructura del proyecto

La primera diferencia grande es que ya no es un solo archivo. Ahora el proyecto esta dividido asi:

```
INSAVI/
  index.html          <- Pagina de login (punto de entrada)
  dashboard.html      <- Panel de control de todos los roles
  insavi.html         <- La pagina institucional original (se conservo, nada mas se cambio diseño y ya)
  css/
    insavi.css        <- Todos los estilos del sistema (basicamente un rediseño de la version anterior con estilos nuevos, osea mas moderno, mejor estructurado y todo eso ah y se usa en todo el sistema)
    landing.css       <- Estilos para la pagina institucional
  js/
    auth.js           <- Logica de login y sesion
    dashboard.js      <- Navegacion, sidebar, logica general del panel 
    admin.js          <- Vista y funciones del rol Administrador
    docente.js        <- Vista y funciones del rol Docente
    estudiante.js     <- Vista y funciones del rol Estudiante
    padre.js          <- Vista y funciones del rol Padre de familia
    db.js             <- Capa de acceso a los datos en memoria (en )
    icons.js          <- Libreria de iconos SVG inline usados en todo el sistema
    insavi.js         <- JS de la pagina institucional
    servicios.js      <- Panel de Servicios Varios (las tareas diarias por cargo, el directorio de personal y el horario general del instituto)
  data/
    seed.js           <- Todos los datos de prueba (usuarios, notas, horarios, etc.)
  imgInsavi/
    (imagenes del instituto que se usan en la pagina institucional, por si acaso)
```

### lo del login con roles

Antes no habia login. Ahora la pagina de entrada es un formulario donde el usuario escoge su rol e ingresa credenciales. Dependiendo del rol, el dashboard carga una vista distinta con funciones distintas.

Cada rol tiene credenciales de prueba incluidas en el seed de datos.

(porcierto, en el panel de el login hay una opcion llamada algo asi como "credenciales de prueba rapidas" tocan una y automaticamente aparecen en sus casillas, la contra y el correo solo para que inicien de una)

### Diseno visual

El diseno completo fue rehecho desde cero. El estilo paso de ser una pagina institucional clasica con fondo blanco y colores azul/verde a un sistema oscuro tipo glassmorphism con tonos violeta, indigo y cian. Se usa la fuente Outfit de Google Fonts. Los paneles usan transparencias con blur, bordes sutiles y gradientes. No hay emojis en ninguna parte del sistema, solo iconos SVG.

### Sidebar colapsable

El panel de control tiene una barra lateral izquierda con la navegacion del rol activo. Esta barra se puede cerrar y abrir con el boton de hamburguesa que aparece arriba a la izquierda, tanto en el topbar como en la propia barra lateral. El estado (abierto o cerrado) se guarda en el navegador, asi que si lo cierras y recargas la pagina, sigue cerrado.

### Navegacion por sub-vistas

Dentro de cada panel, las secciones no se cargan todas juntas. Al hacer clic en una opcion del sidebar, solo se muestra esa seccion y el resto desaparece. Esto aplica a todos los roles: administrador, docente, estudiante, padre de familia y servicios.

### Panel del Administrador

Permite ver el resumen general del instituto, gestionar estudiantes (agregar, editar, eliminar), gestionar docentes, ver secciones y materias. Es el rol con mas funciones.

### Panel del Docente

Muestra un resumen con las clases asignadas y estadisticas basicas. Permite ver la lista de estudiantes por seccion, registrar y editar notas, y revisar el horario de clases.

### Panel del Estudiante

Muestra el resumen academico del estudiante: promedio general, materias con sus notas, estado de asistencia y horario de clases por dia de la semana. Cada seccion es una sub-vista separada accesible desde el sidebar.

### Panel del Padre de Familia

Disenado para hogares con mas de un hijo. El padre ve primero un resumen con todos sus hijos registrados, y puede entrar al detalle de cada uno por separado. El detalle muestra las notas, el promedio y el horario de ese hijo especifico. Los datos de prueba incluyen un padre con dos hijos distintos para probar esta logica.

### Panel de Servicios Varios

Esta seccion es accesible para cualquier usuario que haya iniciado sesion, sin importar el rol, pero a los trabajadores de servicios (el rol servicios) les resulta la mas util: ya no es solo una vista de consulta, ahora tiene sus tareas del dia.

Antes este panel solo tenia dos cosas: un directorio del personal activo del instituto (administradores y docentes con su nombre y correo) y un horario general de todas las clases programadas organizado por dia de la semana. Eso sigue ahi para todos los roles, nada mas que para los usuarios de servicios la primera opcion del sidebar es "Mis tareas del dia".

Las tareas se generan solas todos los dias a partir de unas plantillas que ya vienen en el seed (tienen su cargo y su turno, manana o tarde). Cada cargo tiene las suyas: mantenimiento, limpieza y seguridad. El trabajador las va marcando segun las va haciendo (puede ponerla en progreso, completarla o devolverla a pendiente) y el avance se guarda en el navegador con la fecha del dia, osea si recarga la pagina sus progresos siguen ahi y al siguiente dia las tareas se regeneran limpias desde cero, como debe ser. Hay una barrita de progreso arriba para que sepan cuanto llevan (x de y completadas, por si acaso).

### Control de servicios (el admin)

Aprovechando lo de las tareas, al administrador le puse una pestaña nueva en su panel, la de "Servicios". Ahi aparece el resumen de las tareas de todo el personal del dia (cuantas se programaron, cuantas van completadas, cuantas en progreso y cuantas sin atender), el avance de cada trabajador con su barrita de progreso y un aviso si todavia hay tareas pendientes de atender. Tambien puede entrar al detalle de cada trabajador y ver sus tareas una por una (incluso con la hora de la ultima actualizacion, por si las dudas). Es una vista de supervision nada mas, el admin no crea ni edita tareas: las plantillas del seed son las que mandan, los trabajadores son los que las van marcando.

---

## Como usarlo

No necesitas instalar nada. Solo abres index.html en el navegador y ya. Si usas VS Code, Live Server funciona bien. Si abres el archivo directo desde el explorador de archivos tambien funciona.

### Cuentas de prueba

Todos los usuarios estan definidos en data/seed.js. Estos son los que mas vas a usar para probar:

| Rol           | Correo                                    | Contrasena  | Nota                                  |
|---------------|-------------------------------------------|-------------|---------------------------------------|
| Administrador | admin@insavi.edu.sv                       | admin123    | Acceso completo                       |
| Docente       | maria.garcia@insavi.edu.sv                | docente123  | Todos los docentes usan docente123    |
| Estudiante    | ana.lopez@estudiante.insavi.edu.sv        | est123      | Todos los estudiantes usan est123     |
| Padre         | jorge.lopez@padre.insavi.edu.sv           | padre123    | Tiene dos hijos registrados           |
| Servicios     | pedro.sanchez@insavi.edu.sv               | serv123     | Mantenimiento (ve sus tareas del dia) |

Hay muchos mas usuarios en el seed. Docentes como roberto.martinez, david.cornejo, sandra.molina, entre otros. Estudiantes en varias secciones (1A, 1B, 2A, 2B, 3A). Padres con distintas combinaciones de hijos. Personal de servicios como rosa.mejia (limpieza) y otro de seguridad (esos dos tambien usan serv123, por si acaso). Todos estan en data/seed.js.

### Cambiar entre cuentas

En la esquina superior derecha del dashboard hay un menu con el nombre del usuario activo. Desde ahi puedes cerrar sesion y volver al login para entrar con otra cuenta.

---

## Notas tecnicas

- No hay backend. Todo es JavaScript del lado del cliente.
- Los datos no se persisten entre recargas salvo el estado del sidebar y las tareas del dia de servicios (ambos van en localStorage). Las tareas se guardan con la fecha del dia, asi que al cambiar de dia se regeneran limpias desde las plantillas del seed.
- Si quieres agregar datos reales, edita data/seed.js siguiendo la estructura que ya esta ahi. Para tareas nuevas simplemente agregas una plantilla mas al bloque de tareas_plantillas con su cargo y su turno, y se va a aparecer solita al dia siguiente en el panel del trabajador correspondiente.
- El sistema fue desarrollado y probado en navegadores modernos (Chrome, Edge). En navegadores muy viejos puede que algunos estilos de glassmorphism no funcionen bien.

---

## Creditos

Desarrollado como proyecto academico estudiantil para el Instituto Nacional Dr. Sarbelio Navarrete.
