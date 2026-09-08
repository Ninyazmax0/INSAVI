const Auth = {
  login(email, password) {
    const usuario = DB.getUsuarioByEmail(email);

    if (!usuario) return { success: false, message: 'Usuario no encontrado' };
    if (usuario.password !== password) return { success: false, message: 'Contraseña incorrecta' };
    if (!usuario.activo) return { success: false, message: 'Usuario desactivado' };

    DB.setSession(usuario);

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    };
  },

  logout() {
    DB.clearSession();
    window.location.href = 'index.html';
  },

  requireAuth(allowedRoles = []) {
    const session = DB.getSession();

    if (!session || !session.activo) {
      window.location.href = 'index.html';
      return false;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(session.rol)) {
      alert('No tienes permiso para acceder a esta sección');
      window.location.href = 'dashboard.html';
      return false;
    }

    return true;
  },

  getDashboardUrl(rol) {
    const urls = {
      'admin': 'dashboard.html?view=admin',
      'docente': 'dashboard.html?view=docente',
      'estudiante': 'dashboard.html?view=estudiante',
      'padre': 'dashboard.html?view=padre',
      'servicios': 'dashboard.html?view=servicios'
    };
    return urls[rol] || 'dashboard.html';
  },

  getUserInitials(nombre) {
    if (!nombre) return '?';
    const parts = nombre.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  },

  getRolBadge(rol) {
    const badges = {
      'admin': { text: 'Administración', badgeClass: 'admin' },
      'docente': { text: 'Docente', badgeClass: 'docente' },
      'estudiante': { text: 'Estudiante', badgeClass: 'estudiante' },
      'padre': { text: 'Familia', badgeClass: 'padre' },
      'servicios': { text: 'Servicios', badgeClass: 'servicios' }
    };
    return badges[rol] || { text: rol, badgeClass: 'padre' };
  }
};

const LOGIN_BUTTON_LABEL = 'Ingresar al portal →';
const LOGIN_BUTTON_BUSY = 'Ingresando...';

function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorDiv = document.getElementById('loginError');
  const passwordError = document.getElementById('passwordError');
  const submitBtn = form.querySelector('button[type="submit"]');

  function showError(message) {
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.add('show');
    }
    const formWrap = form.closest('.login-form-wrap');
    if (formWrap) {
      formWrap.classList.remove('shake');
      void formWrap.offsetWidth;
      formWrap.classList.add('shake');
    }
  }

  function hideError() {
    if (errorDiv) errorDiv.classList.remove('show');
    if (passwordError) passwordError.textContent = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email && !password) {
      showError('Por favor completa todos los campos');
      return;
    }
    if (!email) {
      showError('Ingresa tu correo electrónico');
      emailInput.focus();
      return;
    }
    if (!password) {
      showError('Ingresa tu contraseña');
      passwordInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = LOGIN_BUTTON_BUSY;
    hideError();

    const result = Auth.login(email, password);

    if (result.success) {
      showLoginSuccess(submitBtn);
      window.setTimeout(() => {
        window.location.href = Auth.getDashboardUrl(result.user.rol);
      }, 350);
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = LOGIN_BUTTON_LABEL;
      showError(result.message);
    }
  });

  emailInput.addEventListener('input', hideError);
  passwordInput.addEventListener('input', hideError);
}

function showLoginSuccess(btn) {
  btn.textContent = 'Accediendo...';
  btn.classList.add('btn-success');
  btn.classList.remove('btn-primary');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginForm')) {
    initLoginForm();
  }
});