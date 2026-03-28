# 🛍️ DJASSA EN LIGNE

*Dernière mise à jour : 8 mars 2026*


**Application Web de Vente d'Articles en Ligne**

Bienvenue sur DJASSA EN LIGNE, une plateforme e-commerce complète permettant de vendre et acheter des articles dans différentes catégories.

---

## 📋 Fonctionnalités Principales

### 1. **Catalogue de Produits**
- 15 articles répartis dans 5 catégories :
  - 👟 **Chaussures** (Nike Air Max, Adidas Ultra Boost, Puma RS-X)
  - 👔 **Complet** (Classique, Moderne, Premium)
  - ⌚ **Montres** (Sport, Élégante, Chrono)
  - 👖 **Pantalon** (Casual, Formel, Slim)
  - 👕 **Tee-shirt** (Blanc, Coloré, Premium)

### 2. **Gestion Client**

#### Inscription Client:
- Formulaire complet avec les informations :
  - Numéro
  - Prénom
  - Quartier
  - E-mail
  - Pseudo (identifiant unique)
  - Mot de passe

#### Connexion Client:
- Accès avec pseudo et mot de passe
- Affichage personnalisé après connexion

### 3. **Système de Panier**
- Ajouter/Supprimer des articles
- Visualiser le total de la commande
- Gérer les quantités

### 4. **Commandes**

#### Processus d'achat :
1. Remplir le panier
2. Valider la commande avec :
   - Prénom
   - E-mail
   - Adresse de livraison
   - Téléphone
3. Un e-mail est envoyé au marchand avec les détails
4. Le marchand valide la commande
5. Un e-mail de confirmation est envoyé au client

### 5. **Interface Marchand**

#### Connexion Marchand:
- **Email:** `marchand@djassa.com`
- **Mot de passe:** `djassa123`

#### Tableau de Bord:
- Affichage du profil (Nom, Prénom)
- Liste de toutes les commandes reçues
- Détails complets par commande :
  - Informations client
  - Articles commandés
  - Total
  - Date
  - Statut (En attente / Validée)
- Bouton pour **valider chaque commande**
- Historique complet des commandes

---

## 🔐 Identifiants de Connexion

### Pour le Marchand:
```
Email: marchand@djassa.com
Mot de passe: djassa123
```

### Créer un Compte Client:
1. Cliquez sur "Connexion"
2. Sélectionnez l'onglet "Client"
3. Cliquez sur "S'inscrire"
4. Remplissez le formulaire avec vos informations

---

## 💾 Stockage des Données

L'application utilise **localStorage** pour persister les données :
- **Panier** : Sauvegardé localement
- **Utilisateurs** : Tous les clients inscrits
- **Commandes** : Historique complet
- **Session** : Utilisateur actuellement connecté

Les données restent disponibles même après fermeture du navigateur.

---

## 📧 Système de Mails

### Emails envoyés automatiquement :

#### 1. **Commande reçue (au marchand)**
Contient :
- Identifiant de la commande
- Infos client (nom, email, téléphone, adresse)
- Détails des articles
- Montant total

#### 2. **Confirmation (au client)**
Contient :
- Confirmation de la commande
- Identifiant unique
- Montant total
- Adresse de livraison

*Note : Actuellement en mode simulation, les emails s'affichent dans la console du navigateur.*

---

## 🎨 Interface & Design

- **Design moderne** avec gradient de couleurs
- **Responsive** : Fonctionne sur tous les appareils
- **Animations fluides** pour une meilleure expérience
- **Cartes produits** avec visualisation claire
- **Thème de couleurs** :
  - 🟠 Orange primaire
  - 🔵 Bleu secondaire
  - 🟡 Jaune accent

---

## 🚀 Comment Utiliser

### 1. **Parcourir les Produits**
- Ouvrez `index.html` dans votre navigateur
- Filtrez par catégorie ou visualisez tous les produits
- Sélectionnez la quantité et ajoutez au panier

### 2. **Effectuer un Achat**
- Cliquez sur le bouton 🛒 Panier
- Vérifiez votre commande
- Remplissez vos informations
- Validez la commande

### 3. **Gérer le Commerce**
- Connectez-vous avec les identifiants marchand
- Consultez toutes les commandes reçues
- Validez chaque commande
- Un email de confirmation sera envoyé au client

---

## 📁 Structure des Fichiers

```
DJASSA EN LIGNE/
├── index.html          # Page principale (HTML)
├── script.js           # Logique JavaScript
├── style.css           # Feuille de styles
├── README.md           # Cette documentation
├── Chaussures/         # Dossier produits
├── Complet/
├── Montre/
├── Pantalon/
├── Tee-shirt/
└── style_boostrap/     # Framework Bootstrap
```

---

## 🔧 Fonctionnalités Techniques

- **JavaScript vanilla** (sans framework externe)
- **HTML5** structure sémantique
- **CSS3** avec flexbox et grid
- **LocalStorage API** pour la persistence
- **Bootstrap 5** pour les grilles responsives

---

## 📱 Responsive Design

L'application est optimisée pour :
- 📱 Téléphones (320px et +)
- 📱 Tablettes (768px et +)
- 💻 Ordinateurs (1024px et +)

---

## 🎯 Points Clés de l'Application

✅ **Gestion complète des utilisateurs**
✅ **Panier persistant** avec localStorage
✅ **Système de commandes** avec identifiants uniques
✅ **Interface marchand** avec validation des commandes
✅ **Simulation d'envoi d'emails**
✅ **Design moderne et attractif**
✅ **Navigation fluide** entre pages
✅ **Sécurité basique** avec mots de passe

---

## 🚨 Points Importants pour la Production

Pour transformer cette application en production, vous devriez :

1. **Ajouter un Backend** (Node.js, PHP, Python, etc.)
2. **Implémenter l'envoi réel d'emails** (Nodemailer, SendGrid, etc.)
3. **Utiliser une base de données** (MongoDB, MySQL, etc.)
4. **Ajouter le chiffrement** des mots de passe
5. **Implémenter des paiements** (PayPal, Stripe, etc.)
6. **Ajouter l'authentification JWT** ou sessions
7. **Valider les données côté serveur**
8. **Ajouter le HTTPS** pour la sécurité

---

## 📞 Support

Pour toute question ou suggestion, contactez l'équipe DJASSA EN LIGNE.

**Bon shopping! 🛍️**

---

*Application créée avec ❤️ pour DJASSA EN LIGNE*
