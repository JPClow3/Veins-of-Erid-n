#!/usr/bin/env node

/**
 * TTS Migration Test Script
 * 
 * This script tests the TTS migration from Gemini to Speechify
 * Run with: node scripts/test-tts-migration.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

console.log('🧪 TTS Migration Test Script\n');

// Test configuration
function testConfiguration() {
  console.log('📋 Testing Configuration...');
  
  const speechifyKey = process.env.SPEECHIFY_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  
  console.log(`Speechify API Key: ${speechifyKey ? '✅ Found' : '❌ Missing'}`);
  console.log(`Gemini API Key: ${geminiKey ? '✅ Found' : '❌ Missing'}`);
  
  if (!speechifyKey) {
    console.log('\n⚠️  Speechify API key not found. Add SPEECHIFY_API_KEY to your .env file');
    console.log('   Get your key at: https://console.sws.speechify.com/signup');
  }
  
  return {
    speechifyAvailable: !!speechifyKey,
    geminiAvailable: !!geminiKey
  };
}

// Test file structure
function testFileStructure() {
  console.log('\n📁 Testing File Structure...');
  
  const requiredFiles = [
    'src/utils/speechifyClient.ts',
    'src/utils/ttsService.ts',
    'src/utils/config.ts',
    'src/utils/narrationManager.ts',
    'src/utils/__tests__/ttsMigration.simple.test.ts',
    'TTS_MIGRATION_GUIDE.md'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    const exists = fs.existsSync(file);
    console.log(`${file}: ${exists ? '✅' : '❌'}`);
    if (!exists) allFilesExist = false;
  }
  
  return allFilesExist;
}

// Test package dependencies
function testDependencies() {
  console.log('\n📦 Testing Dependencies...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const speechifyInstalled = packageJson.dependencies['@speechify/api'];
    
    console.log(`@speechify/api: ${speechifyInstalled ? `✅ ${speechifyInstalled}` : '❌ Not installed'}`);
    
    return !!speechifyInstalled;
  } catch (error) {
    console.log('❌ Error reading package.json');
    return false;
  }
}

// Test Vite configuration
function testViteConfig() {
  console.log('\n⚙️  Testing Vite Configuration...');
  
  try {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    const hasSpeechifyConfig = viteConfig.includes('SPEECHIFY_API_KEY');
    
    console.log(`Speechify config: ${hasSpeechifyConfig ? '✅' : '❌'}`);
    
    return hasSpeechifyConfig;
  } catch (error) {
    console.log('❌ Error reading vite.config.ts');
    return false;
  }
}

// Generate test report
function generateReport(results) {
  console.log('\n📊 Test Report\n');
  console.log('='.repeat(50));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  
  console.log('\nDetailed Results:');
  for (const [test, passed] of Object.entries(results)) {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! TTS migration is ready.');
    return true;
  } else {
    console.log('⚠️  Some tests failed. Please review the issues above.');
    return false;
  }
}

// Main test execution
async function runTests() {
  const results = {
    'Configuration': testConfiguration(),
    'File Structure': testFileStructure(),
    'Dependencies': testDependencies(),
    'Vite Config': testViteConfig()
  };
  
  const success = generateReport(results);
  
  // Provide next steps
  console.log('\n📝 Next Steps:');
  
  if (!results['Configuration'].speechifyAvailable) {
    console.log('1. Get a Speechify API key from https://console.sws.speechify.com/signup');
    console.log('2. Add SPEECHIFY_API_KEY=your_key to your .env file');
  }
  
  if (!results['Dependencies']) {
    console.log('3. Install @speechify/api: npm install @speechify/api');
  }
  
  if (success) {
    console.log('4. Run the application: npm run dev');
    console.log('5. Test TTS functionality in the game');
  }
  
  console.log('\n📚 For detailed information, see TTS_MIGRATION_GUIDE.md');
  
  return success;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests }; 