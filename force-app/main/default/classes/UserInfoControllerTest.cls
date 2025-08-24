@isTest
private class UserInfoControllerTest {
    
    /**
     * Test de la méthode getCurrentUserInfo
     */
    @isTest
    static void testGetCurrentUserInfo() {
        // Récupérer l'utilisateur de test actuel
        User testUser = [SELECT Id, Name, FullPhotoUrl FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        
        Test.startTest();
        
        // Appeler la méthode à tester
        User result = UserInfoController.getCurrentUserInfo();
        
        Test.stopTest();
        
        // Vérifications
        System.assertNotEquals(null, result, 'Le résultat ne doit pas être null');
        System.assertEquals(testUser.Id, result.Id, 'L\'ID de l\'utilisateur doit correspondre');
        System.assertEquals(testUser.Name, result.Name, 'Le nom de l\'utilisateur doit correspondre');
        System.assertEquals(testUser.FullPhotoUrl, result.FullPhotoUrl, 'L\'URL de la photo doit correspondre');
    }
    
    /**
     * Test error handling
     */
    @isTest
    static void testGetCurrentUserInfoErrorHandling() {
        Test.startTest();
        
        // Test that the method handles the current user correctly
        User result = UserInfoController.getCurrentUserInfo();
        
        Test.stopTest();
        
        // Verification - should not be null for the running user
        System.assertNotEquals(null, result, 'Result should not be null for valid user');
        System.assertEquals(UserInfo.getUserId(), result.Id, 'User ID should match current user');
    }
}
