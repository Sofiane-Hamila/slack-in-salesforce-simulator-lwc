import { LightningElement } from 'lwc';

export default class ConversationOrchestrator extends LightningElement {
    
    // Gérer l'événement de lancement du simulateur depuis le configurateur
    handleLaunchSimulator(event) {
        console.log('🎯 ConversationOrchestrator: Reçu du configurateur');
        console.log('🎯 Data:', event.detail);
        
        // Stocker les données
        this.conversationData = event.detail;
        
        // NOUVELLE APPROCHE : Utiliser les propriétés réactives
        console.log('🎯 Stockage des données pour transmission réactive');
        
        // Déclencher un re-render pour transmettre les données
        this.simulatorData = event.detail;
        console.log('🎯 simulatorData défini:', this.simulatorData);
    }
    
    // Gérer l'événement depuis le simulateur (si nécessaire)
    handleSlackSimulatorLaunch(event) {
        console.log('🎯 Événement du simulateur (ne devrait pas arriver):', event);
    }

    // Gérer l'affichage des toasts
    handleShowToast(event) {
        try {
            const { title, message, variant } = event.detail || {};
            
            // Ici vous pouvez implémenter l'affichage d'un toast
            // Pour l'instant, on utilise console.log
            console.log(`Toast: ${title || 'Sans titre'} - ${message || 'Sans message'} (${variant || 'info'})`);
        } catch (error) {
            console.error('Erreur dans handleShowToast:', error);
        }
    }
}
