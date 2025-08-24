import { LightningElement } from 'lwc';

export default class ConversationConfigurator extends LightningElement {
    scenarioRows = [];
    isInitialized = false;
    
    // Clé pour le localStorage
    STORAGE_KEY = 'slackSimulator_configuration';
    
    get hasScenarioRows() {
        return Array.isArray(this.scenarioRows) && this.scenarioRows.length > 0;
    }
    
    // Sauvegarder la configuration dans localStorage
    saveToLocalStorage() {
        try {
            const dataToSave = {
                scenarioRows: this.scenarioRows,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
            console.log('💾 Configuration sauvegardée dans localStorage');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
        }
    }
    
    // Charger la configuration depuis localStorage
    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (parsedData.scenarioRows && Array.isArray(parsedData.scenarioRows)) {
                    this.scenarioRows = parsedData.scenarioRows;
                    console.log('📂 Configuration chargée depuis localStorage:', this.scenarioRows.length, 'lignes');
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('❌ Erreur lors du chargement:', error);
            return false;
        }
    }
    
    createEmptyRow() {
        return {
            id: this.generateId(),
            order: 1,
            messageBody: '',
            keywords: '',
            userName: '',
            timestamp: '',
            avatarUrl: '',
            delay: 0
        };
    }
    

    
    connectedCallback() {
        try {
            // Initialiser le composant de manière sécurisée
            this.initializeComponent();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du composant:', error);
        }
    }
    
    renderedCallback() {
        try {
            // S'assurer que le composant est complètement rendu
            if (!this.isInitialized && this._scenarioRows.length === 0) {
                this.initializeComponent();
            }
        } catch (error) {
            console.error('Erreur lors du rendu du composant:', error);
        }
    }
    
    initializeComponent() {
        try {
            console.log('🔄 Initialisation du composant...');
            
            // Essayer de charger la configuration sauvegardée
            const hasLoadedData = this.loadFromLocalStorage();
            
            // S'assurer que scenarioRows est un tableau valide
            if (!Array.isArray(this.scenarioRows)) {
                this.scenarioRows = [];
            }
            
            // Ajouter une première ligne par défaut seulement si aucune donnée chargée et pas déjà initialisé
            if (this.scenarioRows.length === 0 && !this.isInitialized && !hasLoadedData) {
                console.log('📝 Création d\'une ligne par défaut');
                this.addRow();
            }
            
            this.isInitialized = true;
            console.log('✅ Composant initialisé avec', this.scenarioRows.length, 'lignes');
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            // Fallback : créer un tableau vide
            this.scenarioRows = [];
            this.isInitialized = true;
        }
    }
    
    addRow() {
        try {
            const newRow = this.createEmptyRow();
            newRow.order = this.scenarioRows.length + 1;
            
            this.scenarioRows = [...this.scenarioRows, newRow];
            console.log('🔄 Row added:', newRow);
            
            // Sauvegarder automatiquement
            this.saveToLocalStorage();
        } catch (error) {
            console.error('Erreur lors de l\'ajout d\'une ligne:', error);
        }
    }
    
    generateId() {
        try {
            // Utiliser une combinaison plus sûre pour générer un ID unique
            const timestamp = Date.now().toString(36);
            const randomPart = Math.random().toString(36).substring(2, 8);
            return `${timestamp}-${randomPart}`;
        } catch (error) {
            console.error('Erreur lors de la génération d\'ID:', error);
            // Fallback simple
            return `row-${this.scenarioRows.length}-${new Date().getTime()}`;
        }
    }
    
    saveAndLaunchSimulator() {
        console.log('🚀 DÉBUT saveAndLaunchSimulator - VERSION SANS CUSTOMEEVENT');
        
        // APPROCHE DIRECTE : Accéder directement au parent
        console.log('🚀 Recherche du composant parent...');
        
        // Essayer d'accéder au parent via le DOM
        const parentElement = this.template.host.parentElement;
        console.log('🚀 Parent element:', parentElement);
        
        // Chercher l'orchestrateur
        let orchestrator = parentElement;
        while (orchestrator && !orchestrator.tagName?.toLowerCase().includes('orchestrator')) {
            orchestrator = orchestrator.parentElement;
            console.log('🚀 Recherche orchestrateur...', orchestrator?.tagName);
        }
        
        if (orchestrator) {
            console.log('🚀 Orchestrateur trouvé:', orchestrator);
            
            // Créer les données directement
            const conversationData = {
                conversationFlow: [
                    {
                        order: 1,
                        messageBody: 'Test message direct',
                        keywords: '',
                        userName: 'Direct User',
                        timestamp: this.safeFormatTimestamp(),
                        avatarUrl: '',
                        delay: 0
                    }
                ]
            };
            
            console.log('🚀 Données créées:', conversationData);
            
            // Essayer d'accéder au SlackSimulator directement
            const simulator = orchestrator.querySelector('c-slack-simulator');
            console.log('🚀 Simulateur trouvé:', simulator);
            
            if (simulator) {
                // Définir la propriété directement
                simulator.conversationData = conversationData;
                console.log('🚀 Propriété conversationData définie directement');
            }
            
        } else {
            console.log('🚀 Orchestrateur non trouvé, tentative alternative...');
            
            // Alternative : utiliser window pour communiquer avec les vraies données
            const conversationFlow = [];
            
            // Traitement des vraies données du configurateur
            const rows = this.scenarioRows || [];
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row) {
                    conversationFlow.push({
                        order: row.order || (i + 1),
                        messageBody: row.messageBody || '',
                        keywords: row.keywords || '',
                        userName: row.userName || 'User',
                        timestamp: row.timestamp || this.safeFormatTimestamp(),
                        avatarUrl: row.avatarUrl || '',
                        delay: row.delay || 0
                    });
                }
            }
            
