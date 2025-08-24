import { LightningElement } from 'lwc';

export default class SlackSimulatorUserGuide extends LightningElement {
    
    // Sections du guide
    sections = [
        {
            id: 'overview',
            title: 'Vue d\'ensemble',
            isExpanded: true
        },
        {
            id: 'configuration',
            title: 'Configuration des scénarios',
            isExpanded: false
        },
        {
            id: 'keywords',
            title: 'Gestion des mots-clés',
            isExpanded: false
        },
        {
            id: 'simulation',
            title: 'Utilisation du simulateur',
            isExpanded: false
        },
        {
            id: 'tips',
            title: 'Conseils et astuces',
            isExpanded: false
        },
        {
            id: 'troubleshooting',
            title: 'Dépannage',
            isExpanded: false
        }
    ];

    // Gérer l'expansion/contraction des sections
    handleSectionToggle(event) {
        const sectionId = event.currentTarget.dataset.sectionId;
        this.sections = this.sections.map(section => ({
            ...section,
            isExpanded: section.id === sectionId ? !section.isExpanded : section.isExpanded
        }));
    }

    // Faire défiler vers une section spécifique
    scrollToSection(event) {
        const sectionId = event.currentTarget.dataset.target;
        const element = this.template.querySelector(`[data-section="${sectionId}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
