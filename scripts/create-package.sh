#!/bin/bash

# Script to create Slack In SF Simulator package
# Developed by: Sofiane Hamila

echo "🚀 Creating Slack In SF Simulator package..."

# Check if we're in the right directory
if [ ! -f "sfdx-project.json" ]; then
    echo "❌ Error: sfdx-project.json not found. Please run this script from the project root."
    exit 1
fi

# Verify Dev Hub connection
echo "📡 Verifying Dev Hub connection..."
if ! sf org list --target-dev-hub > /dev/null 2>&1; then
    echo "❌ Error: No Dev Hub connection found. Please authenticate first:"
    echo "   sf auth web login --set-default-dev-hub"
    exit 1
fi

# Run tests before creating package
echo "🧪 Running tests..."
sf apex run test --code-coverage --result-format human --wait 10

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix issues before creating package."
    exit 1
fi

# Create the package
echo "📦 Creating package..."
sf package create \
  --name "Slack In SF Simulator" \
  --description "Comprehensive Salesforce application for managing, configuring, and testing Slack conversation simulations directly within Salesforce org" \
  --package-type Unlocked \
  --path force-app

if [ $? -eq 0 ]; then
    echo "✅ Package 'Slack In SF Simulator' created successfully!"
else
    echo "❌ Package creation failed. Please check the error messages above."
    exit 1
fi

# Create the first version
echo "🏷️ Creating version 1.0.0..."
sf package version create \
  --package "Slack In SF Simulator" \
  --installation-key-bypass \
  --wait 15 \
  --code-coverage

if [ $? -eq 0 ]; then
    echo "🎉 Package version created successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Note the Package Version ID from the output above"
    echo "2. Test the package installation on a scratch org or sandbox"
    echo "3. Use the installation script: ./scripts/install-package.sh [PACKAGE_VERSION_ID]"
    echo ""
    echo "📖 For more information, see PACKAGE_README.md"
else
    echo "❌ Package version creation failed. Please check the error messages above."
    exit 1
fi
