# 🚀 Conversation Configurator - Constructeur de Scénario de Conversation

## 📋 Description

Le composant LWC `ConversationConfigurator` est un outil de configuration permettant de créer des scénarios de conversation pour le simulateur Slack. Il offre une interface intuitive pour définir des interactions automatisées avec des mots-clés déclencheurs, des délais et des réponses personnalisées.

## 🏗️ Structure du Composant

### Interface Utilisateur
- **Tableau de configuration** : Interface tabulaire pour définir les étapes de conversation
- **7 colonnes essentielles** : Ordre, Contenu du Message, Mots-clés, Nom d'utilisateur, Horodatage, Nom Ressource Statique Avatar, Délai
- **Actions** : Ajout, suppression et modification des lignes de configuration
- **Bouton de lancement** : Sauvegarde et lancement automatique du simulateur

### Colonnes du Tableau
1. **Ordre** : Numéro d'ordre de l'étape (entier positif)
2. **Contenu du Message** : Texte du message à afficher
3. **Mots-clés** : Mots-clés déclencheurs (séparés par des virgules)
4. **Nom d'utilisateur** : Nom de l'utilisateur qui envoie le message
5. **Horodatage** : Timestamp du message (format français)
6. **URL Avatar** : URL directe de l'image d'avatar
7. **Délai** : Délai en secondes avant l'affichage de la réponse

## 🔧 Fonctionnalités

### Gestion des Lignes
- **Ajout automatique** : Nouvelle ligne avec ordre incrémental
- **Suppression** : Bouton de suppression pour chaque ligne
- **Réorganisation** : Réorganisation automatique de l'ordre après suppression
- **Validation** : Vérification des valeurs numériques (ordre et délai)

### Génération JSON
- **Structure simplifiée** : Une seule clé principale `conversationFlow`
- **Format standardisé** : 7 propriétés par objet d'étape
- **Tri automatique** : Les étapes sont triées par ordre croissant
- **Validation des types** : Conversion automatique des types (entier pour ordre, float pour délai)

### Intégration avec le Simulateur
- **Événement personnalisé** : Émission de l'événement `launchsimulator`
- **Données structurées** : Transmission du JSON de configuration
- **Feedback utilisateur** : Toast de confirmation et log dans la console

## 📊 Structure JSON Générée

### Format de Sortie
```json
{
  "conversationFlow": [
    {
      "order": 1,
      "messageBody": "Bonjour, comment puis-je vous aider ?",
      "keywords": "bonjour, aide",
      "userName": "Assistant",
      "timestamp": "30/07/2025 15:56:00",
      "avatarUrl": "https://i.pravatar.cc/40?u=assistant",
      "delay": 0
    },
    {
      "order": 2,
      "messageBody": "Je comprends votre demande",
      "keywords": "demande, question",
      "userName": "Assistant",
      "timestamp": "30/07/2025 15:57:00",
      "avatarUrl": "https://i.pravatar.cc/40?u=assistant",
      "delay": 2.5
    }
  ]
}
```

### Propriétés des Objets
- **order** : Numéro d'ordre (entier)
- **messageBody** : Contenu du message (chaîne)
- **keywords** : Mots-clés déclencheurs (chaîne, séparés par des virgules)
- **userName** : Nom de l'utilisateur (chaîne)
- **timestamp** : Horodatage (chaîne au format français)
- **avatarUrl** : URL directe de l'image d'avatar (chaîne)
- **delay** : Délai en secondes (nombre décimal)

## 🎯 Utilisation

### Configuration d'un Scénario
1. **Ajouter des lignes** : Utiliser le bouton "Ajouter une interaction"
2. **Remplir les champs** : Saisir les informations pour chaque étape
3. **Définir l'ordre** : Numéroter les étapes dans l'ordre souhaité
4. **Configurer les mots-clés** : Définir les déclencheurs (séparés par des virgules)
5. **Personnaliser les avatars** : Spécifier les ressources statiques pour les avatars
6. **Ajuster les délais** : Définir les temps d'attente entre les réponses

### Lancement du Simulateur
1. **Sauvegarder** : Cliquer sur "Sauvegarder et Lancer le Simulateur Slack"
2. **Validation** : Le composant valide et trie automatiquement les étapes
3. **Génération JSON** : Création de la structure de données simplifiée
4. **Émission d'événement** : Déclenchement automatique du simulateur
5. **Feedback** : Affichage d'un toast de confirmation

## 🔌 Intégration Technique

### Événements Émis
- **`launchsimulator`** : Contient les données de configuration
- **`showtoast`** : Affichage des messages de feedback

### Communication avec le Simulateur
- **Bubbles** : L'événement remonte dans l'arbre DOM
- **Composed** : Traverse les limites des composants
- **Detail** : Contient l'objet `conversationData` complet

## 📱 Responsive Design

Le composant s'adapte automatiquement aux différentes tailles d'écran :
- **Desktop** : Affichage complet du tableau avec toutes les colonnes
- **Tablet** : Adaptation des espacements et de la largeur
- **Mobile** : Défilement horizontal pour accéder à toutes les colonnes

## 🎨 Personnalisation

### Styles CSS
- **Classes SLDS** : Utilisation des composants Lightning Design System
- **Responsive** : Adaptation automatique aux différentes tailles d'écran
- **Thème** : Intégration avec le thème Salesforce de l'organisation

### Validation des Données
- **Types automatiques** : Conversion des chaînes en nombres selon le contexte
- **Valeurs par défaut** : Attribution automatique de valeurs par défaut
- **Tri intelligent** : Organisation automatique par ordre croissant

## ✨ Prochaines Étapes Possibles

- **Import/Export** : Sauvegarde et chargement de configurations
- **Templates** : Scénarios prédéfinis pour des cas d'usage courants
- **Validation avancée** : Vérification de la cohérence des scénarios
- **Prévisualisation** : Aperçu du scénario avant lancement
- **Historique** : Sauvegarde des configurations précédentes
- **Collaboration** : Partage de scénarios entre utilisateurs
- **Versioning** : Gestion des versions des configurations
- **Tests automatisés** : Validation automatique des scénarios
