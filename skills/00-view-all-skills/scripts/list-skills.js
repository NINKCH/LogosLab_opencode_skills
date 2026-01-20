#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function parseYAMLFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  
  const metadata = {};
  const lines = match[1].split(/\r?\n/);
  
  for (const line of lines) {
    if (!line.trim() || line.startsWith('  ')) continue;
    
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (value) metadata[key] = value;
    }
  }
  
  return metadata;
}

function discoverSkills(skillsDir) {
  const skills = [];
  
  try {
    const dirs = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    
    for (const dir of dirs) {
      const skillFile = path.join(skillsDir, dir, 'SKILL.md');
      
      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf-8');
        const metadata = parseYAMLFrontmatter(content);
        
        if (metadata?.name && metadata?.description) {
          skills.push({
            name: metadata.name,
            description: metadata.description,
            directory: dir
          });
        }
      }
    }
    
    // Sort by directory name (which includes numeric prefix) instead of skill name
    skills.sort((a, b) => a.directory.localeCompare(b.directory));
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
  
  return skills;
}

function displaySkills(skills) {
  console.log(`\n${colors.bright}${colors.cyan}🎭 OpenCode Skills | OpenCode 技能集${colors.reset}\n`);
  console.log(`Found ${colors.green}${skills.length}${colors.reset} skills in .opencode/skills/\n`);
  
  if (skills.length === 0) {
    console.log('No skills found.\n');
    return;
  }
  
  console.log('═'.repeat(100));
  
  skills.forEach((skill, i) => {
    console.log(`\n${colors.bright}${colors.blue}${skill.name}${colors.reset}`);
    console.log(`${skill.description}`);
    console.log(`${colors.cyan}skill({ name: "${skill.name}" })${colors.reset}`);
    
    if (i < skills.length - 1) {
      console.log('\n' + '─'.repeat(100));
    }
  });
  
  console.log('\n' + '═'.repeat(100));
  
  console.log(`\n${colors.bright}💡 Usage Tips | 使用提示:${colors.reset}`);
  console.log(`  ${colors.yellow}•${colors.reset} Load a skill: ${colors.cyan}skill({ name: "skill-name" })${colors.reset}`);
  console.log(`  ${colors.yellow}•${colors.reset} Get help: Load skill then ask questions`);
  console.log(`  ${colors.yellow}•${colors.reset} Combine skills: Load multiple skills for complex tasks`);
  console.log(`\n${colors.bright}📚 Documentation:${colors.reset} See README.md for detailed information\n`);
}

function main() {
  const args = process.argv.slice(2);
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'table';
  const search = args.find(a => a.startsWith('--search='))?.split('=')[1];
  
  const skillsDir = path.join(process.cwd(), '.opencode', 'skill');
  
  if (!fs.existsSync(skillsDir)) {
    console.error('Error: .opencode/skills directory not found');
    process.exit(1);
  }
  
  let skills = discoverSkills(skillsDir);
  skills = skills.filter(s => s.name !== 'view-all-skills');
  
  if (search) {
    const s = search.toLowerCase();
    skills = skills.filter(sk => 
      sk.name.toLowerCase().includes(s) || 
      sk.description.toLowerCase().includes(s)
    );
  }
  
  if (format === 'json') {
    console.log(JSON.stringify({ total: skills.length, skills }, null, 2));
  } else if (format === 'markdown') {
    console.log('# Available Skills | 可用技能\n');
    console.log(`Total: ${skills.length} skills\n`);
    skills.forEach((s, i) => {
      console.log(`## ${i+1}. ${s.name}\n`);
      console.log(`${s.description}\n`);
      console.log(`**Command:** \`skill({ name: "${s.name}" })\`\n`);
    });
  } else {
    displaySkills(skills);
  }
}

if (require.main === module) {
  main();
}

module.exports = { discoverSkills, parseYAMLFrontmatter };
