#!/usr/bin/env node
import { mkdirSync, copyFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillsSourceDir = join(__dirname, 'skills');
const claudeSkillsDir = join(homedir(), '.claude', 'skills');

// Parse --skill argument
const args = process.argv.slice(2);
const skillFlagIndex = args.indexOf('--skill');
const requestedSkill = skillFlagIndex !== -1 ? args[skillFlagIndex + 1] : null;

// Get available skills (directories under skills/)
function getAvailableSkills() {
  if (!existsSync(skillsSourceDir)) {
    return [];
  }
  return readdirSync(skillsSourceDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && existsSync(join(skillsSourceDir, d.name, 'SKILL.md')))
    .map(d => d.name);
}

// Install a single skill
function installSkill(skillName) {
  const source = join(skillsSourceDir, skillName, 'SKILL.md');
  if (!existsSync(source)) {
    console.error(`\n❌ Skill "${skillName}" not found.`);
    console.error(`   Available skills: ${getAvailableSkills().join(', ')}`);
    process.exit(1);
  }

  const targetDir = join(claudeSkillsDir, skillName);
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(source, join(targetDir, 'SKILL.md'));
  console.log(`   ✅ ${skillName}`);
}

const availableSkills = getAvailableSkills();

if (availableSkills.length === 0) {
  console.error('\n❌ No skills found in this package.');
  process.exit(1);
}

if (requestedSkill) {
  // Install specific skill
  console.log(`\nInstalling skill: ${requestedSkill}`);
  installSkill(requestedSkill);
} else {
  // Install all skills
  console.log(`\nInstalling all skills (${availableSkills.length}):`);
  for (const skill of availableSkills) {
    installSkill(skill);
  }
}

console.log(`\n   Install path: ${claudeSkillsDir}`);
console.log(`\nRestart Claude Code to use the new skill(s).\n`);
