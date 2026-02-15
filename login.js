/**
 * login.js – Logique de connexion (identifiants hardcodés MVP)
 * Stocke auth dans localStorage et redirige selon le rôle.
 */

(function () {
  var CREDENTIALS = {
    blogger: { username: 'blogger', password: 'blogger123', role: 'blogger' },
    admin: { username: 'admin', password: 'admin123', role: 'admin' },
  };

  function getFormElements() {
    return {
      form: document.getElementById('login-form'),
      username: document.getElementById('username'),
      password: document.getElementById('password'),
      role: document.getElementById('role'),
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    var el = getFormElements();
    if (!el.form || !el.username || !el.password || !el.role) return;

    var username = (el.username.value || '').trim();
    var password = (el.password.value || '');
    var roleValue = (el.role.value || '').trim();

    var cred = roleValue === 'admin' ? CREDENTIALS.admin : CREDENTIALS.blogger;
    if (username !== cred.username || password !== cred.password) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Erreur', text: 'Identifiant ou mot de passe incorrect.', icon: 'error', confirmButtonColor: '#1d4ed8' });
      } else {
        alert('Identifiant ou mot de passe incorrect.');
      }
      return;
    }

    var auth = {
      isLoggedIn: true,
      role: cred.role,
      username: username,
    };
    localStorage.setItem('auth', JSON.stringify(auth));

    if (cred.role === 'blogger') {
      window.location.href = 'editor.html';
    } else {
      window.location.href = 'admin.html';
    }
  }

  function init() {
    var el = getFormElements();
    if (el.form) {
      el.form.addEventListener('submit', handleSubmit);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
