# 🏃‍♀️ Suivi des Performances Sportives

Une application web moderne et intuitive pour le suivi des performances sportives dans le cadre d'entraînements de handball (catégorie U15 féminines)

## ✨ Fonctionnalités

### 📊 Gestion complète des données

- **Exercices** : Création et gestion d'exercices personnalisés
- **Joueuses** : Suivi des joueuses et de leurs progrès
- **Performances** : Enregistrement détaillé avec séries et répétitions
- **Statistiques** : Analyses avancées et graphiques de progression

### 🎯 Interface intuitive

- **Design responsive** : Optimisé pour ordinateur, tablette et mobile
- **Navigation fluide** : Onglets organisés et accessibles
- **Modals élégants** : Confirmations et messages d'état personnalisés
- **Thème sobre** : Interface professionnelle et épurée

### 📈 Analyses avancées

- **Graphiques interactifs** : Évolution des performances avec Chart.js
- **Classements** : Meilleurs scores par exercice et par joueuse
- **Statistiques détaillées** : Records personnels, moyennes, tendances
- **Vue globale** : Progression complète de chaque athlète

### 💾 Gestion des données

- **Export Excel** : Sauvegarde complète des données
- **Import Excel** : Restauration et fusion intelligente
- **Stockage local** : Données persistantes dans le navigateur
- **Reset sécurisé** : Suppression contrôlée des données

## 🚀 Installation

### Prérequis

- Navigateur web moderne
- Aucune installation serveur requise

### Démarrage rapide

1. **Téléchargez** les fichiers de l'application
2. **Ouvrez** `index.html` dans votre navigateur
3. **Commencez** à utiliser l'application immédiatement !

### Structure des fichiers

```
stats-eshb-15F/
├── index.html          # Interface principale
├── styles.css          # Styles et responsive design
├── script.js           # Logique de l'application
└── README.md           # Documentation
```

## 📱 Utilisation

### 🏋️‍♀️ Création d'exercices

1. **Onglet "Exercices"**
2. **Saisissez** le nom et l'unité de mesure
3. **Choisissez** le type de performance (temps rapide/lent, distance courte/longue)
4. **Ajoutez** une description optionnelle
5. **Créez** l'exercice

### 👥 Gestion des joueuses

1. **Onglet "Joueuses"**
2. **Saisissez** le nom de l'athlète
3. **Ajoutez** la joueuse au collectif
4. **Suivez** ses performances automatiquement

### 📊 Enregistrement des performances

1. **Onglet "Performances"**
2. **Sélectionnez** l'exercice et la joueuse
3. **Configurez** le nombre de séries et répétitions
4. **Saisissez** les résultats de chaque tentative
5. **Enregistrez** la performance

### 📈 Consultation des statistiques

1. **Onglet "Statistiques"**
2. **Choisissez** un exercice spécifique ou toutes les joueuses
3. **Consultez** les classements et graphiques
4. **Analysez** les tendances et progrès

## 🎨 Fonctionnalités avancées

### 🔄 Séries et répétitions

- **Configuration flexible** : 1-10 séries, 1-10 répétitions
- **Calcul automatique** : Meilleur score par série
- **Interface dynamique** : Génération automatique des champs
- **Résumé en temps réel** : Affichage des meilleurs scores

### 📊 Graphiques interactifs

- **Évolution temporelle** : Progression des performances
- **Comparaisons** : Meilleurs scores par date
- **Vue individuelle** : Progression par joueuse
- **Vue globale** : Toutes les performances combinées

### 💾 Export/Import Excel

- **Export complet** : 4 feuilles détaillées (Exercices, Joueuses, Performances, Résumé)
- **Import intelligent** : Fusion automatique des données
- **Détection de conflits** : Gestion des doublons
- **Aperçu avant import** : Validation des données

### 🔒 Sécurité et contrôle

- **Confirmations** : Modals pour les actions destructives
- **Reset sélectif** : Suppression par catégorie
- **Sauvegarde automatique** : Données persistantes
- **Validation** : Contrôles de saisie

## 📱 Responsive Design

#### 🖥️ Ordinateur (1025px+)

#### 📱 Tablette (769px - 1024px)

#### 📱 Mobile (481px - 768px)

#### 📱 Petit mobile (320px - 480px)

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique et accessible
- **CSS3** : Styles modernes avec Flexbox et Grid
- **JavaScript ES6+** : Logique interactive et gestion des données
- **Chart.js** : Graphiques interactifs et responsifs
- **SheetJS** : Import/Export Excel avancé
- **LocalStorage** : Persistance des données côté client

## 🎯 Cas d'usage (exemple)

### 🏃‍♀️ Entraînement de sprint

```
Session "Sprint progressif"
├── 5x Sprint 20m (2 séries)
├── 3x Sprint 40m (2 séries)
└── 1x Sprint 60m (2 séries)
```

### 🏋️‍♀️ Suivi de force

```
Session "Développé couché"
├── 8x 50kg (3 séries)
├── 6x 55kg (3 séries)
└── 4x 60kg (2 séries)
```

### 📊 Saut cloche pied G

```
Session "Saut cloche pied G"
├── 3 mètres (1er saut)
├── 2.80 mètres (2ème saut)
└── 2.60 mètres (3ème saut)
```

### 📊 Analyse de progression

- **Comparaison** des performances entre sessions
- **Identification** des points forts et faiblesses
- **Planification** d'entraînements personnalisés
- **Motivation** par visualisation des progrès

## 🔧 Personnalisation

### 📊 Métriques

- **Temps** : Secondes (sprint, endurance)
- **Distance** : Mètres, centimètres (saut, lancer)
- **Score** : Points (précision, technique)
- **Répétitions** : Nombre (force, endurance)

## 🚀 Fonctionnalités futures

- [ ] **Mode session** : Planification d'entraînements complets
- [ ] **Notifications** : Rappels et objectifs
- [ ] **Partage** : Export de rapports PDF
- [ ] **Synchronisation** : Sauvegarde cloud
- [ ] **API** : Intégration avec d'autres outils

## 📄 Licence

Ce projet est développé pour un usage interne et éducatif.

## 👥 Auteurs

Développé pour le **Savvyh** avec ❤️

---

**Version** : 1.0.0  
**Dernière mise à jour** : août 2025  
**Compatibilité** : Tous navigateurs modernes
