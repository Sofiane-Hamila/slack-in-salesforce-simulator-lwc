# 🚀 Guide d'Utilisation - Slack Simulator avec Conversation Configurée

## 📋 Vue d'Ensemble

Le composant `slackSimulator` a été mis à jour pour fonctionner avec la nouvelle logique de conversation simplifiée. Il peut maintenant recevoir des configurations de conversation depuis le `conversationConfigurator` et simuler des conversations automatisées.

## 🔌 Intégration avec Conversation Configurator

### Flux de Données
1. **Configuration** : L'utilisateur configure un scénario dans `conversationConfigurator`
2. **Lancement** : Clic sur "Sauvegarder et Lancer le Simulateur Slack"
3. **Réception** : Le simulateur reçoit l'événement `launchsimulator`
4. **Initialisation** : Affichage des messages initiaux et activation de la conversation
5. **Interaction** : L'utilisateur peut taper des messages et déclencher des réponses automatiques

### Structure des Données Reçues
```json
{
  "conversationFlow": [
    {
      "order": 1,
      "messageBody": "Bonjour ! Comment puis-je vous aider ?",
      "keywords": "",
      "userName": "Support Bot",
      "timestamp": "30/07/2025 15:56:00",
      "avatarStaticResourceName": "support_bot_avatar",
      "delay": 0
    }
  ]
}
```

## 🎯 Logique de Fonctionnement

### 1. Initialisation Automatique
- **Messages initiaux** : Affichage immédiat des étapes sans `keywords`
- **Ordre respecté** : Les messages sont affichés selon l'ordre défini
- **Avatars dynamiques** : Construction automatique des URLs depuis les ressources statiques

### 2. Gestion des Avatars
- **URLs directes** : Utilisation directe des URLs d'images
- **Format flexible** : Support de tous types d'URLs (http://, https://, etc.)
- **Fallback intelligent** : Avatar par défaut si l'URL est vide ou invalide

### 3. Logique de Déclenchement
- **Recherche séquentielle** : Seules les étapes avec un `order` supérieur au dernier déclenché
- **Mots-clés multiples** : Logique "ET" (tous les mots-clés doivent être présents)
- **Insensible à la casse** : Recherche en minuscules
- **Délai respecté** : Affichage de la réponse après le délai spécifié

## 🎭 Exemple de Conversation

### Configuration du Scénario
```json
{
  "conversationFlow": [
    {
      "order": 1,
      "messageBody": "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider ?",
      "keywords": "",
      "userName": "Assistant IA",
      "timestamp": "",
      "avatarStaticResourceName": "assistant_avatar",
      "delay": 0
    },
    {
      "order": 2,
      "messageBody": "Je comprends que vous avez une question. Laissez-moi vous aider !",
      "keywords": "question, aide, problème",
      "userName": "Assistant IA",
      "timestamp": "",
      "avatarStaticResourceName": "assistant_avatar",
      "delay": 1.5
    },
    {
      "order": 3,
      "messageBody": "Parfait ! Voici la solution à votre problème...",
      "keywords": "solution, problème, résoudre",
      "userName": "Assistant IA",
      "timestamp": "",
      "avatarStaticResourceName": "assistant_avatar",
      "delay": 2.0
    }
  ]
}
```

### Déroulement de la Conversation
1. **Message initial** : "Bonjour ! Je suis votre assistant virtuel..." (affiché immédiatement)
2. **Utilisateur tape** : "J'ai une question sur un problème"
3. **Déclenchement** : Mots-clés "question" et "problème" détectés
4. **Réponse 1** : "Je comprends que vous avez une question..." (après 1.5 secondes)
5. **Utilisateur tape** : "Comment résoudre ce problème ?"
6. **Déclenchement** : Mots-clés "solution", "problème", "résoudre" détectés
7. **Réponse 2** : "Parfait ! Voici la solution..." (après 2.0 secondes)

## 🔧 Fonctionnalités Techniques

### Gestion des Mots-clés
- **Séparation par virgules** : "aide, support, question"
- **Logique ET** : Tous les mots-clés doivent être présents
- **Nettoyage automatique** : Suppression des espaces et conversion en minuscules
- **Recherche insensible à la casse** : "AIDE" = "aide"

### Gestion des Délais
- **Délai en secondes** : Valeur décimale supportée (ex: 1.5)
- **Timing précis** : Utilisation de `setTimeout` pour respecter les délais
- **Ordre respecté** : Les réponses s'affichent dans l'ordre des étapes

### Gestion des Avatars
- **URLs directes** : Utilisation directe des URLs d'images
- **Format flexible** : Support de tous types d'URLs (http://, https://, etc.)
- **Fallback intelligent** : Avatar par défaut si l'URL est vide ou invalide

## 📱 Interface Utilisateur

