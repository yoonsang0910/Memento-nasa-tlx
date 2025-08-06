// Configuration file for Memento Daily Usability Form
// Update these settings for your study

const RESEARCHER_CONFIG = {
    // ✏️ CHANGE THIS TO YOUR EMAIL ADDRESS
    email: 'yoonsakim@cs.stonybrook.edu',
    
    // Study details
    studyName: 'Memento Daily Usability Form',
    institutionName: 'Stony Brook University',
    
    // Data submission method
    // Options: 'email', 'googleform', 'webhook', 'airtable'
    submitMethod: 'email',
    
    // Optional: Google Forms integration
    googleFormURL: '',
    
    // Optional: Custom webhook URL
    webhookURL: '',
    
    // Optional: Airtable configuration
    airtable: {
        baseId: '',
        tableId: '',
        apiKey: ''
    },
    
    // Email template customization
    emailTemplate: {
        subjectPrefix: 'Memento Daily Usability Form Response',
        includeParticipantInSubject: true,
        autoOpenEmailClient: true
    }
};

// Make config available globally
window.RESEARCHER_CONFIG = RESEARCHER_CONFIG;