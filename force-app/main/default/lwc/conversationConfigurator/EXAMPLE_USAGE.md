# 📖 Exemple d'Utilisation - Conversation Configurator

## 🎯 Scénario de Démonstration

Voici un exemple complet de configuration d'un scénario de conversation pour un support client automatisé.

## 📋 Configuration du Tableau

### Ligne 1 - Message de Bienvenue
- **Ordre** : 1
- **Contenu du Message** : "Bonjour ! Bienvenue dans notre canal de support. Comment puis-je vous aider aujourd'hui ?"
- **Mots-clés** : (laisser vide pour message initial)
- **Nom d'utilisateur** : "Support Bot"
- **Horodatage** : (laisser vide pour timestamp automatique)
- **URL Avatar** : "https://i.pravatar.cc/40?u=support_bot"
- **Délai** : 0

### Ligne 2 - Réponse à "Bonjour"
- **Ordre** : 2
- **Contenu du Message** : "Salut ! Ravi de vous rencontrer. Que souhaitez-vous faire ?"
- **Mots-clés** : "bonjour, salut, hello"
- **Nom d'utilisateur** : "Support Bot"
- **Horodatage** : (laisser vide)
- **URL Avatar** : "https://i.pravatar.cc/40?u=support_bot"
- **Délai** : 1.5

### Ligne 3 - Réponse à "Aide"
- **Ordre** : 3
- **Contenu du Message** : "Je peux vous aider avec plusieurs sujets : facturation, technique, commandes. Que cherchez-vous ?"
- **Mots-clés** : "aide, help, problème, question"
- **Nom d'utilisateur** : "Support Bot"
- **Horodatage** : (laisser vide)
- **URL Avatar** : "https://i.pravatar.cc/40?u=support_bot"
- **Délai** : 2.0

### Ligne 4 - Réponse à "Facturation"
- **Ordre** : 4
- **Contenu du Message** : "Pour la facturation, je peux vous aider à consulter vos factures, modifier vos informations de paiement, ou résoudre des problèmes de facturation. Que souhaitez-vous faire ?"
- **Mots-clés** : "facturation, facture, paiement, billing"
- **Nom d'utilisateur** : "Support Bot"
- **Horodatage** : (laisser vide)
- **URL Avatar** : "https://i.pravatar.cc/40?u=support_bot"
- **Délai** : 1.0

### Ligne 5 - Réponse à "Technique"
- **Ordre** : 5
- **Contenu du Message** : "Pour les questions techniques, je peux vous guider dans la configuration, résoudre des bugs, ou vous expliquer comment utiliser nos fonctionnalités. Quel est votre problème technique ?"
- **Mots-clés** : "technique, bug, erreur, configuration, problème"
- **Nom d'utilisateur** : "Support Bot"
- **Horodatage** : (laisser vide)
- **URL Avatar** : "https://i.pravatar.cc/40?u=support_bot"
- **Délai** : 1.5

### Ligne 6 - Réponse à "Merci"
- **Ordre** : 6
- **Contenu du Message** : "De rien ! N'hésitez pas à revenir si vous avez d'autres questions. Bonne journée ! 😊"
- **Mots-clés** : "merci, thanks, au revoir, bye"
- **Nom d'utilisateur** : "Support Bot"
- **Horodatage** : (laisser vide)
- **URL Avatar** : "https://i.pravatar.cc/40?u=support_bot"
- **Délai** : 1.0

## 🚀 Lancement du Simulateur

1. **Remplir toutes les lignes** selon la configuration ci-dessus
2. **Vérifier l'ordre** : de 1 à 6
3. **Cliquer sur** "Sauvegarder et Lancer le Simulateur Slack"
4. **Observer** le simulateur se lancer avec la conversation configurée

## 📊 JSON Généré

Le composant générera automatiquement ce JSON :

