#!/bin/bash

# Setup script for Return of the Noid Marvel Quiz Game

echo "🦸‍♂️ Setting up Return of the Noid Marvel Quiz Game..."

# Check if config.js already exists
if [ -f "js/config.js" ]; then
    echo "⚠️  config.js already exists. Skipping setup."
    echo "   If you need to reconfigure, delete js/config.js and run this script again."
    exit 0
fi

# Copy template
if [ -f "js/config.template.js" ]; then
    cp js/config.template.js js/config.js
    echo "✅ Copied config template to js/config.js"
else
    echo "❌ Error: config.template.js not found!"
    exit 1
fi

echo ""
echo "🔑 NEXT STEPS:"
echo "1. Get your Marvel API keys from: https://developer.marvel.com/"
echo "2. Edit js/config.js and replace the placeholder values:"
echo "   - YOUR_MARVEL_PUBLIC_KEY_HERE"
echo "   - YOUR_MARVEL_PRIVATE_KEY_HERE"
echo "3. Open index.html in your browser to play!"
echo ""
echo "⚠️  IMPORTANT: Never commit js/config.js to version control!"
echo "   (It's already in .gitignore for your protection)"
echo ""
echo "🎮 Ready to test your Marvel knowledge!"
