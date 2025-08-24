import { LightningElement, api, wire } from 'lwc';
import getCurrentUserInfo from '@salesforce/apex/UserInfoController.getCurrentUserInfo';
// FORCE CACHE REFRESH - v2.0 - 2024

export default class SlackSimulator extends LightningElement {
    @api recordId;
    @api objectApiName;
    
    _conversationData;
    
    @api 
    get conversationData() {
        return this._conversationData;
    }
    
    set conversationData(value) {
        console.log('🎮 SlackSimulator: conversationData setter appelé avec:', value);
        this._conversationData = value;
        
        if (value) {
            console.log('🎮 SlackSimulator: Traitement des nouvelles données');
            this.processConversationData(value);
        }
    }
    
    // Propriété pour stocker le contenu du champ de saisie
    newMessageText = '';
    
    // Propriété pour stocker les données de l'utilisateur (sera remplie par @wire)
    currentUser = {
        data: {
            Name: 'Bastien GOURY',
            FullPhotoUrl: ''
        }
    };
    
    // Wire pour récupérer les vraies informations utilisateur Salesforce
    @wire(getCurrentUserInfo)
    wiredCurrentUser(result) {
        console.log('🔥 Wire getCurrentUserInfo result:', result);
        if (result.data) {
            console.log('🔥 User data received:', result.data);
            this.currentUser = {
                data: {
                    Name: result.data.Name || 'Utilisateur',
                    FullPhotoUrl: result.data.FullPhotoUrl || ''
                }
            };
            console.log('🔥 currentUser updated:', this.currentUser);
        } else if (result.error) {
            console.error('🔴 Erreur lors de la récupération des infos utilisateur:', result.error);
        }
    }
    