            window.slackSimulatorData = { 
                conversationFlow,
                isExplicitLaunch: true,  // Marquer comme lancement explicite
                timestamp: Date.now()    // Timestamp pour vérifier la fraîcheur
            };
            console.log('🚀 Données stockées dans window.slackSimulatorData');
            
            // Utiliser un événement window pour notifier le simulateur
            console.log('🚀 Déclenchement d\'un événement window personnalisé...');
            window.dispatchEvent(new CustomEvent('slackSimulatorDataReady', {
                detail: { 
                    conversationFlow,
                    isExplicitLaunch: true  // Marquer comme lancement explicite
                }
            }));
            console.log('🚀 Événement slackSimulatorDataReady dispatché');
        }
        
        console.log('🚀 saveAndLaunchSimulator TERMINÉ');
    }
    
    // Méthode pour réinitialiser le simulateur
    resetSimulator() {
        try {
            console.log('🔄 Reset Simulator - DÉBUT');
            
            // Dispatcher un événement de reset vers le simulateur
            window.dispatchEvent(new CustomEvent('slackSimulatorReset', {
                detail: {
                    action: 'reset',
                    timestamp: new Date().toISOString()
                }
            }));
            
            console.log('🔄 Événement slackSimulatorReset dispatché');
            console.log('🔄 Reset Simulator - TERMINÉ');
            
        } catch (error) {
            console.error('🔴 Erreur lors du reset du simulateur:', error);
        }
    }
    
    // Méthode pour réinitialiser le configurateur
    resetConfigurator() {
        try {
            console.log('🔄 Reset Configurator - DÉBUT');
            
            // Vider toutes les données du configurateur
            this.scenarioRows = [];
            
            // Supprimer les données du localStorage
            localStorage.removeItem(this.STORAGE_KEY);
            
            // Ajouter une ligne vide par défaut pour une meilleure UX
            this.addRow();
            
            console.log('🔄 Configurateur réinitialisé avec succès');
            console.log('🔄 Reset Configurator - TERMINÉ');
            
        } catch (error) {
            console.error('🔴 Erreur lors du reset du configurateur:', error);
        }
    }
    
    formatTimestamp() {
        try {
            const now = new Date();
            return now.toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            console.error('❌ Erreur dans formatTimestamp:', error);
            return 'Erreur timestamp';
        }
    }
    
    safeFormatTimestamp() {
        try {
            const now = new Date();
            
            // Vérifier que la date est valide
            if (isNaN(now.getTime())) {
                console.warn('Date invalide, utilisation du fallback');
                return new Date().toISOString().slice(0, 19).replace('T', ' ');
            }
            
            // Essayer le formatage localisé
            try {
                return now.toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            } catch (localeError) {
                console.warn('Erreur de formatage localisé, utilisation du fallback:', localeError);
                // Fallback vers un formatage simple
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                
                return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
            }
        } catch (error) {
            console.error('❌ Erreur critique dans safeFormatTimestamp:', error);
            // Fallback ultime
            return `${Date.now()}`;
        }
    }
    
    deleteRow(event) {
        try {
            const rowId = event.currentTarget?.dataset?.rowId;
            if (!rowId) {
                console.error('ID de ligne non trouvé');
                return;
            }
            this.scenarioRows = this.scenarioRows.filter(row => row.id !== rowId);
            
            // Sauvegarder automatiquement
            this.saveToLocalStorage();
        } catch (error) {
            console.error('Erreur lors de la suppression de la ligne:', error);
        }
    }
    
    handleInputChange(event) {
        try {
            const dataset = event.currentTarget?.dataset;
            if (!dataset) {
                console.error('Dataset non disponible');
                return;
            }
            
            const { rowId, field } = dataset;
            const value = event.target?.value;
            
            if (!rowId || !field) {
                console.error('rowId ou field manquant:', { rowId, field });
                return;
            }
            
            console.log('🔄 handleInputChange:', { rowId, field, value, isEmpty: value === '' });
            
            // Validation spéciale pour le champ keywords
            let processedValue = value;
            if (field === 'keywords') {
                // S'assurer que les keywords vides sont traités correctement
                processedValue = value || ''; // Convertir null/undefined en string vide
                console.log('🔄 Keywords processing:', { original: value, processed: processedValue });
            }
            
            this.scenarioRows = this.scenarioRows.map(row => {
                if (row.id === rowId) {
                    const updatedRow = { ...row, [field]: processedValue };
                    console.log('🔄 Row updated:', updatedRow);
                    return updatedRow;
                }
                return row;
            });
            
            // Forcer un re-render si nécessaire
            if (field === 'keywords') {
                console.log('🔄 Keywords updated, current rows:', this.scenarioRows);
            }
            
            // Sauvegarder automatiquement après chaque modification
            this.saveToLocalStorage();
        } catch (error) {
            console.error('Erreur lors de la modification du champ:', error);
        }
    }
}
