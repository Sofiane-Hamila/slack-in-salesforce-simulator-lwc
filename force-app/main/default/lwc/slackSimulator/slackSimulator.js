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
            
            this.checkConversationFlow(messageText);
        }
    }

    // Écouter l'événement de lancement du simulateur
    connectedCallback() {
        try {
            console.log('🎮 SlackSimulator connected - DÉBUT INITIALISATION');
            console.log('🎮 SlackSimulator: this =', this);
            console.log('🎮 SlackSimulator: window =', window);
            
            // Charger les messages sauvegardés seulement si pas déjà fait
            if (!this.isMessagesLoaded) {
                console.log('🔄 Premier chargement des messages...');
                const hasLoadedMessages = this.loadMessagesFromLocalStorage();
                if (!hasLoadedMessages) {
                    this.messages = [];
                } else {
                    // Si des messages ont été chargés, faire défiler vers le bas
                    setTimeout(() => {
                        this.scrollToBottom();
                    }, 200);
                }
                this.isMessagesLoaded = true;
            } else {
                console.log('🔄 Messages déjà chargés, ignorer le rechargement');
            }
            
            // IMPORTANT: Vérifier que conversationFlow est bien chargé
            console.log('🔍 Vérification conversationFlow après chargement:', this.conversationFlow.length);
            if (this.conversationFlow.length === 0) {
                console.log('⚠️ ConversationFlow vide, tentative de chargement depuis la configuration...');
                // Essayer de charger depuis la configuration du localStorage
                this.loadConversationFlowFromConfig();
            }
            
            console.log('🎮 SlackSimulator: Messages initialisés dans connectedCallback');
            
            // Vérifier s'il y a des données en attente dans window
            this.checkForWindowData();
            
            // Écouter l'événement window personnalisé
            this.handleSlackDataReady = this.handleSlackDataReady.bind(this);
            window.addEventListener('slackSimulatorDataReady', this.handleSlackDataReady);
            
            // Écouter l'événement de reset du simulateur
            this.handleSimulatorReset = this.handleSimulatorReset.bind(this);
            window.addEventListener('slackSimulatorReset', this.handleSimulatorReset);
            
            console.log('🎮 SlackSimulator: Écouteurs d\'événements window ajoutés');
            
            // Test de l'écouteur d'événement
            console.log('🎮 SlackSimulator: Test de l\'écouteur...');
            setTimeout(() => {
                console.log('🎮 SlackSimulator: Envoi d\'un événement de test...');
                window.dispatchEvent(new CustomEvent('slackSimulatorDataReady', {
                    detail: { test: 'événement de test' }
                }));
            }, 1000);
            
            // Vérifier périodiquement pour les données (fallback)
            this.windowDataInterval = setInterval(() => {
                this.checkForWindowData();
            }, 100); // Vérifier toutes les 100ms
            
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
            
            // Vérifier si c'est un lancement explicite récent (moins de 5 secondes)
            const data = window.slackSimulatorData;
            const now = Date.now();
            const dataTimestamp = data.timestamp || 0;
            const isRecent = (now - dataTimestamp) < 5000; // 5 secondes
            
            if (data.isExplicitLaunch && isRecent) {
                console.log('🎮 Lancement explicite récent détecté, traitement des données');
                this.processConversationData(window.slackSimulatorData);
            } else {
                console.log('🎮 Données anciennes ou rafraîchissement, ignorer les données window');
            }
            
            delete window.slackSimulatorData; // Nettoyer
            
            // Arrêter la vérification une fois les données trouvées
            if (this.windowDataInterval) {
                clearInterval(this.windowDataInterval);
                this.windowDataInterval = null;
            }
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
        
        // Ne pas écraser les messages existants lors d'un rafraîchissement
        // Seulement les vider si c'est un nouveau lancement explicite
        const isExplicitLaunch = data.isExplicitLaunch || false;
        
        if (isExplicitLaunch || this.messages.length === 0) {
            console.log('🎮 Nouveau lancement explicite ou aucun message - réinitialisation');
            this.messages = [];
        } else {
            console.log('🎮 Messages existants conservés lors du rafraîchissement:', this.messages.length, 'messages');
        }
        
        // Activer la conversation
        this.isConversationActive = true;
        
        // Ne remettre lastTriggeredStep à 0 que lors d'un nouveau lancement explicite
        if (isExplicitLaunch) {
            this.lastTriggeredStep = 0;
            console.log('🎮 Nouveau lancement - lastTriggeredStep remis à 0');
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
        
        // Sauvegarder l'état final après le traitement
        this.saveMessagesToLocalStorage();
    }

    // Afficher les messages initiaux (étapes sans keywords)
    displayInitialMessages() {
        try {
            if (!this.conversationFlow || this.conversationFlow.length === 0) {
                console.log('Aucune conversation flow à afficher');
                return;
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
            });
        
        console.log('Étapes initiales trouvées:', initialSteps.length);
        
        // Afficher chaque étape initiale
        initialSteps.forEach((step, index) => {
            try {
                const message = {
                    id: this.generateMessageId(index),
                    userName: step.userName || 'Système',
                    avatarUrl: this.getAvatarUrl(step.avatarUrl, step.userName || 'Système'),
                    messageBody: step.messageBody || '',
                    timestamp: step.timestamp || this.formatTimestamp()
                    };
                
                this.messages = [...this.messages, message];
                
                // Mettre à jour le dernier step déclenché
                if (step.order > this.lastTriggeredStep) {
                    this.lastTriggeredStep = step.order;
                    console.log('📝 lastTriggeredStep mis à jour dans displayInitialMessages:', this.lastTriggeredStep);
                }
            } catch (error) {
                console.error('Erreur lors de l\'affichage du message initial:', error, step);
            }
            });
            
            // Trier les messages par ordre d'affichage (conversion en nombre pour le tri)
            this.messages.sort((a, b) => {
                const aId = typeof a.id === 'string' ? parseInt(a.id.split('-')[1]) || 0 : a.id;
                const bId = typeof b.id === 'string' ? parseInt(b.id.split('-')[1]) || 0 : b.id;
                return aId - bId;
            });
        } catch (error) {
            console.error('Erreur lors de l\'affichage des messages initiaux:', error);
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

        const messageLower = messageText.toLowerCase();
        
        // Chercher la prochaine étape avec keywords (order supérieur au dernier déclenché)
        const nextSteps = this.conversationFlow.filter(step => {
            if (!step) return false;
            
            // Vérifier que l'étape a des keywords valides
            const hasValidKeywords = step.keywords && 
                                   typeof step.keywords === 'string' && 
                                   step.keywords.trim() !== '';
            
            // Vérifier que l'ordre est supérieur au dernier déclenché
            const validOrder = step.order && step.order > this.lastTriggeredStep;
            
            return hasValidKeywords && validOrder;
        }).sort((a, b) => a.order - b.order);

        console.log('🔍 Étapes éligibles trouvées:', nextSteps.length, 'pour le message:', messageText);
        console.log('🔍 Étapes éligibles:', nextSteps);

        // Vérifier la première étape éligible
        for (const step of nextSteps) {
            console.log('🔍 Vérification de l\'étape:', step);
            if (this.checkKeywordsMatch(step.keywords, messageLower)) {
                console.log('✅ Match trouvé pour l\'étape:', step.order, 'avec les mots-clés:', step.keywords);
                
                // Déclencher la réponse automatique après le délai
                setTimeout(() => {
                    this.addAutomaticResponse(step);
                }, (step.delay || 0) * 1000);
                
                // Mettre à jour le dernier step déclenché
                this.lastTriggeredStep = step.order;
                
                // Sauvegarder immédiatement l'état mis à jour
                this.saveMessagesToLocalStorage();
                console.log('💾 État de conversation sauvegardé, lastTriggeredStep:', this.lastTriggeredStep);
                
                break; // Arrêter après le premier match
            }
        }
    }

    // Vérifier si tous les mots-clés sont présents (logique ET)
    checkKeywordsMatch(keywords, messageLower) {
        try {
            // Validation robuste des keywords
            if (!keywords || 
                typeof keywords !== 'string' || 
                keywords.trim() === '') {
                console.log('Keywords invalides:', keywords);
                return false;
            }
            
            // Validation du message
            if (!messageLower || typeof messageLower !== 'string') {
                console.log('Message invalide:', messageLower);
                return false;
            }
            
            // Séparer les mots-clés par virgule et nettoyer
            const keywordList = keywords.split(',')
                .map(keyword => keyword.trim().toLowerCase())
                .filter(keyword => keyword.length > 0); // Enlever les keywords vides
            
            // Si aucun keyword valide, retourner false
            if (keywordList.length === 0) {
                console.log('Aucun keyword valide trouvé');
                return false;
            }
            
            // Vérifier que TOUS les mots-clés sont présents
            const allKeywordsPresent = keywordList.every(keyword => messageLower.includes(keyword));
            
            console.log('Vérification mots-clés:', keywordList, 'dans:', messageLower, '→', allKeywordsPresent);
            
            return allKeywordsPresent;
        } catch (error) {
            console.error('Erreur lors de la vérification des keywords:', error);
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
