#!/usr/bin/env node

/**
 * Create Feature Branch Script
 * Interactive script to create properly named feature branches
 */

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('=== Feature Branch Creator ===\n');

  // Get branch type
  console.log('Select branch type:');
  console.log('1) feature');
  console.log('2) bugfix');
  console.log('3) hotfix');
  console.log('4) chore');
  console.log('5) docs');
  
  const choice = await question('Enter choice (1-5): ');
  
  const types = ['feature', 'bugfix', 'hotfix', 'chore', 'docs'];
  const type = types[parseInt(choice) - 1];
  
  if (!type) {
    console.error('Invalid choice');
    rl.close();
    process.exit(1);
  }

  // Get ticket ID
  const ticketId = await question('Ticket ID (e.g., PROJ-123): ');
  
  // Get description
  const description = await question('Short description (kebab-case): ');
  
  // Construct branch name
  const branchName = `${type}/${ticketId}-${description}`;
  
  console.log(`\nCreating branch: ${branchName}`);
  
  // Get base branch
  const baseBranch = await question('Base branch (default: develop): ') || 'develop';
  
  try {
    // Checkout base branch
    console.log(`\nChecking out ${baseBranch}...`);
    execSync(`git checkout ${baseBranch}`, { stdio: 'inherit' });
    
    // Pull latest
    console.log(`Pulling latest changes...`);
    execSync(`git pull origin ${baseBranch}`, { stdio: 'inherit' });
    
    // Create new branch
    console.log(`Creating branch ${branchName}...`);
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    
    console.log(`\n✅ Branch created successfully: ${branchName}`);
    console.log(`📝 Don't forget to push: git push -u origin ${branchName}`);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
  
  rl.close();
}

main().catch(console.error);
