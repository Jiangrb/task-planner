#!/usr/bin/env node
import { mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillName = 'task-planner';
const skillDir = join(homedir(), '.claude', 'skills', skillName);

mkdirSync(skillDir, { recursive: true });
copyFileSync(join(__dirname, 'SKILL.md'), join(skillDir, 'SKILL.md'));

console.log(`\n✅ ${skillName} skill 安装成功！`);
console.log(`   安装路径: ${skillDir}`);
console.log(`\n重启 Claude Code 后即可使用。\n`);