    // Gestionnaire d'erreur pour les avatars
    handleAvatarError(event) {
        console.log('🔴 Erreur de chargement d\'avatar pour:', event.target.alt);
        console.log('🔴 URL qui a échoué:', event.target.src);
        
        // Remplacer par un avatar SVG par défaut
        const userName = event.target.alt || 'User';
        const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const colors = ['#4A154B', '#36C5F0', '#2EB67D', '#E01E5A', '#ECB22E'];
        const colorIndex = userName.length % colors.length;
        const color = colors[colorIndex];
        
        const fallbackSvg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="${color}"/><text x="20" y="25" font-family="Arial" font-size="14" fill="white" text-anchor="middle">${initials}</text></svg>`;
        event.target.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fallbackSvg);
    }
    
    // Propriétés pour la conversation configurée
    conversationFlow = [];
    isConversationActive = false;
    lastTriggeredStep = 0;
    
    // Tableau des messages (initialement vide pour une conversation propre)
    messages = [];
    
    // Clé pour le localStorage des messages
    MESSAGES_STORAGE_KEY = 'slackSimulator_messages';
    
    // Flag pour éviter les chargements multiples
    isMessagesLoaded = false;
    
    // Flag pour éviter les déclenchements automatiques multiples
    isAutoTriggerRunning = false;
    
    // Sauvegarder les messages dans localStorage
    saveMessagesToLocalStorage() {
        try {
            const dataToSave = {
                messages: this.messages,
                conversationFlow: this.conversationFlow,  // ✅ Ajouter conversationFlow
                conversationState: {
                    isConversationActive: this.isConversationActive,
                    lastTriggeredStep: this.lastTriggeredStep
                },
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(this.MESSAGES_STORAGE_KEY, JSON.stringify(dataToSave));
            console.log('💾 Messages et conversationFlow sauvegardés dans localStorage');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde des messages:', error);
        }
    }
    
    // Charger les messages depuis localStorage
    loadMessagesFromLocalStorage() {
        try {
            console.log('📂 Tentative de chargement des messages depuis localStorage...');
            const savedData = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
            console.log('📂 Données brutes localStorage:', savedData ? 'Trouvées' : 'Aucune');
            
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                console.log('📂 Données parsées:', parsedData);
                
                if (parsedData.messages && Array.isArray(parsedData.messages)) {
                    this.messages = parsedData.messages;
                    
                    // ✅ Restaurer conversationFlow
                    if (parsedData.conversationFlow && Array.isArray(parsedData.conversationFlow)) {
                        this.conversationFlow = parsedData.conversationFlow;
                        console.log('📂 ConversationFlow restauré:', this.conversationFlow.length, 'étapes');
                    }
                    
                    if (parsedData.conversationState) {
                        this.isConversationActive = parsedData.conversationState.isConversationActive || false;
                        this.lastTriggeredStep = parsedData.conversationState.lastTriggeredStep || 0;
                        console.log('📂 État de conversation restauré:', {
                            isConversationActive: this.isConversationActive,
                            lastTriggeredStep: this.lastTriggeredStep,
                            conversationFlow: this.conversationFlow.length
                        });
                    }
                    console.log('📂 ✅ Messages et conversation chargés depuis localStorage:', this.messages.length, 'messages');
                    return true;
                } else {
                    console.log('📂 ❌ Format de données invalide dans localStorage');
                }
            } else {
                console.log('📂 ❌ Aucune donnée trouvée dans localStorage');
            }
            return false;
        } catch (error) {
            console.error('❌ Erreur lors du chargement des messages:', error);
            return false;
        }
    }
    
    // Charger conversationFlow depuis la configuration localStorage
    loadConversationFlowFromConfig() {
        try {
            console.log('📂 Tentative de chargement de conversationFlow depuis la configuration...');
            const configData = localStorage.getItem('slackSimulator_configuration');
            
            if (configData) {
                const parsedConfig = JSON.parse(configData);
                console.log('📂 Configuration trouvée:', parsedConfig);
                
                if (parsedConfig.scenarioRows && Array.isArray(parsedConfig.scenarioRows)) {
                    // Reconstituer conversationFlow à partir de scenarioRows
                    this.conversationFlow = parsedConfig.scenarioRows.map(row => ({
                        order: row.order || 1,
                        messageBody: row.messageBody || '',
                        keywords: row.keywords || '',
                        userName: row.userName || 'Système',
                        timestamp: row.timestamp || '',
                        avatarUrl: row.avatarUrl || '',
                        delay: row.delay || 0
                    }));
                    
                    console.log('📂 ✅ ConversationFlow reconstruit depuis la configuration:', this.conversationFlow.length, 'étapes');
                    return true;
                }
            }
            
            console.log('📂 ❌ Aucune configuration trouvée');
            return false;
        } catch (error) {
            console.error('❌ Erreur lors du chargement de la configuration:', error);
            return false;
        }
    }

    
    // Fonction pour mettre à jour le texte du message à chaque frappe
    handleMessageInput(event) {
        this.newMessageText = event.target.value;
    }
    
    // Fonction pour gérer la touche Entrée dans le textarea
    handleKeyDown(event) {
        // Si Ctrl+Enter ou Shift+Enter, envoyer le message
        if (event.key === 'Enter' && (event.ctrlKey || event.shiftKey)) {
            event.preventDefault();
            this.handleSendMessage();
        }
    }
    
    // Fonction pour faire défiler automatiquement vers le bas
    scrollToBottom() {
        // Utiliser setTimeout pour s'assurer que le DOM est mis à jour
        setTimeout(() => {
            const messagesArea = this.template.querySelector('.messages-area');
            if (messagesArea) {
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }
        }, 100); // Petit délai pour laisser le temps au DOM de se mettre à jour
    }
    
    // Fonction pour formater le timestamp en français
    formatTimestamp() {
        const now = new Date();
        return now.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Fonction pour récupérer l'URL de l'avatar
    getAvatarUrl(avatarUrl, userName = '') {
        try {
            console.log('🔥 getAvatarUrl called with:', { avatarUrl, userName });
            
            // Si c'est une URL Salesforce valide (commence par / ou https://), l'utiliser directement
            if (avatarUrl && avatarUrl.trim() !== '') {
                // URLs Salesforce commencent généralement par /profilephoto/ ou sont des URLs complètes
                if (avatarUrl.startsWith('/') || avatarUrl.startsWith('https://')) {
                    console.log('🔥 Using direct URL:', avatarUrl);
                    return avatarUrl;
                }
            }
            
            // Générer un avatar avec les initiales du nom
            let initials = '👤';
            let colorSeed = 'default';
            
            if (userName && userName.trim() !== '') {
                initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                colorSeed = userName;
                console.log('🔥 Generated initials from userName:', initials);
            } else if (avatarUrl && avatarUrl.trim() !== '') {
                initials = avatarUrl.substring(0, 2).toUpperCase();
                colorSeed = avatarUrl;
                console.log('🔥 Generated initials from avatarUrl:', initials);
            }
            
            // Palette de couleurs Slack
            const colors = ['#4A154B', '#36C5F0', '#2EB67D', '#E01E5A', '#ECB22E', '#FF6900', '#9B59B6'];
            const colorIndex = colorSeed.length % colors.length;
            const color = colors[colorIndex];
            
            const avatarSvg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="${color}"/><text x="20" y="25" font-family="Arial" font-size="14" fill="white" text-anchor="middle" font-weight="bold">${initials}</text></svg>`;
            const result = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(avatarSvg);
            console.log('🔥 Generated SVG avatar for:', userName);
            return result;
        } catch (error) {
            console.error('Erreur lors de la génération de l\'avatar:', error);
            // Avatar de fallback en cas d'erreur
            const fallbackSvg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#666"/><text x="20" y="25" font-family="Arial" font-size="16" fill="white" text-anchor="middle">?</text></svg>`;
            return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fallbackSvg);
        }
    }
    
    // Générer un ID unique pour les messages
    generateMessageId(suffix = '') {
        try {
            const timestamp = Date.now();
            const randomPart = Math.floor(Math.random() * 10000);
            return `msg-${timestamp}-${randomPart}-${suffix}`;
        } catch (error) {
            console.error('Erreur lors de la génération d\'ID de message:', error);
            return `msg-${new Date().getTime()}-${suffix}`;
        }
    }
    
    // Fonction principale pour envoyer un message
    handleSendMessage() {
        if (this.newMessageText.trim()) {
            const messageText = this.newMessageText;
            
            // Créer un nouvel objet message
            const userName = this.currentUser?.data?.Name || 'Bastien GOURY';
            const avatarUrl = this.currentUser?.data?.FullPhotoUrl || '';
            
            const newMessage = {
                id: this.generateMessageId('user'),
                userName: userName,
                avatarUrl: this.getAvatarUrl(avatarUrl, userName),
                messageBody: messageText,
                timestamp: this.formatTimestamp()
            };
            
            // Ajouter le nouveau message au tableau
            this.messages = [...this.messages, newMessage];
            
            // Sauvegarder automatiquement les messages
            this.saveMessagesToLocalStorage();
            
            // Vider le champ de saisie - forcer la mise à jour
            this.newMessageText = '';
            
            // Forcer la mise à jour du textarea dans le DOM
            const textarea = this.template.querySelector('textarea');
            if (textarea) {
                textarea.value = '';
            }
            
            // Faire défiler vers le bas pour voir le nouveau message
            this.scrollToBottom();
            
            // Vérifier si une étape de conversation doit être déclenchée
            // PATCH: Vérifier conversationFlow juste avant l'utilisation
            if (this.conversationFlow.length === 0) {
                console.log('🚨 PATCH: ConversationFlow vide détecté, rechargement d\'urgence...');
                this.loadConversationFlowFromConfig();
            }
            
            // ⚠️ CORRECTION : Vérifier les réponses automatiques seulement pour les messages utilisateur réels
            console.log('💬 Message utilisateur réel détecté:', messageText, '- Vérification des déclencheurs...');
            this.checkConversationFlow(messageText);
        }
    }

    // Écouter l'événement de lancement du simulateur
    connectedCallback() {
        try {
            console.log('🎮 SlackSimulator connected - DÉBUT INITIALISATION');
            console.log('🎮 SlackSimulator: this =', this);
            console.log('🎮 SlackSimulator: window =', window);
            
            // ⚠️ CORRECTION MAJEURE : Ne pas charger automatiquement les messages au démarrage
            // Les messages ne doivent apparaître que lors d'un "Save and Launch" explicite
            if (!this.isMessagesLoaded) {
                console.log('🔄 Initialisation - Vérifier s\'il y a des messages persistés');
                
                // 🔧 CORRECTION : Restaurer les messages depuis localStorage si disponibles (refresh)
                this.loadMessagesFromLocalStorage();
                this.loadConversationFlowFromConfig();
                
                if (this.messages.length > 0) {
                    console.log('📱 Messages restaurés depuis localStorage:', this.messages.length, 'messages');
                    console.log('🔄 Conversation en cours - Permettre la continuation');
                    this.isConversationActive = true;
                    this.scrollToBottom();
                } else {
                    console.log('🔄 Aucun message persisté - Interface vide');
                    this.messages = [];
                }
                
                this.isMessagesLoaded = true;
                console.log('🔄 Interface initialisée');
            } else {
                console.log('🔄 Composant déjà initialisé');
            }
            
            // ⚠️ CORRECTION RÉGRESSION : Ne pas charger automatiquement conversationFlow au démarrage
            // Cela sera fait uniquement lors du "Save and Launch"
            console.log('🔍 ConversationFlow au démarrage:', this.conversationFlow?.length || 0, 'étapes');
            console.log('🔍 Attendre le lancement explicite via Save and Launch...');
            
            console.log('🎮 SlackSimulator: Messages initialisés dans connectedCallback');
            
            // ⚠️ CORRECTION MAJEURE : Ne pas vérifier les données window au démarrage
            // Cela sera fait uniquement lors d'un lancement explicite
            console.log('🔍 Pas de vérification automatique des données window au démarrage');
            
            // Écouter l'événement window personnalisé
            this.handleSlackDataReady = this.handleSlackDataReady.bind(this);
            window.addEventListener('slackSimulatorDataReady', this.handleSlackDataReady);
            
            // Écouter l'événement de reset du simulateur
            this.handleSimulatorReset = this.handleSimulatorReset.bind(this);
            window.addEventListener('slackSimulatorReset', this.handleSimulatorReset);
            
            console.log('🎮 SlackSimulator: Écouteurs d\'événements window ajoutés');
            
            // ⚠️ SUPPRESSION : Pas de test d'événement au démarrage
            console.log('🎮 SlackSimulator: Écouteurs configurés - Attendre lancement explicite');
            
            // ⚠️ SUPPRESSION : Pas de vérification périodique au démarrage
            // Cela causait le déclenchement automatique des messages
            console.log('🔍 Pas de vérification périodique des données au démarrage');
            
        } catch (error) {
            console.error('Erreur lors de la connexion du SlackSimulator:', error);
        }
    }

    disconnectedCallback() {
        try {
            console.log('SlackSimulator disconnected');
            
            // Nettoyer l'interval
            if (this.windowDataInterval) {
                clearInterval(this.windowDataInterval);
            }
            
            // Nettoyer les écouteurs d'événements window
            if (this.handleSlackDataReady) {
                window.removeEventListener('slackSimulatorDataReady', this.handleSlackDataReady);
            }
            if (this.handleSimulatorReset) {
                window.removeEventListener('slackSimulatorReset', this.handleSimulatorReset);
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion du SlackSimulator:', error);
        }
    }
    
    // Méthode pour vérifier les données dans window
    @api
    checkForWindowData() {
        console.log('🎮 SlackSimulator: checkForWindowData appelée, window.slackSimulatorData:', window.slackSimulatorData);
        if (window.slackSimulatorData) {
            console.log('🎮 SlackSimulator: Données trouvées dans window, traitement...');
            
            // ⚠️ CORRECTION MAJEURE : Vérification très stricte du lancement explicite
            const data = window.slackSimulatorData;
            const now = Date.now();
            const dataTimestamp = data.timestamp || 0;
            const isVeryRecent = (now - dataTimestamp) < 2000; // 2 secondes seulement
            
            console.log('🎮 Vérification stricte:', {
                isExplicitLaunch: data.isExplicitLaunch,
                age: now - dataTimestamp,
                isVeryRecent: isVeryRecent
            });
            
            if (data.isExplicitLaunch && isVeryRecent) {
                console.log('🎮 ✅ Lancement explicite très récent détecté - Traitement autorisé');
                this.processConversationData(window.slackSimulatorData);
            } else {
                console.log('🎮 ❌ Données trop anciennes ou pas de lancement explicite - IGNORER');
            }
            
            delete window.slackSimulatorData; // Nettoyer
            
            // Arrêter la vérification une fois les données trouvées
            if (this.windowDataInterval) {
                clearInterval(this.windowDataInterval);
                this.windowDataInterval = null;
            }
        } else {
            console.log('🎮 Aucune donnée window trouvée');
        }
    }
    
    // Gérer l'événement window personnalisé
    handleSlackDataReady(event) {
        console.log('🎮🎮🎮 SlackSimulator: ÉVÉNEMENT REÇU !!! 🎮🎮🎮', event.detail);
        
        // Log de réception (pas de message visible dans l'interface)
        console.log('✅ Données reçues du configurateur:', event.detail);
        
        this.processConversationData(event.detail);
        
        // Arrêter la vérification périodique une fois les données reçues
        if (this.windowDataInterval) {
            clearInterval(this.windowDataInterval);
            this.windowDataInterval = null;
        }
    }

    // Traiter les données de conversation reçues via la propriété
    processConversationData(data) {
        console.log('🎮 SlackSimulator: processConversationData DÉMARRÉ');
        console.log('🎮 Data reçue:', data);
        
        // Stocker les données de conversation
        this.conversationFlow = data.conversationFlow || [];
        console.log('🎮 ConversationFlow stocké:', this.conversationFlow);
        console.log('🎮 ConversationFlow détail:', this.conversationFlow.map(s => ({order: s.order, messageBody: s.messageBody, keywords: s.keywords})));
        
        // ⚠️ VÉRIFICATION CRITIQUE : S'assurer que conversationFlow n'est pas vide
        if (!this.conversationFlow || this.conversationFlow.length === 0) {
            console.log('🚨 ConversationFlow vide détecté, tentative de rechargement...');
            this.loadConversationFlowFromConfig();
            console.log('🚨 Après rechargement, conversationFlow:', this.conversationFlow.length, 'étapes');
        }
        
        // ⚠️ CORRECTION MAJEURE : TOUJOURS vider les messages lors d'un lancement explicite
        const isExplicitLaunch = data.isExplicitLaunch || false;
        
        if (isExplicitLaunch) {
            console.log('🎮 NOUVEAU LANCEMENT EXPLICITE - Réinitialisation complète');
            this.messages = [];
            this.isAutoTriggerRunning = false; // Reset du flag de protection
            
            // Nettoyer le localStorage des messages pour éviter les conflits
            localStorage.removeItem(this.MESSAGES_STORAGE_KEY);
            console.log('🎮 Messages et localStorage nettoyés');
        } else {
            console.log('🎮 Rafraîchissement de page - Essayer de charger les messages sauvegardés');
            // Lors d'un rafraîchissement, essayer de charger les messages existants
            const hasLoadedMessages = this.loadMessagesFromLocalStorage();
            if (hasLoadedMessages) {
                console.log('🎮 Messages restaurés depuis localStorage:', this.messages.length);
                // Faire défiler vers le bas après restauration
                setTimeout(() => {
                    this.scrollToBottom();
                }, 200);
                // Pas de déclenchement automatique lors de la restauration
                return; // Sortir sans déclencher displayInitialMessages
            } else {
                console.log('🎮 Aucun message à restaurer');
            }
        }
        
        // Activer la conversation
        this.isConversationActive = true;
        
        // ⚠️ CORRECTION MAJEURE : Pour le flux automatique, commencer à 0
        if (isExplicitLaunch) {
            // Pour un nouveau lancement avec flux automatique, remettre à 0
            this.lastTriggeredStep = 0;
            console.log('🎮 Nouveau lancement - lastTriggeredStep remis à 0 pour flux automatique');
        } else {
            console.log('🎮 Rafraîchissement - lastTriggeredStep conservé:', this.lastTriggeredStep);
        }
        
        console.log('🎮 Messages initialisés:', this.messages);
        
        // Afficher les messages initiaux (sans keywords)
        console.log('🎮 Appel de displayInitialMessages...');
        this.displayInitialMessages();
        
        console.log('🎮 Messages après displayInitialMessages:', this.messages);
        console.log('🎮 SlackSimulator: processConversationData TERMINÉ AVEC SUCCÈS');
        
        // Faire défiler vers le bas après avoir chargé les messages initiaux
        this.scrollToBottom();
        
        // ⚠️ CORRECTION : Sauvegarder seulement pour les nouveaux lancements
        if (isExplicitLaunch) {
            console.log('🎮 Sauvegarde de l\'état initial pour nouveau lancement');
            this.saveMessagesToLocalStorage();
        } else {
            console.log('🎮 Pas de sauvegarde pour rafraîchissement de page');
        }
    }

    // Afficher les messages initiaux (étapes sans keywords)
    displayInitialMessages() {
        try {
            console.log('📝 displayInitialMessages - DÉBUT');
            console.log('📝 displayInitialMessages - conversationFlow:', this.conversationFlow);
            console.log('📝 displayInitialMessages - conversationFlow.length:', this.conversationFlow?.length || 0);
            
            if (!this.conversationFlow || this.conversationFlow.length === 0) {
                console.log('🚨 Aucune conversation flow à afficher - Tentative de rechargement...');
                
                // Essayer de recharger depuis la configuration
                const hasReloaded = this.loadConversationFlowFromConfig();
                console.log('🚨 Rechargement depuis config:', hasReloaded ? 'SUCCÈS' : 'ÉCHEC');
                console.log('🚨 ConversationFlow après rechargement:', this.conversationFlow?.length || 0, 'étapes');
                
                if (!this.conversationFlow || this.conversationFlow.length === 0) {
                    console.log('🚨 Impossible de charger conversationFlow, abandon');
                    return;
                }
            }
            
            // Filtrer les étapes sans keywords (messages initiaux) avec validation robuste
            const initialSteps = this.conversationFlow.filter(step => {
                if (!step) return false;
                
                // Vérifier si keywords est null, undefined, ou string vide après trim
                const hasNoKeywords = !step.keywords || 
                                     (typeof step.keywords === 'string' && step.keywords.trim() === '') ||
                                     step.keywords === null ||
                                     step.keywords === undefined;
                
                return hasNoKeywords;
            }).sort((a, b) => (a.order || 0) - (b.order || 0)); // Trier par ordre
        
        console.log('Étapes initiales trouvées:', initialSteps.length);
        console.log('Étapes initiales triées:', initialSteps.map(s => ({order: s.order, messageBody: s.messageBody})));
        
        // Afficher chaque étape initiale
        initialSteps.forEach((step, index) => {
            try {
                const message = {
                    id: this.generateMessageId(`initial-${step.order || index}`),
                    userName: step.userName || 'Système',
                    avatarUrl: this.getAvatarUrl(step.avatarUrl, step.userName || 'Système'),
                    messageBody: step.messageBody || '',
                    timestamp: step.timestamp || this.formatTimestamp(),
                    stepOrder: step.order || (index + 1) // Garder une référence à l'ordre original
                };
                
                this.messages = [...this.messages, message];
                
                // ⚠️ CORRECTION CRITIQUE : Ne pas mettre à jour lastTriggeredStep pour les messages initiaux
                // car cela empêcherait les messages avec keywords de se déclencher
                console.log('📝 Message initial ajouté (ordre:', step.order, ') - lastTriggeredStep conservé à:', this.lastTriggeredStep);
                
                // 🔄 SUPPRESSION : Éviter la duplication - le déclenchement se fera via triggerAutomaticResponses()
                console.log('📝 Message initial ajouté - déclenchement géré par triggerAutomaticResponses');
                
            } catch (error) {
                console.error('Erreur lors de l\'affichage du message initial:', error, step);
            }
        });
            
        // Trier les messages par ordre d'étape (stepOrder) pour un affichage cohérent
        this.messages.sort((a, b) => {
            const aOrder = a.stepOrder || 0;
            const bOrder = b.stepOrder || 0;
            return aOrder - bOrder;
        });
        
        console.log('📝 Messages initiaux affichés, lastTriggeredStep maintenu à:', this.lastTriggeredStep);
        console.log('📝 DEBUG - Avant appel triggerAutomaticResponses');
        console.log('📝 DEBUG - this.triggerAutomaticResponses existe:', typeof this.triggerAutomaticResponses);
        
        // 🔄 CORRECTION DUPLICATION : Un seul appel avec délai
        setTimeout(() => {
            try {
                console.log('🔄 DÉCLENCHEMENT AUTOMATIQUE - Début du processus (délai 1s)');
                this.triggerAutomaticResponses();
                console.log('🔄 DÉCLENCHEMENT AUTOMATIQUE - Appel terminé');
            } catch (error) {
                console.error('🔄 DÉCLENCHEMENT AUTOMATIQUE - Erreur:', error);
            }
        }, 1000); // Un seul appel avec délai
        
        } catch (error) {
            console.error('Erreur lors de l\'affichage des messages initiaux:', error);
        }
    }

    // 🔄 NOUVELLE MÉTHODE : Déclencher automatiquement toutes les réponses en cascade
    triggerAutomaticResponses() {
        try {
            // ⚠️ PROTECTION CONTRE LA DUPLICATION
            if (this.isAutoTriggerRunning) {
                console.log('🔄 TRIGGER AUTO - Déjà en cours, ignorer');
                return;
            }
            
            this.isAutoTriggerRunning = true;
            console.log('🔄 TRIGGER AUTO - Début du processus automatique');
            console.log('🔄 TRIGGER AUTO - conversationFlow:', this.conversationFlow?.length || 0, 'étapes');
            console.log('🔄 TRIGGER AUTO - lastTriggeredStep:', this.lastTriggeredStep);
            console.log('🔄 TRIGGER AUTO - isConversationActive:', this.isConversationActive);
            console.log('🔄 TRIGGER AUTO - messages.length:', this.messages?.length || 0);
            
            if (!this.isConversationActive) {
                console.log('🔄 TRIGGER AUTO - Conversation non active');
                return;
            }
            
            if (!this.conversationFlow || this.conversationFlow.length === 0) {
                console.log('🔄 TRIGGER AUTO - ConversationFlow vide ou inexistant');
                return;
            }

            if (!this.messages || this.messages.length === 0) {
                console.log('🔄 TRIGGER AUTO - Aucun message affiché');
                return;
            }

            // Récupérer tous les messages actuellement affichés
            const displayedMessages = this.messages.map(msg => msg.messageBody?.toLowerCase()?.trim() || '').filter(msg => msg !== '');
            console.log('🔄 TRIGGER AUTO - Messages affichés:', displayedMessages);

            // Trouver les étapes avec keywords
            const keywordSteps = this.conversationFlow.filter(step => {
                return step && step.keywords && typeof step.keywords === 'string' && step.keywords.trim() !== '';
            }).sort((a, b) => (a.order || 0) - (b.order || 0));

            console.log('🔄 TRIGGER AUTO - Étapes avec keywords:', keywordSteps.length);
            console.log('🔄 TRIGGER AUTO - Détail des étapes:', keywordSteps.map(s => ({order: s.order, keywords: s.keywords})));

            // Trouver la prochaine étape à déclencher
            const nextStep = keywordSteps.find(step => {
                const shouldTrigger = step.order > this.lastTriggeredStep;
                console.log('🔄 TRIGGER AUTO - Étape', step.order, 'shouldTrigger:', shouldTrigger, '(lastTriggeredStep:', this.lastTriggeredStep, ')');
                
                if (!shouldTrigger) return false;
                
                // Vérifier si un des messages affichés correspond aux keywords
                const matchingMessage = displayedMessages.find(messageText => {
                    const keywordMatch = this.checkKeywordsMatch(step.keywords, messageText);
                    console.log('🔄 TRIGGER AUTO - Test message "' + messageText + '" vs keywords "' + step.keywords + '":', keywordMatch);
                    return keywordMatch;
                });
                
                return !!matchingMessage;
            });

            if (nextStep) {
                console.log('✅ TRIGGER AUTO - Match trouvé pour étape:', nextStep.order, 'message:', nextStep.messageBody);
                
                // 🔧 CORRECTION MAJEURE : Utiliser le délai configuré au lieu de déclencher immédiatement
                const configuredDelay = (nextStep.delay || 0) * 1000; // Convertir secondes en millisecondes
                console.log('⏰ TRIGGER AUTO - Délai configuré:', nextStep.delay, 'secondes =', configuredDelay, 'ms');
                
                setTimeout(() => {
                    this.addAutomaticResponse(nextStep);
                    this.lastTriggeredStep = nextStep.order;
                    this.saveMessagesToLocalStorage();
                    
                    console.log('✅ TRIGGER AUTO - Message affiché après délai, lastTriggeredStep mis à jour:', this.lastTriggeredStep);
                    
                    // Programmer le prochain cycle avec un délai minimal
                    setTimeout(() => {
                        this.isAutoTriggerRunning = false; // Permettre un nouveau cycle
                        this.triggerAutomaticResponses();
                    }, 500); // Délai minimal pour éviter les conflits
                    
                }, configuredDelay); // Utiliser le délai configuré
                
            } else {
                console.log('🔄 TRIGGER AUTO - Aucune étape suivante trouvée - Arrêt de la cascade');
                this.isAutoTriggerRunning = false; // Libérer le flag
            }
            
        } catch (error) {
            console.error('🔄 TRIGGER AUTO - Erreur:', error);
            this.isAutoTriggerRunning = false; // Libérer le flag en cas d'erreur
        }
    }

    // Vérifier si un message déclenche une étape de conversation
    checkConversationFlow(messageText) {
        console.log('🔍 checkConversationFlow appelé avec:', messageText);
        console.log('🔍 isConversationActive:', this.isConversationActive);
        console.log('🔍 conversationFlow:', this.conversationFlow);
        console.log('🔍 lastTriggeredStep:', this.lastTriggeredStep);
        
        // Vérification détaillée des conditions
        console.log('🔍 Vérification des conditions:');
        console.log('🔍 - isConversationActive:', this.isConversationActive, typeof this.isConversationActive);
        console.log('🔍 - conversationFlow.length:', this.conversationFlow.length);
        console.log('🔍 - conversationFlow:', this.conversationFlow);
        
        if (!this.isConversationActive) {
            console.log('❌ Conversation non active (isConversationActive = false)');
            return;
        }
        
        if (this.conversationFlow.length === 0) {
            console.log('❌ ConversationFlow vide (length = 0)');
            return;
        }
        
        console.log('✅ Conditions validées, poursuite du traitement...');

        const messageLower = messageText.toLowerCase().trim();
        
        // ⚠️ CORRECTION : Chercher TOUTES les étapes avec keywords, pas seulement celles avec order > lastTriggeredStep
        // Car le problème peut venir du fait que lastTriggeredStep est mal géré
        const keywordSteps = this.conversationFlow.filter(step => {
            if (!step) return false;
            
            // Vérifier que l'étape a des keywords valides
            const hasValidKeywords = step.keywords && 
                                   typeof step.keywords === 'string' && 
                                   step.keywords.trim() !== '';
            
            return hasValidKeywords;
        }).sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log('🔍 Toutes les étapes avec keywords:', keywordSteps.length);
        console.log('🔍 Étapes avec keywords:', keywordSteps.map(s => ({
            order: s.order, 
            keywords: s.keywords, 
            messageBody: s.messageBody.substring(0, 50) + '...'
        })));

        // Trouver la prochaine étape à déclencher (première étape non encore déclenchée)
        const nextStep = keywordSteps.find(step => {
            const shouldTrigger = step.order > this.lastTriggeredStep;
            console.log('🔍 Étape', step.order, 'shouldTrigger:', shouldTrigger, '(lastTriggeredStep:', this.lastTriggeredStep, ')');
            return shouldTrigger;
        });

        if (!nextStep) {
            console.log('🔍 Aucune étape suivante à déclencher trouvée');
            return;
        }

        console.log('🔍 Prochaine étape à vérifier:', nextStep);
        console.log('🔍 Vérification des keywords "' + nextStep.keywords + '" dans "' + messageText + '"');
        
        // Vérifier si le message correspond aux keywords de la prochaine étape
        if (this.checkKeywordsMatch(nextStep.keywords, messageLower)) {
            console.log('✅ Match trouvé pour l\'étape:', nextStep.order, 'avec les mots-clés:', nextStep.keywords);
            
            // Déclencher la réponse automatique après le délai
            setTimeout(() => {
                this.addAutomaticResponse(nextStep);
            }, (nextStep.delay || 0) * 1000);
            
            // Mettre à jour le dernier step déclenché
            this.lastTriggeredStep = nextStep.order;
            
            // Sauvegarder immédiatement l'état mis à jour
            this.saveMessagesToLocalStorage();
            console.log('💾 État de conversation sauvegardé, lastTriggeredStep:', this.lastTriggeredStep);
        } else {
            console.log('❌ Aucun match trouvé pour l\'étape:', nextStep.order);
            console.log('❌ Keywords attendus:', nextStep.keywords);
            console.log('❌ Message reçu:', messageText);
        }
    }

    // 🔄 NOUVELLE MÉTHODE : Vérifier les déclenchements pour les messages initiaux
    checkConversationFlowForInitialMessage(messageText) {
        console.log('🔄 checkConversationFlowForInitialMessage appelé avec:', messageText);
        console.log('🔄 lastTriggeredStep actuel:', this.lastTriggeredStep);
        
        // Utiliser la même logique que checkConversationFlow mais avec un flag différent
        if (!this.isConversationActive || this.conversationFlow.length === 0) {
            console.log('🔄 Conditions non remplies pour les messages initiaux');
            return;
        }

        const messageLower = messageText.toLowerCase().trim();
        
        // Chercher les étapes avec keywords qui peuvent être déclenchées
        const keywordSteps = this.conversationFlow.filter(step => {
            if (!step) return false;
            
            const hasValidKeywords = step.keywords && 
                                   typeof step.keywords === 'string' && 
                                   step.keywords.trim() !== '';
            
            return hasValidKeywords;
        }).sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log('🔄 Étapes avec keywords pour messages initiaux:', keywordSteps.length);
        console.log('🔄 Étapes disponibles:', keywordSteps.map(s => ({order: s.order, keywords: s.keywords, messageBody: s.messageBody.substring(0, 30)})));

        // Trouver la prochaine étape à déclencher
        console.log('🔄 RECHERCHE - lastTriggeredStep actuel:', this.lastTriggeredStep);
        console.log('🔄 RECHERCHE - Étapes avec keywords disponibles:', keywordSteps.map(s => s.order));
        
        const nextStep = keywordSteps.find(step => {
            const shouldTrigger = step.order > this.lastTriggeredStep;
            console.log('🔄 RECHERCHE - Étape', step.order, 'shouldTrigger:', shouldTrigger, '(lastTriggeredStep:', this.lastTriggeredStep, ')');
            return shouldTrigger;
        });
        
        console.log('🔄 RECHERCHE - Prochaine étape trouvée:', nextStep ? nextStep.order : 'AUCUNE');

        if (!nextStep) {
            console.log('🔄 Aucune étape suivante pour message initial');
            console.log('🔄 lastTriggeredStep:', this.lastTriggeredStep, 'vs étapes disponibles:', keywordSteps.map(s => s.order));
            return;
        }

        console.log('🔄 Prochaine étape à vérifier pour message initial:', nextStep);
        console.log('🔄 Keywords à matcher:', nextStep.keywords, 'dans:', messageText);
        
        if (this.checkKeywordsMatch(nextStep.keywords, messageLower)) {
            console.log('✅ Match trouvé pour message initial - étape:', nextStep.order);
            
            // Déclencher la réponse automatique après le délai
            setTimeout(() => {
                this.addAutomaticResponse(nextStep);
                
                // 🔄 NOUVEAU : Vérifier si cette réponse peut déclencher une autre réponse (cascade)
                setTimeout(() => {
                    this.checkConversationFlowForInitialMessage(nextStep.messageBody);
                }, 300); // Petit délai pour la cascade
                
            }, (nextStep.delay || 0) * 1000);
            
            // Mettre à jour le dernier step déclenché
            this.lastTriggeredStep = nextStep.order;
            this.saveMessagesToLocalStorage();
            console.log('💾 lastTriggeredStep mis à jour depuis message initial:', this.lastTriggeredStep);
        } else {
            console.log('❌ Aucun match pour message initial');
        }
    }

    // Vérifier si tous les mots-clés sont présents (logique ET)
    checkKeywordsMatch(keywords, messageLower) {
        try {
            // Validation robuste des keywords
            if (!keywords || 
                typeof keywords !== 'string' || 
                keywords.trim() === '') {
                console.log('🔍 Keywords invalides:', keywords);
                return false;
            }
            
            // Validation du message
            if (!messageLower || typeof messageLower !== 'string') {
                console.log('🔍 Message invalide:', messageLower);
                return false;
            }
            
            // Séparer les mots-clés par virgule et nettoyer
            const keywordList = keywords.split(',')
                .map(keyword => keyword.trim().toLowerCase())
                .filter(keyword => keyword.length > 0); // Enlever les keywords vides
            
            // Si aucun keyword valide, retourner false
            if (keywordList.length === 0) {
                console.log('🔍 Aucun keyword valide trouvé');
                return false;
            }
            
            console.log('🔍 Keywords à vérifier:', keywordList);
            console.log('🔍 Message à analyser:', messageLower);
            
            // Vérifier que TOUS les mots-clés sont présents (logique ET)
            const matchResults = keywordList.map(keyword => {
                const isPresent = messageLower.includes(keyword);
                console.log('🔍 Keyword "' + keyword + '" présent:', isPresent);
                return isPresent;
            });
            
            const allKeywordsPresent = matchResults.every(result => result);
            
            console.log('🔍 Résultat final - Tous les mots-clés présents:', allKeywordsPresent);
            console.log('🔍 Détail des matches:', keywordList.map((kw, i) => `"${kw}": ${matchResults[i]}`));
            
            return allKeywordsPresent;
        } catch (error) {
            console.error('🔍 Erreur lors de la vérification des keywords:', error);
            return false;
        }
    }

    // Ajouter une réponse automatique
    addAutomaticResponse(step) {
        try {
            const autoMessage = {
                id: this.generateMessageId('auto'),
                userName: step.userName || 'Assistant',
                avatarUrl: this.getAvatarUrl(step.avatarUrl, step.userName || 'Assistant'),
                messageBody: step.messageBody || '',
                timestamp: step.timestamp || this.formatTimestamp()
            };
            
            this.messages = [...this.messages, autoMessage];
            console.log('Réponse automatique ajoutée:', autoMessage);
            
            // Sauvegarder automatiquement les messages
            this.saveMessagesToLocalStorage();
            
            // 🔧 CORRECTION : Déclencher une vérification automatique après ajout du message
            // Cela permet de continuer la chaîne automatique si ce message contient des mots-clés
            setTimeout(() => {
                console.log('🔄 Vérification automatique après ajout de réponse:', autoMessage.messageBody);
                this.checkConversationFlow(autoMessage.messageBody);
            }, 100); // Petit délai pour s'assurer que le message est bien ajouté
            
            // Faire défiler vers le bas pour voir la réponse automatique
            this.scrollToBottom();
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la réponse automatique:', error);
        }
    }
    
    // Gérer l'événement de reset du simulateur
    handleSimulatorReset(event) {
        try {
            console.log('🔄 Reset Simulator - Événement reçu:', event.detail);
            
            // Réinitialiser les messages (vider la conversation)
            this.messages = [];
            
            // Réinitialiser l'état de la conversation
            this.isConversationActive = false;
            this.lastTriggeredStep = 0;
            
            // Vider le champ de saisie
            this.newMessageText = '';
            const textarea = this.template.querySelector('textarea');
            if (textarea) {
                textarea.value = '';
            }
            
            // Nettoyer les données de conversation (optionnel - garde la config mais reset l'état)
            // this.conversationFlow = []; // Décommenté si vous voulez aussi vider la config
            
            // Nettoyer le localStorage des messages
            localStorage.removeItem(this.MESSAGES_STORAGE_KEY);
            
            console.log('🔄 Simulateur réinitialisé avec succès');
            
        } catch (error) {
            console.error('🔴 Erreur lors du reset du simulateur:', error);
        }
    }

}
