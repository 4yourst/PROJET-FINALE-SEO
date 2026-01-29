/**
 * scoring.js – Logique de notation SEO (15 critères, 100 points)
 * 1 critère = 6,66 points environ.
 */

const SCORING = {
  POINTS_PER_CRITERION: 100 / 15,

  /** Noms des 15 critères (Structure, Sémantique, Technique & UX) */
  CRITERES: [
    { id: 'titreSeo', label: 'Titre SEO (≤ 60 car. + mot-clé)', category: 'structure' },
    { id: 'metaDescription', label: 'Méta-description (120–160 car.)', category: 'structure' },
    { id: 'unSeulH1', label: 'Un seul H1', category: 'structure' },
    { id: 'minMots', label: '≥ 800 mots', category: 'structure' },
    { id: 'lisibilite', label: 'Lisibilité correcte', category: 'structure' },
    { id: 'motClePrincipal', label: 'Mot-clé principal présent', category: 'semantique' },
    { id: 'champsLexicaux', label: 'Champs lexicaux secondaires', category: 'semantique' },
    { id: 'densite', label: 'Densité contrôlée', category: 'semantique' },
    { id: 'coherence', label: 'Cohérence globale', category: 'semantique' },
    { id: 'sujetClair', label: 'Sujet clair', category: 'semantique' },
    { id: 'liensInternes', label: '≥ 3 liens internes', category: 'technique' },
    { id: 'imagesAlt', label: 'Images avec ALT', category: 'technique' },
    { id: 'urlSeo', label: 'URL SEO-friendly', category: 'technique' },
    { id: 'tempsChargement', label: 'Temps de chargement OK', category: 'technique' },
    { id: 'contenuUnique', label: 'Contenu unique', category: 'technique' },
  ],

  /**
   * Calcule le score SEO d'un article à partir des champs fournis.
   * @param {Object} article - { titreSeo, metaDescription, contenu, motClePrincipal, slug, ... }
   * @returns { { score: number, criteres: Object, details: Array } }
   */
  calculate(article) {
    const criteres = {};
    const details = [];
    const pts = this.POINTS_PER_CRITERION;

    const titreSeo = (article.titreSeo || '').trim();
    const meta = (article.metaDescription || '').trim();
    const contenu = (article.contenu || '').replace(/<[^>]+>/g, ' ');
    const texteComplet = (contenu + ' ' + titreSeo + ' ' + meta).trim();
    const motCle = (article.motClePrincipal || '').trim().toLowerCase();
    const slug = (article.slug || '').trim();

    // Nombre de mots (contenu seul, sans balises)
    const nbMots = (contenu || '').split(/\s+/).filter(Boolean).length;
    const nbH1 = ((article.contenu || '').match(/<h1[^>]*>/gi) || []).length;
    const nbLiensInternes = ((article.contenu || '').match(/<a\s+href=["'][^"']*["']/gi) || []).length;
    const nbImages = ((article.contenu || '').match(/<img/gi) || []).length;
    const nbImagesAvecAlt = ((article.contenu || '').match(/<img[^>]*alt\s*=\s*["'][^"']+["']/gi) || []).length;

    // 1. Titre SEO ≤ 60 caractères + mot-clé
    const okTitreSeo = titreSeo.length > 0 && titreSeo.length <= 60 && (!motCle || titreSeo.toLowerCase().includes(motCle));
    criteres.titreSeo = okTitreSeo;
    details.push({ id: 'titreSeo', ok: okTitreSeo, label: 'Titre SEO (≤ 60 car. + mot-clé)' });

    // 2. Méta-description 120–160
    const okMeta = meta.length >= 120 && meta.length <= 160;
    criteres.metaDescription = okMeta;
    details.push({ id: 'metaDescription', ok: okMeta, label: 'Méta-description (120–160 car.)' });

    // 3. Un seul H1
    const okH1 = nbH1 === 1;
    criteres.unSeulH1 = okH1;
    details.push({ id: 'unSeulH1', ok: okH1, label: 'Un seul H1' });

    // 4. ≥ 800 mots
    const okMots = nbMots >= 800;
    criteres.minMots = okMots;
    details.push({ id: 'minMots', ok: okMots, label: '≥ 800 mots' });

    // 5. Lisibilité (phrases pas trop longues : moyenne < 25 mots)
    const phrases = (contenu || '').split(/[.!?]+/).filter(Boolean);
    const motsParPhrase = phrases.length ? nbMots / phrases.length : 0;
    const okLisibilite = motsParPhrase <= 25 && phrases.length >= 3;
    criteres.lisibilite = okLisibilite;
    details.push({ id: 'lisibilite', ok: okLisibilite, label: 'Lisibilité correcte' });

    // 6. Mot-clé principal présent
    const okMotCle = !motCle || texteComplet.toLowerCase().includes(motCle);
    criteres.motClePrincipal = okMotCle;
    details.push({ id: 'motClePrincipal', ok: okMotCle, label: 'Mot-clé principal présent' });

    // 7. Champs lexicaux secondaires (au moins 2 mots du titre dans le contenu)
    const motsTitre = (article.titre || titreSeo || '').toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const motsSecondaires = motsTitre.filter(m => m !== motCle && contenu.toLowerCase().includes(m));
    const okLexical = motsSecondaires.length >= 2 || motsTitre.length < 2;
    criteres.champsLexicaux = okLexical;
    details.push({ id: 'champsLexicaux', ok: okLexical, label: 'Champs lexicaux secondaires' });

    // 8. Densité contrôlée (entre 0,5 % et 3 %)
    const densite = motCle && nbMots ? ((texteComplet.toLowerCase().split(motCle).length - 1) * motCle.length / texteComplet.length) * 100 : 0;
    const okDensite = !motCle || (densite >= 0.5 && densite <= 3);
    criteres.densite = okDensite;
    details.push({ id: 'densite', ok: okDensite, label: 'Densité contrôlée' });

    // 9. Cohérence globale (titre et meta évoquent le même sujet)
    const okCoherence = titreSeo.length > 10 && meta.length > 20;
    criteres.coherence = okCoherence;
    details.push({ id: 'coherence', ok: okCoherence, label: 'Cohérence globale' });

    // 10. Sujet clair (H1 présent et court)
    const okSujet = nbH1 === 1 && titreSeo.length >= 10;
    criteres.sujetClair = okSujet;
    details.push({ id: 'sujetClair', ok: okSujet, label: 'Sujet clair' });

    // 11. ≥ 3 liens internes
    const okLiens = nbLiensInternes >= 3;
    criteres.liensInternes = okLiens;
    details.push({ id: 'liensInternes', ok: okLiens, label: '≥ 3 liens internes' });

    // 12. Images avec ALT (toutes les images ont un alt)
    const okAlt = nbImages === 0 || nbImagesAvecAlt >= nbImages;
    criteres.imagesAlt = okAlt;
    details.push({ id: 'imagesAlt', ok: okAlt, label: 'Images avec ALT' });

    // 13. URL SEO-friendly (slug en minuscules, tirets, pas d'espaces)
    const okUrl = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length >= 5;
    criteres.urlSeo = okUrl;
    details.push({ id: 'urlSeo', ok: okUrl, label: 'URL SEO-friendly' });

    // 14. Temps de chargement OK (contenu pas démesuré pour le MVP)
    const okChargement = (article.contenu || '').length <= 50000;
    criteres.tempsChargement = okChargement;
    details.push({ id: 'tempsChargement', ok: okChargement, label: 'Temps de chargement OK' });

    // 15. Contenu unique (longueur minimale)
    const okUnique = nbMots >= 300;
    criteres.contenuUnique = okUnique;
    details.push({ id: 'contenuUnique', ok: okUnique, label: 'Contenu unique' });

    const nbOk = Object.values(criteres).filter(Boolean).length;
    const score = Math.round(nbOk * pts);

    return { score: Math.min(100, score), criteres, details };
  },

  /** Seuil minimum pour autoriser la soumission (66 %) */
  SEUIL_SOUMISSION: 66,
};
