public with sharing class UserInfoController {
    
    /**
     * Récupère les informations de l'utilisateur actuellement connecté
     * @return User L'objet User avec les champs Name et FullPhotoUrl
     */
    @AuraEnabled(cacheable=true)
    public static User getCurrentUserInfo() {
        try {
            // Récupérer l'ID de l'utilisateur actuellement connecté
            Id currentUserId = UserInfo.getUserId();
            
            // Requête SOQL pour récupérer les champs Name et FullPhotoUrl
            User currentUser = [
                SELECT Name, FullPhotoUrl 
                FROM User 
                WHERE Id = :currentUserId 
                LIMIT 1
            ];
            
            return currentUser;
            
        } catch (Exception e) {
            // En cas d'erreur, retourner null
            // En production, vous pourriez vouloir logger l'erreur
            System.debug('Erreur lors de la récupération des informations utilisateur: ' + e.getMessage());
            return null;
        }
    }
}
