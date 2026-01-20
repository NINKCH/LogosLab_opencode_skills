#!/usr/bin/env node

/**
 * Test Runner Script
 * Interactive menu for running different types of tests
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function runCommand(command) {
  try {
    console.log(`\nRunning: ${command}\n`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`\n❌ Command failed: ${error.message}`);
    return false;
  }
}

async function main() {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    console.error('Error: package.json not found');
    console.error('Make sure you are in a project directory');
    process.exit(1);
  }

  console.log('=== Test Runner ===\n');
  console.log('Select test type:');
  console.log('1) Unit tests');
  console.log('2) Integration tests');
  console.log('3) E2E tests');
  console.log('4) All tests');
  console.log('5) All tests with coverage');
  console.log('6) Watch mode');
  
  const choice = await question('Enter choice (1-6): ');
  
  let success = false;
  
  switch (choice) {
    case '1':
      console.log('Running unit tests...');
      success = runCommand('npm run test:unit');
      break;
    case '2':
      console.log('Running integration tests...');
      success = runCommand('npm run test:integration');
      break;
    case '3':
      console.log('Running E2E tests...');
      success = runCommand('npm run test:e2e');
      break;
    case '4':
      console.log('Running all tests...');
      success = runCommand('npm test');
      break;
    case '5':
      console.log('Running all tests with coverage...');
      success = runCommand('npm run test:coverage');
      
      if (success && fs.existsSync('coverage/index.html')) {
        console.log('\n📊 Opening coverage report...');
        const openCmd = process.platform === 'win32' ? 'start' :
                       process.platform === 'darwin' ? 'open' : 'xdg-open';
        try {
          execSync(`${openCmd} coverage/index.html`);
        } catch (e) {
          console.log('Coverage report: coverage/index.html');
        }
      }
      break;
    case '6':
      console.log('Running tests in watch mode...');
      success = runCommand('npm run test:watch');
      break;
    default:
      console.error('Invalid choice');
      rl.close();
      process.exit(1);
  }
  
  console.log(success ? '\n✅ Test run complete!' : '\n❌ Tests failed');
  
  rl.close();
}

main().catch(console.error);
