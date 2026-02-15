/**
 * auth.js – Vérification d'accès (front-end, localStorage)
 * Utilisé par editor.html et admin.html pour protéger les pages.
 */

var Auth = {
  /** Récupérer l'objet auth depuis localStorage */
  getAuth: function () {
    try {
      var raw = localStorage.getItem('auth');
      if (!raw) return null;
      var data = JSON.parse(raw);
      return data && data.isLoggedIn && data.role && data.username ? data : null;
    } catch (e) {
      return null;
    }
  },

  /** Exiger une session blogueur ; sinon redirection vers index.html */
  requireBlogger: function () {
    var auth = this.getAuth();
    if (!auth || auth.role !== 'blogger') {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  /** Exiger une session admin ; sinon redirection vers index.html */
  requireAdmin: function () {
    var auth = this.getAuth();
    if (!auth || auth.role !== 'admin') {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  /** Déconnexion : supprimer auth et rediriger vers la page de connexion */
  logout: function () {
    localStorage.removeItem('auth');
    window.location.href = 'login.html';
  },
};
