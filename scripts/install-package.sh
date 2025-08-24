#!/bin/bash

# Script to install Slack In SF Simulator package
# Developed by: Sofiane Hamila

if [ -z "$1" ]; then
    echo "Usage: $0 <package-version-id> [org-alias]"
    echo ""
    echo "Examples:"
    echo "  $0 04t5j000001AbCdEFG                    # Install to default org"
    echo "  $0 04t5j000001AbCdEFG myorg               # Install to specific org"
    echo "  $0 04t5j000001AbCdEFG user@example.com   # Install to specific user org"
    echo ""
    echo "To get the package version ID, run: sf package version list --packages 'Slack In SF Simulator'"
    exit 1
fi

PACKAGE_VERSION_ID=$1
ORG_ALIAS=${2:-""}

# Validate package version ID format
if [[ ! $PACKAGE_VERSION_ID =~ ^04t[a-zA-Z0-9]{15}$ ]]; then
    echo "❌ Error: Invalid package version ID format. Expected format: 04tXXXXXXXXXXXXXXX"
    exit 1
fi

if [ -n "$ORG_ALIAS" ]; then
    TARGET_ORG="--target-org $ORG_ALIAS"
    echo "🎯 Target org: $ORG_ALIAS"
else
    TARGET_ORG=""
    echo "🎯 Target org: default"
fi

echo "📦 Installing Slack In SF Simulator package..."
echo "Package Version ID: $PACKAGE_VERSION_ID"
echo ""

# Install the package
sf package install \
  --package $PACKAGE_VERSION_ID \
  $TARGET_ORG \
  --wait 10 \
  --publish-wait 10 \
  --no-prompt

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Package installed successfully!"
    echo ""
    echo "📋 Post-installation steps:"
    echo "1. 🔐 Assign permissions:"
    echo "   - Go to Setup → Users → Permission Sets"
    echo "   - Find 'Slack Orchestrator Admin Access'"
    echo "   - Assign to appropriate users"
    echo ""
    echo "2. 🚀 Access the application:"
    echo "   - Click App Launcher (9 dots)"
    echo "   - Search for 'Slack Orchestrator Admin'"
    echo "   - Launch the application"
    echo ""
    echo "3. 📖 Documentation:"
    echo "   - See PACKAGE_README.md for complete user guide"
    echo "   - Use the integrated user guide within the app"
    echo ""
    echo "🎉 Enjoy using Slack In SF Simulator!"
else
    echo ""
    echo "❌ Package installation failed!"
    echo ""
    echo "🔍 Troubleshooting tips:"
    echo "1. Check if you have System Administrator permissions"
    echo "2. Verify the package version ID is correct"
    echo "3. Ensure the target org is accessible"
    echo "4. Check for any dependency issues"
    echo ""
    echo "For more help, contact your Salesforce administrator."
    exit 1
fi
