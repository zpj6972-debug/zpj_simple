# CLAUDE.md — AI 协作开发入口

> 本项目采用 AI 持续开发模式。任何 Claude 会话在动手前，必须先阅读本文件及引用的规范。

## 项目速览

- **名称**: super-platform
- **技术栈**: Vue 3.5 + Vite 7 + TypeScript 5.9 + Pinia 3 + Element Plus 2.11 + Tailwind CSS 4 + pnpm
- **项目类型**: 大型中后台管理系统（基于 vue-pure-admin 精简版）
- **组件形式**: 以 `.vue` 单文件为主，部分公共组件使用 TSX/JSX

## 必读文件（按顺序）

1. `.ai/prompts/system.md` — 系统提示词，硬性规则
2. `.ai/prompts/coding.md` — 编码规范
3. `.ai/context/architecture.md` — 项目架构上下文
4. `docs/ai-guidelines/README.md` — 完整规范总览

## 任务启动流程

1. 读取本文件及必读文件。
2. 使用 `.ai/prompts/task-templates/` 中的模板（如适用）。
3. 与用户确认需求范围、红线文件、验收标准。
4. 列出本次任务允许新增/修改的文件清单。
5. 开始实现。
6. 完成后执行 `docs/ai-guidelines/checklists.md` 中的 Post-Task Checklist。

## 关键约定

- 通用组件前缀: `Re`
- Store 命名空间前缀: `pure-`
- API 文件按业务模块组织
- SFC 顺序: `<script setup>` → `<template>` → `<style scoped>`
- 提交前必须通过 `pnpm lint`、`pnpm typecheck`、`pnpm build`
