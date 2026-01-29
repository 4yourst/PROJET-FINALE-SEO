/**
 * app.js – Logique globale et règles métier du mini CMS
 * Chaque page n'accède qu'aux données autorisées pour son rôle.
 */

const App = {
  /** Rôles : visitor | editor | admin */
  currentRole: null,

  /** Définir le rôle de la page courante (à appeler depuis chaque HTML) */
  setRole(role) {
    this.currentRole = role;
  },

  /** Vérifier que la page courante correspond au rôle attendu */
  ensureRole(expectedRole) {
    if (this.currentRole !== expectedRole) {
      console.warn('App.ensureRole: rôle attendu', expectedRole, 'actuel', this.currentRole);
    }
    return this.currentRole === expectedRole;
  },

  /** Articles visibles par le visiteur (uniquement certified) */
  getArticlesForVisitor() {
    return CMS.getCertifiedArticles();
  },

  /** Articles soumis (pour l'admin) */
  getArticlesForAdmin() {
    return CMS.getSubmittedArticles();
  },

  /** Formater une date au format FR */
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  },

  /** Extraire un extrait du HTML (texte brut, max length) */
  getExcerpt(html, maxLength = 160) {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '…';
  },

  /** Générer un slug à partir d'un titre */
  slugify(text) {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  },

  /** Seuil de score pour autoriser la soumission (66 %) */
  getSeuilSoumission() {
    return typeof SCORING !== 'undefined' ? SCORING.SEUIL_SOUMISSION : 66;
  },

  /** Vérifier si le score permet la soumission */
  canSubmit(score) {
    return score >= this.getSeuilSoumission();
  },
};
