#!/usr/bin/env node

/**
 * Simple TTS Migration Test
 * Run with: node test-migration.js
 */

console.log('🧪 Testing TTS Migration Setup...\n');

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Test 1: Check if required files exist
import fs from 'fs';

function checkFile(filePath) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${filePath}`);
  return exists;
}

console.log('📁 Checking Required Files:');
const requiredFiles = [
  'src/utils/speechifyClient.ts',
  'src/utils/ttsService.ts', 
  'src/utils/config.ts',
  'src/utils/narrationManager.ts',
  'TTS_MIGRATION_GUIDE.md'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (!checkFile(file)) {
    allFilesExist = false;
  }
}

// Test 2: Check package.json
console.log('\n📦 Checking Dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const speechifyInstalled = packageJson.dependencies['@speechify/api'];
  console.log(`@speechify/api: ${speechifyInstalled ? `✅ ${speechifyInstalled}` : '❌ Not installed'}`);
  
  if (!speechifyInstalled) {
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ Error reading package.json');
  allFilesExist = false;
}

// Test 3: Check Vite config
console.log('\n⚙️  Checking Vite Configuration:');
try {
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  const hasSpeechifyConfig = viteConfig.includes('SPEECHIFY_API_KEY');
  console.log(`Speechify config: ${hasSpeechifyConfig ? '✅' : '❌'}`);
  
  if (!hasSpeechifyConfig) {
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ Error reading vite.config.ts');
  allFilesExist = false;
}

// Test 4: Check environment
console.log('\n🔑 Checking Environment:');
const speechifyKey = process.env.SPEECHIFY_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

console.log(`Speechify API Key: ${speechifyKey ? '✅ Found' : '❌ Missing'}`);
console.log(`Gemini API Key: ${geminiKey ? '✅ Found' : '❌ Missing'}`);

// Summary
console.log('\n📊 Migration Status:');
console.log('='.repeat(50));

if (allFilesExist) {
  console.log('🎉 Basic migration setup is complete!');
  console.log('\n📝 Next steps:');
  
  if (!speechifyKey) {
    console.log('1. Get a Speechify API key from: https://console.sws.speechify.com/signup');
    console.log('2. Add to your .env file: SPEECHIFY_API_KEY=your_key_here');
  }
  
  console.log('3. Test the application: npm run dev');
  console.log('4. The TTS will automatically use Speechify if available, or fall back to Gemini');
  
} else {
  console.log('⚠️  Some setup issues found. Please review the errors above.');
}

console.log('\n📚 For detailed information, see TTS_MIGRATION_GUIDE.md');
console.log('='.repeat(50)); 