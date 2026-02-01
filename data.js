/**
 * data.js – Stockage en mémoire du mini CMS
 * Données partagées entre visitor, editor et admin via localStorage.
 */

const CMS = {
  /** Clé localStorage pour partager les données entre les pages */
  STORAGE_KEY: 'cms_articles_data',
  /** Clé séparée pour les images (évite dépassement quota localStorage sur gros base64) */
  IMAGES_KEY: 'cms_articles_images',

  /** Prochain id pour les nouveaux articles */
  nextId: 100,

  /**
   * Tous les articles (démo certifiés + soumissions + certifiés + refusés)
   * Statuts : draft | blocked | submittable | submitted | rejected | certified
   */
  articles: [],

  /** Sauvegarder en localStorage : articles sans imageData (clé principale) + images (clé séparée) */
  save() {
    if (typeof localStorage === 'undefined') return;
    try {
      const articlesForStorage = this.articles.map(function(a) {
        var rest = Object.assign({}, a);
        delete rest.imageData;
        return rest;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        articles: articlesForStorage,
        nextId: this.nextId,
      }));
      var imgObj = {};
      this.articles.forEach(function(a) {
        if (a.imageData) imgObj[a.id] = a.imageData;
      });
      try {
        localStorage.setItem(this.IMAGES_KEY, JSON.stringify(imgObj));
      } catch (imgErr) {
        console.warn('CMS.save (images):', imgErr);
      }
    } catch (e) {
      console.warn('CMS.save:', e);
    }
  },

  /** Charger depuis localStorage puis réinjecter les images */
  load() {
    if (typeof localStorage === 'undefined') return false;
    try {
      var raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (!Array.isArray(data.articles)) return false;
      this.articles = data.articles;
      this.nextId = typeof data.nextId === 'number' ? data.nextId : 100;
      var rawImg = localStorage.getItem(this.IMAGES_KEY);
      if (rawImg) {
        try {
          var imgObj = JSON.parse(rawImg);
          this.articles.forEach(function(a) {
            var data = imgObj[a.id] || imgObj[String(a.id)];
            if (data) a.imageData = data;
          });
        } catch (imgErr) {
          console.warn('CMS.load (images):', imgErr);
        }
      }
      return true;
    } catch (e) {
      console.warn('CMS.load:', e);
      return false;
    }
  },

  /** Initialisation : démo si premier chargement, sinon données localStorage */
  init() {
    if (this.articles.length > 0) return;
    if (this.load()) return;
    this.articles = this.getDemoArticles();
    this.nextId = this.articles.length > 0
      ? Math.max(...this.articles.map(a => a.id)) + 1
      : 100;
    this.save();
  },

  /** Articles de démonstration – déjà certifiés, visibles côté visiteur */
  getDemoArticles() {
    const now = new Date();
    const formatDate = (d) => d.toISOString().slice(0, 10);

    return [
      {
        id: 1,
        titre: 'Transition énergétique : les objectifs 2030 en débat',
        titreSeo: 'Transition énergétique 2030 : objectifs et débats',
        contenu: `<h1>Transition énergétique : les objectifs 2030 en débat</h1>
<p>La transition énergétique reste au cœur des politiques européennes. Les objectifs fixés pour 2030 font l'objet de vifs débats entre partisans d'une accélération et tenants d'un rythme plus mesuré.</p>
<p>Les <a href="/visitor.html">énergies renouvelables</a> progressent chaque année, tandis que le <a href="/visitor.html">nucléaire</a> divise toujours. La <a href="/visitor.html">sobriété énergétique</a> devient un pilier des scénarios.</p>
<p>Cet article fait partie de notre dossier sur la transition énergétique et les objectifs climatiques.</p>`,
        metaDescription: 'Transition énergétique et objectifs 2030 : état des lieux, débats et perspectives en Europe. Enjeux climat et énergies renouvelables.',
        motClePrincipal: 'transition énergétique',
        slug: 'transition-energetique-objectifs-2030',
        statut: 'certified',
        score: 87,
        datePublication: formatDate(now),
        dateCreation: formatDate(new Date(now - 5 * 24 * 3600 * 1000)),
        criteres: {},
        seoFrozen: true,
      },
      {
        id: 2,
        titre: 'Réforme des retraites : ce qui change en 2025',
        titreSeo: 'Réforme des retraites 2025 : ce qui change',
        contenu: `<h1>Réforme des retraites : ce qui change en 2025</h1>
<p>La réforme des retraites entre en vigueur progressivement. Voici les principaux changements attendus pour 2025 et les années suivantes.</p>
<p>L'âge légal, la durée de cotisation et les régimes spéciaux sont concernés. Consultez notre <a href="/visitor.html">guide pratique</a> et les <a href="/visitor.html">simulateurs</a> officiels.</p>
<p>Les syndicats et le gouvernement poursuivent le dialogue sur les conditions de travail et la pénibilité.</p>`,
        metaDescription: 'Réforme des retraites 2025 : âge légal, durée de cotisation, régimes spéciaux. Ce qui change pour les assurés.',
        motClePrincipal: 'réforme des retraites',
        slug: 'reforme-retraites-2025',
        statut: 'certified',
        score: 93,
        datePublication: formatDate(new Date(now - 2 * 24 * 3600 * 1000)),
        dateCreation: formatDate(new Date(now - 4 * 24 * 3600 * 1000)),
        criteres: {},
        seoFrozen: true,
      },
      {
        id: 3,
        titre: 'Intelligence artificielle : régulation européenne en place',
        titreSeo: 'IA et régulation européenne : ce qu\'il faut savoir',
        contenu: `<h1>Intelligence artificielle : régulation européenne en place</h1>
<p>Le règlement européen sur l'intelligence artificielle pose un cadre inédit. Les systèmes à haut risque seront encadrés, tandis que les usages interdits sont listés noir sur blanc.</p>
<p>Les entreprises devront se conformer progressivement. Notre <a href="/visitor.html">décryptage</a> et nos <a href="/visitor.html">analyses</a> vous aident à y voir clair.</p>
<p>Transparence, droits des personnes et supervision nationale sont au programme.</p>`,
        metaDescription: 'Régulation européenne de l\'IA : cadre, systèmes à risque, interdictions. Ce qui change pour les entreprises et les citoyens.',
        motClePrincipal: 'intelligence artificielle',
        slug: 'ia-regulation-europeenne',
        statut: 'certified',
        score: 80,
        datePublication: formatDate(new Date(now - 1 * 24 * 3600 * 1000)),
        dateCreation: formatDate(new Date(now - 3 * 24 * 3600 * 1000)),
        criteres: {},
        seoFrozen: true,
      },
      {
        id: 4,
        titre: 'Mobilité durable : les aides à l\'achat en 2025',
        titreSeo: 'Mobilité durable 2025 : aides à l\'achat vélo et véhicule',
        contenu: `<h1>Mobilité durable : les aides à l'achat en 2025</h1>
<p>Bonus vélo, prime à la conversion, leasing social… Les dispositifs pour encourager la mobilité durable évoluent en 2025.</p>
<p>Nous faisons le point sur les <a href="/visitor.html">aides vélo</a>, les <a href="/visitor.html">véhicules électriques</a> et les <a href="/visitor.html">transports en commun</a>.</p>
<p>Un dossier complet pour choisir en connaissance de cause.</p>`,
        metaDescription: 'Mobilité durable 2025 : bonus vélo, prime conversion, leasing. Toutes les aides à l\'achat pour se déplacer autrement.',
        motClePrincipal: 'mobilité durable',
        slug: 'mobilite-durable-aides-2025',
        statut: 'certified',
        score: 73,
        datePublication: formatDate(now),
        dateCreation: formatDate(new Date(now - 1 * 24 * 3600 * 1000)),
        criteres: {},
        seoFrozen: true,
      },
      {
        id: 5,
        titre: 'Santé mentale au travail : les obligations des employeurs',
        titreSeo: 'Santé mentale au travail : obligations employeurs',
        contenu: `<h1>Santé mentale au travail : les obligations des employeurs</h1>
<p>Le bien-être et la santé mentale au travail deviennent des sujets incontournables. Quelles sont les obligations légales et les bonnes pratiques pour les employeurs ?</p>
<p>Risques psychosociaux, droit à la déconnexion et <a href="/visitor.html">prévention</a> : nous décryptons les <a href="/visitor.html">textes</a> et les <a href="/visitor.html">recommandations</a> en vigueur.</p>
<p>Un sujet essentiel pour les RH et les managers.</p>`,
        metaDescription: 'Santé mentale au travail : obligations des employeurs, RPS, prévention. Ce que dit la loi et les bonnes pratiques.',
        motClePrincipal: 'santé mentale au travail',
        slug: 'sante-mentale-travail-obligations',
        statut: 'certified',
        score: 67,
        datePublication: formatDate(new Date(now - 3 * 24 * 3600 * 1000)),
        dateCreation: formatDate(new Date(now - 6 * 24 * 3600 * 1000)),
        criteres: {},
        seoFrozen: true,
      },
    ];
  },

  /** Articles visibles par le visiteur (uniquement statut certified) */
  getCertifiedArticles() {
    this.init();
    return this.articles.filter(a => a.statut === 'certified');
  },

  /** Articles soumis (pour l’admin) */
  getSubmittedArticles() {
    this.init();
    return this.articles.filter(a => a.statut === 'submitted');
  },

  /** Récupérer un article par id */
  getArticleById(id) {
    this.init();
    return this.articles.find(a => a.id === Number(id));
  },

  /** Ajouter un nouvel article (rédacteur) */
  addArticle(article) {
    this.init();
    const newArticle = {
      id: this.nextId++,
      dateCreation: new Date().toISOString().slice(0, 10),
      statut: 'draft',
      ...article,
    };
    this.articles.push(newArticle);
    this.save();
    return newArticle;
  },

  /** Mettre à jour un article (rédacteur ou admin avant certification) */
  updateArticle(id, updates) {
    this.init();
    const index = this.articles.findIndex(a => a.id === Number(id));
    if (index === -1) return null;
    const current = this.articles[index];
    if (current.seoFrozen) {
      const { titre, contenu } = updates;
      this.articles[index] = { ...current, ...(titre !== undefined && { titre }), ...(contenu !== undefined && { contenu }) };
    } else {
      this.articles[index] = { ...current, ...updates };
    }
    this.save();
    return this.articles[index];
  },

  /** Soumettre à validation (rédacteur) → statut submitted */
  submitArticle(id) {
    return this.updateArticle(id, { statut: 'submitted' });
  },

  /** Refuser (admin) → statut rejected */
  rejectArticle(id) {
    return this.updateArticle(id, { statut: 'rejected' });
  },

  /** Certifier et publier (admin) → statut certified, gel SEO */
  certifyArticle(id, finalScore, criteres) {
    const art = this.getArticleById(id);
    if (!art) return null;
    return this.updateArticle(id, {
      statut: 'certified',
      score: finalScore,
      criteres: criteres || {},
      datePublication: new Date().toISOString().slice(0, 10),
      seoFrozen: true,
    });
  },
};

// Initialisation au chargement
if (typeof window !== 'undefined') {
  CMS.init();
}
