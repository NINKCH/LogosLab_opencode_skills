#!/usr/bin/env node

/**
 * PRD Generator Script
 * Generates a Product Requirements Document from user input
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function generatePRD() {
  console.log('=== PRD Generator ===\n');

  const projectName = await question('Project Name: ');
  const projectDescription = await question('Project Description: ');
  const targetAudience = await question('Target Audience: ');
  const businessGoals = await question('Business Goals (comma-separated): ');
  const features = await question('Key Features (comma-separated): ');

  const prd = `# Product Requirements Document

## Project: ${projectName}

### Executive Summary
${projectDescription}

### Target Audience
${targetAudience}

### Business Objectives
${businessGoals.split(',').map(goal => `- ${goal.trim()}`).join('\n')}

### Key Features
${features.split(',').map(feature => `- ${feature.trim()}`).join('\n')}

### Success Metrics
- User adoption rate
- Feature usage metrics
- Customer satisfaction score
- Performance benchmarks

### Timeline
- Phase 1: Requirements & Design (2 weeks)
- Phase 2: Development (6 weeks)
- Phase 3: Testing & QA (2 weeks)
- Phase 4: Launch & Monitoring (1 week)

### Technical Requirements
- To be defined based on architecture design

### Risks & Mitigation
- To be identified during planning phase

---
Generated on: ${new Date().toISOString()}
`;

  const outputPath = path.join(process.cwd(), `PRD-${projectName.replace(/\s+/g, '-')}.md`);
  fs.writeFileSync(outputPath, prd);

  console.log(`\n✅ PRD generated: ${outputPath}`);
  rl.close();
}

generatePRD().catch(console.error);
