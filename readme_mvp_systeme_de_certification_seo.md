# 📘 README – MVP SYSTÈME DE CERTIFICATION SEO (VERSION SIMPLE)

⚠️ **IMPORTANT – LIRE AVANT DE DÉVELOPPER**

Ce MVP doit être développé **UNIQUEMENT avec des technologies simples**.

👉 **INTERDICTION** :
- ❌ Next.js
- ❌ Nuxt
- ❌ Frameworks full-stack
- ❌ Architecture complexe
- ❌ Base de données réelle

👉 **OBLIGATION** :
- ✅ HTML simple
- ✅ CSS (ou Flowbite / Tailwind en option)
- ✅ JavaScript vanilla
- ✅ Logique en mémoire (objets JS)

🎯 Le but est de **prouver que la logique métier fonctionne**, pas de faire une app moderne ou scalable.

---

## 1. Objectif du MVP

Ce projet est un **prototype fonctionnel (MVP)** du système de certification SEO automatisé.

Le MVP doit démontrer :
- un **workflow clair**
- un **scoring SEO fiable**
- des **règles bloquantes respectées**

👉 **Ce n’est PAS** :
- un produit final
- une application de production
- une architecture optimisée

---

## 2. Périmètre strict du MVP

### Inclus
- Workflow : **Rédacteur → Admin → Publication**
- Calcul du score SEO (15 critères, score sur 100)
- Blocage automatique si score < 66 %
- Gestion simple des rôles
- Gel SEO après publication

### Exclus (volontairement ignoré)
- Base de données
- Authentification réelle
- Sécurité
- Déploiement
- Nom de domaine
- Monitoring avancé

---

## 3. Stack technique imposée (SIMPLE)

### Front-end
- HTML (pages statiques)
- CSS ou Flowbite / Tailwind
- JavaScript vanilla

### Stockage des données
- Objets JavaScript
- Tableaux en mémoire
- Données mockées

👉 **Aucune persistance requise** (refresh = reset, c’est OK).

---

## 4. Vision Produit (simplifiée)

Créer un CMS **SEO-native** où :
- le SEO est **obligatoire**
- le score est **visible et bloquant**
- aucun article ne peut être publié sans validation

---

## 5. Rôles Utilisateurs (logique uniquement)

### 5.1 Rédacteur
- Crée / modifie un article
- Voit le score SEO en temps réel
- Ne peut pas publier
- Peut soumettre seulement si score ≥ 66 %

---

### 5.2 Admin / Expert SEO
- Accède aux articles soumis
- Audite les critères SEO
- Peut modifier les champs
- Valide ou refuse
- Publie

👉 La publication déclenche le **gel SEO**.

---

### 5.3 Visiteur
- Voit uniquement les articles certifiés

---

## 6. États d’un Article (OBLIGATOIRE)

Chaque article possède un **état unique** :

- `draft` → en cours d’édition
- `blocked` → score < 66 %
- `submittable` → score ≥ 66 %
- `submitted` → envoyé à l’admin
- `rejected` → refusé
- `certified` → publié (SEO gelé)

Les transitions doivent être **strictement respectées**.

---

## 7. Workflow Global MVP

1. Le rédacteur crée un article
2. Il remplit les champs SEO
3. Le score est recalculé à chaque modification
4. Si score < 66 % → soumission bloquée
5. Si score ≥ 66 % → soumission possible
6. L’admin audite
7. L’admin refuse OU certifie
8. Si certifié → publication + gel SEO

---

## 8. Système de Scoring SEO

### Règles
- Score total : **100 points**
- 15 critères
- 1 critère = **6,66 points**
- Critère valide = points
- Critère invalide = 0

Le score est une **somme simple**, sans pondération avancée.

---

## 9. Les 15 Critères SEO

### Structure (5)
1. Titre SEO (≤ 60 caractères + mot-clé)
2. Méta-description (120–160 caractères)
3. Un seul H1
4. ≥ 800 mots
5. Lisibilité correcte

### Sémantique (5)
6. Mot-clé principal présent
7. Champs lexicaux secondaires
8. Densité contrôlée
9. Cohérence globale
10. Sujet clair

### Technique & UX (5)
11. ≥ 3 liens internes
12. Images avec ALT
13. URL SEO-friendly
14. Temps de chargement estimé OK
15. Contenu unique

---

## 10. Interface Rédacteur (HTML SIMPLE)

### Composants minimum
- Champ titre
- Champ contenu
- Champs SEO
- Sidebar checklist
- Score numérique ou circulaire

### Comportements
- Score recalculé en JS
- Couleurs : rouge / orange / vert
- Bouton « Soumettre » désactivé si score < 66 %

---

## 11. Interface Admin (HTML SIMPLE)

### Vue principale
- Liste des articles soumis
- Score affiché

### Actions
- Refuser
- Modifier
- Certifier & publier

---

## 12. Règle de Gel SEO (CRITIQUE)

Après publication :
- Tous les champs SEO deviennent **non modifiables**
- Toute modification nécessite une **nouvelle certification**

---

## 13. Modèle de Données (JS en mémoire)

Exemple logique (pas de code imposé) :
- id
- titre
- contenu
- metaDescription
- motClePrincipal
- score
- statut
- criteres

---

## 14. Découpage des Tâches (One-shot)

### Base
- [ ] Modèle Article
- [ ] Gestion des états
- [ ] Moteur de scoring

### Rédacteur
- [ ] Formulaire HTML
- [ ] Calcul temps réel
- [ ] Blocage < 66 %

### Admin
- [ ] Liste articles soumis
- [ ] Actions validation

### Règles
- [ ] Gel SEO

---

## 15. Objectif Final

🎯 **Prouver que le système fonctionne** :
- SEO bloquant
- Workflow clair
- Logique métier solide

👉 Si c’est simple, lisible et fonctionnel : **le MVP est réussi**.

