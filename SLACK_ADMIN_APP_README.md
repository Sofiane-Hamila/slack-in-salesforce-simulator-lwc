# Application Slack Orchestrator Admin

## Vue d'ensemble

Cette application Salesforce fournit une interface d'administration complète pour gérer et configurer les composants LWC Slack Orchestrator. Elle permet aux utilisateurs de créer, configurer et tester des conversations Slack simulées directement depuis Salesforce.

## Composants créés

### 1. Application personnalisée
- **Fichier** : `SlackOrchestratorAdmin.app-meta.xml`
- **Nom** : Slack Orchestrator Admin
- **Couleur** : Violet Slack (#4A154B)
- **Type** : Application Lightning

### 2. Onglet personnalisé
- **Fichier** : `SlackOrchestratorAdmin.tab-meta.xml`
- **Label** : Slack Admin
- **Icône** : Engrenages (Custom18: Gears)

### 3. Page Lightning (FlexiPage)
- **Fichier** : `SlackOrchestratorAdmin.flexipage-meta.xml`
- **Layout** : En-tête + 2 colonnes (principale + sidebar)
- **Composants intégrés** :
  - `conversationOrchestrator` (composant principal)
  - Texte d'aide et guide d'utilisation

### 4. Ensemble de permissions
- **Fichier** : `SlackOrchestratorAdmin.permissionset-meta.xml`
- **Nom** : Slack Orchestrator Admin Access
- **Permissions** :
  - Accès à l'application
  - Visibilité de l'onglet

### 5. Barre d'utilitaires
- **Fichier** : `SlackOrchestratorAdmin_UtilityBar.flexipage-meta.xml`
- **Fonctionnalités** : Guide rapide accessible

## Installation et déploiement

### 1. Déployer les métadonnées
```bash
# Depuis le répertoire racine du projet
sf project deploy start --source-dir force-app/main/default/applications
sf project deploy start --source-dir force-app/main/default/tabs
sf project deploy start --source-dir force-app/main/default/flexipages
sf project deploy start --source-dir force-app/main/default/permissionsets
```

### 2. Assigner les permissions
1. Aller dans **Configuration** > **Utilisateurs** > **Ensembles de permissions**
2. Trouver "Slack Orchestrator Admin Access"
3. Cliquer sur **Gérer les affectations**
4. Assigner aux utilisateurs appropriés

### 3. Accéder à l'application
1. Cliquer sur l'**App Launcher** (9 points en haut à gauche)
2. Rechercher "Slack Orchestrator Admin"
3. Cliquer sur l'application pour l'ouvrir

## Fonctionnalités

### Interface d'administration
- **Configuration de conversations** : Interface pour créer et modifier des scénarios
- **Simulation en temps réel** : Test des conversations configurées
- **Sauvegarde automatique** : Les configurations sont sauvegardées dans le localStorage
- **Gestion des mots-clés** : Définition de déclencheurs pour les réponses automatiques

### Guide d'utilisation intégré
1. **Configuration** : Utilisez le configurateur pour créer vos scénarios
2. **Mots-clés** : Définissez des mots-clés pour déclencher des réponses
3. **Test** : Lancez le simulateur pour tester vos conversations
4. **Sauvegarde** : Vos configurations sont automatiquement sauvegardées

## Structure des composants LWC

L'application utilise les composants LWC existants :

- **conversationOrchestrator** : Composant principal qui orchestre les interactions
- **conversationConfigurator** : Interface de configuration des scénarios
- **slackSimulator** : Simulateur d'interface Slack

## Personnalisation

### Modifier l'apparence
- Éditer `SlackOrchestratorAdmin.app-meta.xml` pour changer les couleurs
- Modifier `SlackOrchestratorAdmin.flexipage-meta.xml` pour ajuster la mise en page

### Ajouter des fonctionnalités
- Créer de nouveaux composants LWC
- Les ajouter à la FlexiPage
- Mettre à jour les permissions si nécessaire

## Dépannage

### L'application n'apparaît pas dans l'App Launcher
1. Vérifier que l'ensemble de permissions est assigné
2. Vérifier que l'utilisateur a accès à l'application
3. Actualiser la page ou se reconnecter

### Erreurs de déploiement
1. Vérifier que tous les composants LWC sont déployés
2. Vérifier la syntaxe XML des fichiers de métadonnées
3. Consulter les logs de déploiement Salesforce

## Support

Pour toute question ou problème :
1. Consulter la documentation Salesforce Lightning
2. Vérifier les logs de la console développeur
3. Tester les composants individuellement

---

**Version** : 1.0  
**Dernière mise à jour** : $(date)  
**Compatibilité** : Salesforce Lightning Experience
