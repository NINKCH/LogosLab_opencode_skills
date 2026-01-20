// Init Project plugin for OpenCode
// Registers an `init_project` tool that initializes system-level skills
// (00-disaster-recovery and 00-external-memory) for the current project.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { tool } from '@opencode-ai/plugin/tool';

export const InitProjectPlugin = async ({ client, directory }) => {
  const projectRoot = directory;
  const skillsDir = path.join(projectRoot, '.opencode', 'skills');
  const disasterRecoveryDir = path.join(skillsDir, '00-disaster-recovery');
  const externalMemoryDir = path.join(skillsDir, '00-external-memory');
  const externalMemoryTemplatesDir = path.join(externalMemoryDir, 'templates');
  const memoryDir = path.join(projectRoot, '.memory');

  const ensureExternalMemory = () => {
    const results = { activated: false, messages: [] };

    if (!fs.existsSync(externalMemoryDir)) {
      results.messages.push('⚠ External Memory 技能目录缺失：.opencode/skills/00-external-memory/');
      return results;
    }

    try {
      if (!fs.existsSync(memoryDir)) {
        fs.mkdirSync(memoryDir, { recursive: true });
      }

      const files = [
        { target: 'context.md', template: 'context-template.md' },
        { target: 'findings.md', template: 'findings-template.md' },
        { target: 'decisions.md', template: 'decisions-template.md' },
        // errors.log 没有模板也可以是空文件
        { target: 'errors.log', template: null }
      ];

      for (const { target, template } of files) {
        const targetPath = path.join(memoryDir, target);
        if (fs.existsSync(targetPath)) continue;

        if (template) {
          const templatePath = path.join(externalMemoryTemplatesDir, template);
          if (fs.existsSync(templatePath)) {
            fs.copyFileSync(templatePath, targetPath);
            continue;
          }
        }

        // 没有模板时创建空文件
        fs.writeFileSync(targetPath, '', 'utf8');
      }

      results.activated = true;
      return results;
    } catch (err) {
      results.messages.push(`⚠ External Memory 初始化失败：${err.message}`);
      return results;
    }
  };

  const loadExistingMemoryIntoSession = async (context) => {
    if (!client || !context || !context.sessionID) return;
    if (!fs.existsSync(memoryDir)) return;

    const filesToLoad = [
      { name: 'context.md', label: 'Current Task Context' },
      { name: 'findings.md', label: 'Key Findings' },
      { name: 'decisions.md', label: 'Decisions' }
      // errors.log 通常用于调试，这里不主动注入，以免噪音过大
    ];

    let combined = '';

    for (const { name, label } of filesToLoad) {
      const p = path.join(memoryDir, name);
      if (!fs.existsSync(p)) continue;

      try {
        const raw = fs.readFileSync(p, 'utf8');
        const content = String(raw || '').trim();
        if (!content) continue;

        // 为避免一次性注入过大，这里简单截断到前 4000 字符
        const snippet = content.length > 4000 ? content.slice(0, 4000) + '\n... [truncated]' : content;

        combined += `\n\n[External Memory - ${label}]\n\n${snippet}`;
      } catch {
        // 忽略单个文件读取错误
        continue;
      }
    }

    if (!combined.trim()) return;

    try {
      await client.session.prompt({
        path: { id: context.sessionID },
        body: {
          noReply: true,
          parts: [
            {
              type: 'text',
              text:
                'External memory loaded for this project. The following content summarizes existing context, findings, and decisions from previous sessions:' +
                combined,
              synthetic: true
            }
          ]
        }
      });
    } catch {
      // 注入失败时静默忽略，不影响初始化结果
    }
  };

  const checkDisasterRecovery = () => {
    const results = { ready: false, messages: [] };

    if (!fs.existsSync(disasterRecoveryDir)) {
      results.messages.push('⚠ Disaster Recovery 技能目录缺失：.opencode/skills/00-disaster-recovery/');
      return results;
    }

    let gitDir = path.join(projectRoot, '.git');

    // 如果还不是 Git 仓库，尝试自动执行 git init
    if (!fs.existsSync(gitDir)) {
      try {
        execSync('git init', { cwd: projectRoot, stdio: 'ignore' });
        gitDir = path.join(projectRoot, '.git');
        if (fs.existsSync(gitDir)) {
          results.messages.push('✓ 已自动为当前项目运行 git init，启用 Git 仓库。');
        } else {
          results.messages.push('⚠ 尝试自动运行 git init 后仍未检测到 .git 目录，请手动检查 Git 配置。');
          return results;
        }
      } catch (err) {
        results.messages.push(`⚠ Disaster Recovery 初始化失败：无法自动运行 git init（${err.message}）`);
        return results;
      }
    }

    // 这里只做存在性检查，不自动创建快照
    results.ready = true;
    return results;
  };

  return {
    tool: {
      init_project: tool({
        description:
          'Initialize system-level skills (external memory and disaster recovery) for the current project and report status.',
        args: {},
        execute: async (args, context) => {
          const lines = [];

          const externalMemoryResult = ensureExternalMemory();
          const disasterRecoveryResult = checkDisasterRecovery();

          // 如果已经有外部记忆文件，让当前会话在后台加载它们，以便新窗口能够跟上项目进度
          await loadExistingMemoryIntoSession(context || {});

          lines.push('OpenCode 初始化完成！');
          lines.push(
            externalMemoryResult.activated
              ? '✓ External Memory 系统已激活'
              : '⚠ External Memory 系统未激活'
          );
          lines.push(
            disasterRecoveryResult.ready
              ? '✓ Disaster Recovery 系统已就绪'
              : '⚠ Disaster Recovery 系统未就绪'
          );

          const extraMessages = [
            ...externalMemoryResult.messages,
            ...disasterRecoveryResult.messages
          ];

          if (extraMessages.length > 0) {
            lines.push('', ...extraMessages);
          }

          return lines.join('\n');
        }
      })
    }
  };
};
