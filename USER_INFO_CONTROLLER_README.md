# 🚀 UserInfoController - Classe Apex

## 📋 Description

La classe `UserInfoController` est une classe Apex utilitaire conçue pour récupérer les informations de l'utilisateur actuellement connecté dans Salesforce. Elle est optimisée pour être utilisée depuis des composants Lightning Web Components (LWC).

## 🏗️ Structure de la Classe

### Classe Principale
- **Nom** : `UserInfoController`
- **Modificateur d'accès** : `public with sharing`
- **Méthodes** : 1 méthode statique

### Méthode `getCurrentUserInfo()`

#### Caractéristiques
- **Visibilité** : `public static`
- **Annotation** : `@AuraEnabled(cacheable=true)`
- **Type de retour** : `User`
- **Paramètres** : Aucun

#### Fonctionnalités
1. **Récupération de l'ID utilisateur** : Utilise `UserInfo.getUserId()`
2. **Requête SOQL** : Récupère les champs `Name` et `FullPhotoUrl`
3. **Gestion d'erreur** : Try-catch avec retour `null` en cas d'erreur
4. **Logging** : Debug des erreurs dans les logs

#### Requête SOQL
```sql
SELECT Name, FullPhotoUrl 
FROM User 
WHERE Id = :currentUserId 
LIMIT 1
```

## 🔧 Utilisation

### Depuis un LWC
```javascript
import getCurrentUserInfo from '@salesforce/apex/UserInfoController.getCurrentUserInfo';

// Appel de la méthode
getCurrentUserInfo()
    .then(result => {
        if (result) {
            console.log('Nom:', result.Name);
            console.log('Photo:', result.FullPhotoUrl);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
```

### Depuis une autre classe Apex
```apex
User currentUser = UserInfoController.getCurrentUserInfo();
if (currentUser != null) {
    System.debug('Utilisateur: ' + currentUser.Name);
}
```

## 📁 Fichiers Créés

```
force-app/main/default/classes/
├── UserInfoController.cls              # Classe principale
├── UserInfoController.cls-meta.xml     # Métadonnées de la classe
├── UserInfoControllerTest.cls          # Classe de test
└── UserInfoControllerTest.cls-meta.xml # Métadonnées de la classe de test
```

## 🧪 Tests

### Classe de Test : `UserInfoControllerTest`

#### Méthodes de Test
1. **`testGetCurrentUserInfo()`** : Test basique avec l'utilisateur de test actuel
2. **`testGetCurrentUserInfoWithDifferentUser()`** : Test avec un utilisateur différent

#### Couverture de Test
- Test de la méthode principale
- Vérification des valeurs retournées
- Test avec différents contextes d'utilisateur
- Gestion des cas d'erreur

## ⚡ Avantages

### Performance
- **Cacheable** : `@AuraEnabled(cacheable=true)` permet la mise en cache
- **Requête optimisée** : Seulement 2 champs récupérés
- **LIMIT 1** : Garantit une seule requête

### Sécurité
- **With sharing** : Respecte les règles de partage Salesforce
- **Gestion d'erreur** : Try-catch pour éviter les crashs
- **Validation** : Vérification de l'utilisateur connecté

### Maintenabilité
- **Code simple** : Une seule responsabilité
- **Documentation** : Commentaires détaillés
- **Tests complets** : Couverture de test complète

## 🚀 Déploiement

### Prérequis
- API Version 60.0 ou supérieure
- Profil utilisateur avec accès aux objets User
- Permissions de lecture sur les champs Name et FullPhotoUrl

### Commandes de Déploiement
```bash
# Déployer la classe principale
sfdx force:source:deploy -p force-app/main/default/classes/UserInfoController.cls

# Déployer la classe de test
sfdx force:source:deploy -p force-app/main/default/classes/UserInfoControllerTest.cls

# Déployer tout le projet
sfdx force:source:deploy
```

## 🔮 Évolutions Possibles

### Fonctionnalités Futures
- Ajout de champs supplémentaires (Email, Title, etc.)
- Support des utilisateurs inactifs
- Gestion des permissions personnalisées
- Support multi-langue

### Intégrations
- Composants LWC personnalisés
- Process Builder et Flow
- Intégrations externes
- API REST personnalisée

## 📞 Support

Pour toute question ou problème avec cette classe :
1. Vérifiez les logs de debug dans la Developer Console
2. Testez avec la classe de test fournie
3. Vérifiez les permissions utilisateur
4. Consultez la documentation Salesforce sur les objets User
