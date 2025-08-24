# 📦 Slack In SF Simulator - Salesforce Package

## 🎯 Overview

**Slack In SF Simulator** is a comprehensive Salesforce application that enables administrators and developers to manage, configure, and test Slack conversation simulations directly within their Salesforce org.

## ✨ Key Features

### 🎛️ Included Components
- **Lightning Application**: Dedicated administration interface
- **Lightning Web Components (LWC)**:
  - `conversationOrchestrator`: Interaction orchestration engine
  - `conversationConfigurator`: Scenario configuration interface
  - `slackSimulator`: Slack interface simulator
  - `slackSimulatorUserGuide`: Integrated user guide
- **Apex Classes**: `UserInfoController` for user management
- **Permission Sets**: Pre-configured access permissions
- **Lightning Pages**: Optimized user interface layouts

### 🚀 Capabilities
- ✅ Slack conversation configuration
- ✅ Real-time simulation testing
- ✅ Keyword and trigger management
- ✅ Automatic configuration backup
- ✅ Intuitive user interface
- ✅ Built-in user guide
- ✅ Comprehensive unit tests

## 📋 Prerequisites

- **Salesforce Edition**: Professional, Enterprise, Unlimited, or Developer
- **API Version**: 64.0 or higher
- **Lightning Experience**: Enabled
- **Permissions**: System Administrator for installation

## 🔧 Installation

### Option 1: Package Installation Link
1. Click on the package installation link
2. Log in to your Salesforce org
3. Choose "Install for All Users" or "Install for Specific Profiles"
4. Click "Install"

### Option 2: Salesforce CLI Installation
```bash
sf package install --package [PACKAGE_ID] --target-org [YOUR_ORG_ALIAS] --wait 10
```

## ⚙️ Post-Installation Configuration

### 1. Assign Permissions
1. Navigate to **Setup** → **Users** → **Permission Sets**
2. Find "Slack Orchestrator Admin Access"
3. Assign to appropriate users

### 2. Access the Application
1. Click the **App Launcher** (9 dots)
2. Search for "Slack Orchestrator Admin"
3. Launch the application

## 📖 User Guide

### Conversation Configuration
1. **Create Scenarios**: Use the configurator to define your conversations
2. **Set Keywords**: Configure automatic triggers
3. **Test Scenarios**: Use the simulator to validate your configurations
4. **Save Settings**: Configurations are automatically saved

### Component Usage
- **Orchestrator**: Centralized interaction management
- **Configurator**: Scenario creation interface
- **Simulator**: Real-time conversation testing
- **Guide**: Integrated documentation

## 🔧 Customization

### Appearance Customization
- Customize colors in application metadata
- Adjust Lightning page layouts
- Modify icons and labels

### Feature Extension
- Add new Lightning Web Components
- Create custom fields
- Integrate with external systems

## 🧪 Testing & Quality

- **Code Coverage**: >75% (required for packages)
- **Unit Tests**: LWC and Apex tests included
- **Integration Tests**: Complete scenario testing

## 🆘 Support & Troubleshooting

### Common Issues
1. **Application not visible**: Check assigned permissions
2. **Component errors**: Check developer console logs
3. **Save issues**: Verify browser localStorage

### Debugging & Logs
- Enable debug logs in Developer Console
- Check JavaScript errors in browser console
- Review Apex logs for server errors

## 📊 Version History

- **Version 1.0.0**: Initial Release
  - Complete LWC components
  - Administration interface
  - Slack simulator
  - Integrated documentation

## 🔄 Updates

Package updates will be automatically available via:
- Salesforce notifications
- Package Manager
- Salesforce CLI

## 📞 Contact & Support

For technical questions or support:
- Review integrated documentation
- Check system logs
- Contact your Salesforce administrator

---

**Developed by**: Sofiane Hamila  
**Version**: 1.0.0  
**Compatibility**: Salesforce Lightning Experience  
**Last Updated**: 2024

## 🛠️ Technical Details

### Architecture
- **Frontend**: Lightning Web Components (LWC)
- **Backend**: Apex Classes
- **Storage**: Browser localStorage + Salesforce metadata
- **UI Framework**: Salesforce Lightning Design System (SLDS)

### Security
- Respects Salesforce sharing rules
- Uses `with sharing` security model
- Implements proper error handling
- Validates user permissions

### Performance
- Cacheable Apex methods
- Optimized SOQL queries
- Efficient component rendering
- Minimal server round-trips

## 📄 License

This package is distributed under standard Salesforce package licensing terms.

## 🤝 Contributing

For feature requests or bug reports, please contact the development team through your Salesforce administrator.
