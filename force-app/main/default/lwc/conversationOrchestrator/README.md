# Conversation Orchestrator

## Description

Le composant `conversationOrchestrator` est un composant parent qui orchestre la communication entre le `conversationConfigurator` et le `slackSimulator`. Il permet de créer et tester des scénarios de conversation en temps réel.

## Architecture

### Composants Intégrés

1. **`conversationConfigurator`** (Colonne gauche)
   - Interface de configuration des scénarios
   - Définition des messages initiaux et des règles de conversation
   - Bouton "Sauvegarder et Lancer le Simulateur Slack"

2. **`slackSimulator`** (Colonne droite)
   - Interface de simulation Slack
   - Affichage des messages initiaux
   - Exécution automatique des règles de conversation

### Flux de Communication

```
Configurateur → Orchestrateur → Simulateur
     ↓              ↓            ↓
  Création    Transmission   Exécution
  Scénario    Événements    Conversation
```

## Utilisation

### Installation
1. Déployez tous les composants dans votre org Salesforce
2. Ajoutez le composant `conversationOrchestrator` à une page Lightning

### Workflow
1. **Configuration** : Utilisez le configurateur pour définir votre scénario
2. **Sauvegarde** : Cliquez sur "Sauvegarder et Lancer le Simulateur Slack"
3. **Test** : Le simulateur se charge automatiquement avec votre scénario
4. **Interaction** : Testez les règles de conversation en tapant des messages

## Fonctionnalités

### Messages Initiaux
- Affichage automatique au lancement du simulateur
- Configuration du nom d'utilisateur, avatar et contenu

### Règles de Conversation
- Déclenchement automatique basé sur les mots-clés
- Délais configurables pour les réponses
- Réponses personnalisées avec nom et avatar

### Interface Unifiée
- Mise en page responsive (2 colonnes sur grand écran, empilées sur mobile)
- Communication en temps réel entre les composants
- Gestion automatique des événements

## Exemple d'Utilisation

1. **Configurer un message initial** :
   - Ordre : 1
   - Message Initial : ✓
   - Type : Message
   - Contenu : "Bonjour ! Comment puis-je vous aider ?"
   - Nom d'utilisateur : "Assistant"

2. **Configurer une règle** :
   - Ordre : 2
   - Message Initial : ✗
   - Mots-clés : "aide"
   - Délai : 2
   - Contenu : "Je suis là pour vous aider !"
   - Nom d'utilisateur : "Assistant"

3. **Lancer le simulateur** :
   - Cliquer sur "Sauvegarder et Lancer le Simulateur Slack"
   - Le message initial s'affiche automatiquement
   - Taper "J'ai besoin d'aide" déclenche la réponse automatique après 2 secondes

## Support

Pour toute question ou problème, consultez la documentation des composants individuels ou contactez votre administrateur système.
