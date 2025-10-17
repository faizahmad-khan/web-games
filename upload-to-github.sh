#!/bin/bash

# 🎲 Ludo Game - Quick GitHub Upload Script
# This script will help you upload your Ludo game to GitHub

echo "🎲 Ludo Game - GitHub Upload Helper"
echo "====================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    echo "📥 Please install Git first:"
    echo "   Mac: brew install git"
    echo "   Or download from: https://git-scm.com"
    exit 1
fi

echo "✅ Git is installed!"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " username

# Get repository name
read -p "Enter repository name (default: ludo-game): " reponame
reponame=${reponame:-ludo-game}

echo ""
echo "📝 Summary:"
echo "   GitHub Username: $username"
echo "   Repository Name: $reponame"
echo "   Repository URL: https://github.com/$username/$reponame.git"
echo ""

read -p "Is this correct? (y/n): " confirm

if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo "❌ Upload cancelled."
    exit 0
fi

echo ""
echo "🚀 Starting upload process..."
echo ""

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized!"
else
    echo "✅ Git already initialized!"
fi

# Add all files
echo "📁 Adding files..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "Initial commit: Complete Ludo game with animations and mobile support

Features:
- 2-4 player support with color selection
- Roll 6 to unlock pieces
- Extra turn on rolling 6
- Capture mechanics with safe zones
- Smooth jumping animations
- Mobile responsive design
- Touch controls for mobile devices"

# Rename branch to main
echo "🌿 Setting main branch..."
git branch -M main

# Add remote
echo "🔗 Adding remote repository..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$username/$reponame.git"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
echo ""
echo "📌 You will be asked for your GitHub credentials:"
echo "   Username: $username"
echo "   Password: Use your Personal Access Token (NOT your account password)"
echo ""
echo "   Don't have a token? Create one at:"
echo "   https://github.com/settings/tokens"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your Ludo game is now on GitHub!"
    echo ""
    echo "📍 Repository URL:"
    echo "   https://github.com/$username/$reponame"
    echo ""
    echo "🌐 To make it live (GitHub Pages):"
    echo "   1. Go to: https://github.com/$username/$reponame/settings/pages"
    echo "   2. Under 'Source', select 'main' branch"
    echo "   3. Click 'Save'"
    echo "   4. Wait 2-3 minutes"
    echo "   5. Your game will be live at:"
    echo "      https://$username.github.io/$reponame/ludo.html"
    echo ""
    echo "✨ Next steps:"
    echo "   - Add topics/tags to your repository"
    echo "   - Create a release (v1.0.0)"
    echo "   - Share with friends!"
    echo ""
else
    echo ""
    echo "❌ Upload failed!"
    echo ""
    echo "Common issues:"
    echo "   1. Repository doesn't exist - Create it first at https://github.com/new"
    echo "   2. Wrong credentials - Use Personal Access Token, not password"
    echo "   3. Network issues - Check your internet connection"
    echo ""
    echo "Need help? Check GITHUB_UPLOAD_GUIDE.md"
fi