### Zone des Messages
- **Messages initiaux** : Affichage automatique des étapes sans mots-clés
- **Messages utilisateur** : Affichage des messages tapés par l'utilisateur
- **Réponses automatiques** : Affichage des réponses déclenchées par les mots-clés
- **Avatars carrés** : Format 40x40px avec coins arrondis

### Zone de Saisie
- **Barre d'outils** : Icônes pour le formatage (gras, italique, etc.)
- **Champ de texte** : Saisie des messages utilisateur
- **Bouton d'envoi** : Bouton carré vert pour envoyer les messages

## 🚀 Déploiement et Configuration

### Prérequis
1. **Composant conversationConfigurator** : Déployé et configuré
2. **Ressources statiques** : Avatars disponibles dans le dossier `staticresources`
3. **Classe Apex** : `UserInfoController` déployée et active

### Ordre de Déploiement
1. Déployer `UserInfoController.cls`
2. Déployer `conversationConfigurator`
3. Déployer `slackSimulator`
4. Ajouter les ressources statiques (logo Slack, avatars)

### Test de Fonctionnement
1. Configurer un scénario dans `conversationConfigurator`
2. Lancer le simulateur
3. Vérifier l'affichage des messages initiaux
4. Taper des messages pour tester les déclencheurs
5. Observer les réponses automatiques avec délais

## 🔍 Débogage et Logs

### Console de Développeur
Le composant génère des logs détaillés pour faciliter le débogage :
- **Lancement** : Confirmation de réception des données
- **Étapes initiales** : Nombre d'étapes affichées
- **Recherche de mots-clés** : Étapes éligibles trouvées
- **Matching** : Détail des mots-clés et résultats
- **Réponses** : Confirmation d'ajout des réponses automatiques

### Points de Contrôle
- **Événement reçu** : Vérifier que `launchsimulator` est bien émis
- **Données reçues** : Contrôler la structure du JSON dans la console
- **Messages initiaux** : Vérifier l'affichage des étapes sans mots-clés
- **Déclenchement** : Tester avec différents mots-clés
- **Délais** : Vérifier le respect des temps d'attente

## 📁 Gestion des Avatars

### Utilisation d'URLs Directes

Le composant utilise directement les URLs d'images pour les avatars, offrant une flexibilité maximale sans dépendance aux ressources statiques Salesforce.

#### Format des URLs
- **URLs complètes** : `https://example.com/avatar.png`
- **URLs relatives** : `/images/avatar.jpg`
- **Services externes** : `https://i.pravatar.cc/40?u=user1`
- **URLs locales** : `http://localhost:3000/avatars/user.jpg`

#### Types de Fichiers Supportés
- **Images** : PNG, JPG, GIF, SVG, WebP
- **Taille recommandée** : 40x40px pour les avatars carrés
- **Formats web** : Tous les formats supportés par les navigateurs

### Exemples de Configuration

#### URL Externe
```json
{
  "avatarUrl": "https://i.pravatar.cc/40?u=assistant"
}
```
→ Utilise directement : `https://i.pravatar.cc/40?u=assistant`

#### URL Locale
```json
{
  "avatarUrl": "http://localhost:3000/avatars/bot.png"
}
```
→ Utilise directement : `http://localhost:3000/avatars/bot.png`

#### Valeur Vide
```json
{
  "avatarUrl": ""
}
```
→ Utilise l'avatar par défaut : `https://i.pravatar.cc/40?u=default`

### Recommandations d'Usage

#### Pour les Avatars de Production
- **URLs HTTPS** : Plus sécurisées et fiables
- **Services stables** : Utilisez des services comme `i.pravatar.cc` ou vos propres serveurs
- **CDN** : Utilisez des CDN pour de meilleures performances
- **Fallback** : Prévoyez des alternatives en cas d'indisponibilité

#### Pour les Tests et Développement
- **URLs locales** : `http://localhost:3000/avatars/`
- **Services de test** : `https://i.pravatar.cc/40?u=test`
- **Images de placeholder** : `https://via.placeholder.com/40x40`

#### Bonnes Pratiques
- **Taille optimisée** : 40x40px pour de meilleures performances
- **Formats modernes** : Privilégiez WebP ou PNG pour la qualité
- **Compression** : Optimisez la taille des fichiers
- **Disponibilité** : Vérifiez que les URLs sont accessibles

## ✨ Prochaines Étapes Possibles

- **Validation des données** : Vérification de la cohérence des scénarios
- **Gestion d'erreurs** : Meilleure gestion des cas d'échec
- **Interface d'administration** : Gestion des conversations actives
- **Historique** : Sauvegarde des conversations simulées
- **Métriques** : Statistiques d'utilisation et de performance
- **Personnalisation** : Thèmes et styles personnalisables
