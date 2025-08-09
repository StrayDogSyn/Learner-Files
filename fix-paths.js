#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing paths for GitHub Pages deployment...');

function fixPaths(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixPaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix paths for GitHub Pages (ensure relative paths work correctly)
      const originalContent = content;
      
      // Fix absolute paths that start with /Learner-Files/ to be relative
      content = content.replace(/href="\/Learner-Files\//g, 'href="./');
      content = content.replace(/src="\/Learner-Files\//g, 'src="./');
      
      // Fix absolute paths that start with / (but not //) to be relative
      content = content.replace(/href="\/(?!\/)/g, 'href="./');
      content = content.replace(/src="\/(?!\/)/g, 'src="./');
      
      // Fix any remaining public directory references
      content = content.replace(/href="\/public\//g, 'href="./');
      content = content.replace(/src="\/public\//g, 'src="./');
      content = content.replace(/href="public\//g, 'href="');
      content = content.replace(/src="public\//g, 'src="');
      
      // Only write if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed paths in: ${filePath}`);
      }
    }
  });
}

// Run the fix starting from current directory
fixPaths('.');

// Also specifically check some key files
const keyFiles = [
  './index.html',
  './projects.html',
  './bio.html',
  './contacts.html',
  './menu.html'
];

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ Verified: ${file} exists`);
  } else {
    console.log(`❌ Missing: ${file}`);
  }
});

// Check project directories
const projectDirs = [
  './projects/knucklebones',
  './projects/quiz-ninja2.1',
  './projects/calculator.html',
  './projects/rps.html',
  './projects/countdown.html',
  './projects/compTIA.html'
];

console.log('\n📂 Checking project files:');
projectDirs.forEach(dir => {
  if (dir.endsWith('.html')) {
    // It's a file, not a directory
    if (fs.existsSync(dir)) {
      console.log(`✅ ${dir} exists`);
    } else {
      console.log(`❌ ${dir} missing`);
    }
  } else {
    // It's a directory
    const indexPath = path.join(dir, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log(`✅ ${dir}/index.html exists`);
    } else {
      console.log(`❌ ${dir}/index.html missing`);
    }
  }
});

console.log('\n🎉 Path fixing complete!');