```json
{
  "conversationFlow": [
    {
      "order": 1,
      "messageBody": "Bonjour ! Bienvenue dans notre canal de support. Comment puis-je vous aider aujourd'hui ?",
      "keywords": "",
      "userName": "Support Bot",
      "timestamp": "30/07/2025 15:56:00",
      "avatarUrl": "https://i.pravatar.cc/40?u=support_bot",
      "delay": 0
    },
    {
      "order": 2,
      "messageBody": "Salut ! Ravi de vous rencontrer. Que souhaitez-vous faire ?",
      "keywords": "bonjour, salut, hello",
      "userName": "Support Bot",
      "timestamp": "30/07/2025 15:57:00",
      "avatarUrl": "https://i.pravatar.cc/40?u=support_bot",
      "delay": 1.5
    },
    {
      "order": 3,
      "messageBody": "Je peux vous aider avec plusieurs sujets : facturation, technique, commandes. Que cherchez-vous ?",
      "keywords": "aide, help, problème, question",
      "userName": "Support Bot",
      "timestamp": "30/07/2025 15:58:00",
      "avatarUrl": "https://i.pravatar.cc/40?u=support_bot",
      "delay": 2.0
    },
    {
      "order": 4,
      "messageBody": "Pour la facturation, je peux vous aider à consulter vos factures, modifier vos informations de paiement, ou résoudre des problèmes de facturation. Que souhaitez-vous faire ?",
      "keywords": "facturation, facture, paiement, billing",
      "userName": "Support Bot",
      "timestamp": "30/07/2025 15:59:00",
      "avatarUrl": "https://i.pravatar.cc/40?u=support_bot",
      "delay": 1.0
    },
    {
      "order": 5,
      "messageBody": "Pour les questions techniques, je peux vous guider dans la configuration, résoudre des bugs, ou vous expliquer comment utiliser nos fonctionnalités. Quel est votre problème technique ?",
      "keywords": "technique, bug, erreur, configuration, problème",
      "userName": "Support Bot",
      "timestamp": "30/07/2025 16:00:00",
      "avatarUrl": "https://i.pravatar.cc/40?u=support_bot",
      "delay": 1.5
    },
    {
      "order": 6,
      "messageBody": "De rien ! N'hésitez pas à revenir si vous avez d'autres questions. Bonne journée ! 😊",
      "keywords": "merci, thanks, au revoir, bye",
      "userName": "Support Bot",
      "timestamp": "30/07/2025 16:01:00",
      "avatarUrl": "https://i.pravatar.cc/40?u=support_bot",
      "delay": 1.0
    }
  ]
}
```

## 🎭 Test du Scénario

### Messages Initiaux
- Le message de bienvenue (ordre 1) s'affiche immédiatement

### Tests des Mots-clés
1. **Tapez "bonjour"** → Réponse après 1.5 secondes
2. **Tapez "j'ai besoin d'aide"** → Réponse après 2.0 secondes
3. **Tapez "question de facturation"** → Réponse après 1.0 seconde
4. **Tapez "problème technique"** → Réponse après 1.5 secondes
5. **Tapez "merci beaucoup"** → Réponse après 1.0 seconde

## 💡 Conseils d'Utilisation

### Mots-clés Efficaces
- **Utilisez des synonymes** : "bonjour, salut, hello"
- **Pensez aux variations** : "aide, help, problème, question"
- **Séparez par des virgules** : "facturation, facture, paiement, billing"

### Délais Optimaux
- **0 seconde** : Messages initiaux ou réponses immédiates
- **1-2 secondes** : Réponses naturelles
- **3+ secondes** : Pour simuler une réflexion

### Noms d'Utilisateur
- **Cohérence** : Utilisez le même nom pour un même bot
- **Clarté** : "Support Bot", "Assistant IA", "Help Desk"

### Ressources Statiques
- **Nommage clair** : "support_bot_avatar", "assistant_icon"
- **Format supporté** : PNG, JPG, GIF
- **Taille recommandée** : 40x40px pour les avatars carrés
