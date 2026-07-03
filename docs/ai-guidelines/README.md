# AI 协作开发规范总览

> 本文档是人阅读的总览，AI 开发时请同时参考 `.ai/prompts/system.md` 和 `.ai/prompts/coding.md`。

## 规范文件地图

| 文件 | 说明 |
|---|---|
| `CLAUDE.md` | Claude Code 项目入口 |
| `.cursorrules` | 通用 AI IDE 规则 |
| `.ai/prompts/system.md` | 系统提示词（硬性规则） |
| `.ai/prompts/coding.md` | 编码规范提示词 |
| `.ai/prompts/review.md` | Code Review 提示词 |
| `.ai/prompts/task-templates/start-task.md` | 任务启动模板 |
| `.ai/context/architecture.md` | 架构上下文 |
| `.ai/context/memory/*.md` | 项目记忆 |
| `docs/ai-guidelines/standards.md` | 完整规范正文 |
| `docs/ai-guidelines/checklists.md` | 前后检查清单 |

## 核心目标

- 统一代码风格与架构
- 明确 AI 开发边界
- 降低多会话上下文恢复成本
- 让人专注于需求、审核、验收

## 快速开始

1. 新会话启动 → 读取 `CLAUDE.md` → 读取 `.ai/prompts/system.md`
2. 明确任务范围 → 填写任务启动模板
3. 开发 → 执行 Post-Task Checklist
4. 提交 → 人工 Code Review
