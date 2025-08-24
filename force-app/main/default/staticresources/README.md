# Ressource Statique - Logo Slack

## Instructions d'installation

Pour que le composant slackSimulator fonctionne correctement, vous devez ajouter le logo Slack :

1. **Téléchargez le logo Slack officiel** depuis [slack.com](https://slack.com/media-kit) ou utilisez une image PNG de votre choix

2. **Renommez l'image** en `slack_logo.png`

3. **Placez l'image** dans ce dossier (`force-app/main/default/staticresources/`)

4. **Déployez la ressource** avec votre projet Salesforce

## Alternative temporaire

Si vous n'avez pas le logo Slack, vous pouvez temporairement modifier le composant pour utiliser une URL externe ou un emoji :

```html
<!-- Remplacer la ligne img par : -->
<span style="font-size: 24px; margin-right: 8px;">💬</span>
```

## Structure attendue

```
staticresources/
├── slack_logo.resource-meta.xml
├── slack_logo.png (à ajouter)
└── README.md
```
