# AI 协作开发规范 — 完整正文

> 版本: v1.0
> 更新日期: 2026-07-03

## 目录

1. [项目整体架构规范](#1-项目整体架构规范)
2. [AI 开发边界](#2-ai-开发边界)
3. [编码规范](#3-编码规范)
4. [组件设计规范](#4-组件设计规范)
5. [API、错误处理、日志规范](#5-api错误处理日志规范)
6. [Git Commit 与 Code Review 规范](#6-git-commit-与-code-review-规范)
7. [AI 开发前检查清单](#7-ai-开发前检查清单)
8. [AI 开发后自检流程](#8-ai-开发后自检流程)
9. [防止越界修改](#9-防止越界修改)
10. [保持风格一致](#10-保持风格一致)
11. [知识库与上下文](#11-知识库与上下文)
12. [规范分层沉淀](#12-规范分层沉淀)

---

## 1. 项目整体架构规范

### 1.1 目录结构

```
web_init_bak/
├── .ai/                          # AI 专用上下文与提示词
│   ├── prompts/
│   │   ├── system.md
│   │   ├── coding.md
│   │   ├── review.md
│   │   └── task-templates/
│   └── context/
│       ├── architecture.md
│       ├── decisions.md
│       └── memory/
├── build/                        # Vite 构建配置
├── docs/ai-guidelines/           # 本规范
├── mock/                         # 本地 mock
├── public/                       # 静态资源
├── src/
│   ├── api/                      # 接口定义
│   ├── assets/                   # 图片、字体、图标
│   ├── components/               # 全局通用组件（ReXxx）
│   ├── composables/              # 可复用逻辑
│   ├── config/                   # 运行时配置
│   ├── directives/               # 自定义指令
│   ├── layout/                   # 布局框架
│   ├── router/                   # 路由配置
│   ├── store/                    # Pinia 状态管理
│   ├── style/                    # 全局样式
│   ├── utils/                    # 工具函数、http、auth
│   ├── views/                    # 页面级组件
│   ├── App.vue
│   └── main.ts
├── tests/                        # 测试
├── types/                        # 全局类型
├── .cursorrules
├── CLAUDE.md
├── eslint.config.js
├── package.json
└── vite.config.ts
```

### 1.2 职责边界

| 模块 | 职责 | 禁止 |
|---|---|---|
| `views/` | 路由页面、业务编排、数据聚合 | 写通用逻辑、直接封装 API |
| `components/` | 可复用 UI 组件 | 调用业务 API、修改全局状态 |
| `composables/` | 可复用状态/副作用逻辑 | 引入页面级路由或业务上下文 |
| `api/` | 接口声明、类型定义、轻量请求 | 状态管理、UI 反馈 |
| `store/` | 全局/跨模块状态、持久化 | 直接调用组件、写 UI 逻辑 |
| `utils/http.ts` | 请求实例、拦截器 | 业务判断 |
| `utils/` | 纯函数、辅助方法 | 产生副作用 |
| `directives/` | 通用 DOM 行为 | 业务校验 |
| `layout/` | 布局骨架、菜单、标签页 | 耦合具体业务页面 |
| `build/` | 构建配置、环境变量 | 引入 src 业务代码 |

### 1.3 制定原因

目录即约定，新 AI 会话通过目录即可判断代码归属，减少“顺手写在一起”的惯性；分层隔离使各层可独立演进；按业务模块聚合便于搜索和影响范围分析。

---

## 2. AI 开发边界

### 2.1 AI 可以做的事

- 实现新页面、新组件、新 API、新 composable、新 store
- 按规范重构代码、拆分过大组件、提取复用逻辑
- 编写类型、测试、Mock、Demo
- 按模板生成 Git Commit Message
- 运行 lint、typecheck、build 并修复报错
- 在指定范围内修复 bug，只修改最小相关范围

### 2.2 AI 不能做的事

| 红线 | 说明 |
|---|---|
| 不得修改 `src/utils/http.ts`、`src/router/`、`src/store/index.ts`、`src/config/index.ts` | 基础设施，需人工审批 |
| 不得改动 `src/components/Re*/` 的 props/emits/slots/导出签名 | 公共组件，影响面大 |
| 不得引入新的全局依赖 | 新增 npm 包需人工确认 |
| 不得修改 `build/`、`vite.config.ts` | 构建配置需人工审批 |
| 不得修改 `.env`、代理地址、密钥 | 敏感配置 |
| 不得擅自修改他人业务模块 | 只能修改本次需求涉及的模块 |
| 不得为通过 lint/typecheck 而使用 `@ts-ignore`、隐式 any | 必须正确修复 |
| 不得在生产代码中保留 `console.log`、`debugger`、测试数据 | 构建会自动移除，但源码中不应存在 |

### 2.3 制定原因

AI 容易“顺手修复”看到的所有问题，导致 PR 膨胀和无关改动。明确红线后，AI 只做本次任务范围内的事；基础设施和公共组件变更影响面巨大，必须由人评估兼容性。

---

## 3. 编码规范

### 3.1 Vue 组件

- 统一使用 Vue 3 Composition API + `<script setup lang="ts">`
- 已有 TSX/JSX 公共组件保留，新增组件优先 `.vue`
- SFC 顺序: `<script setup>` → `<template>` → `<style scoped lang="scss">`
- 组件命名: 多单词、大驼峰；页面 `views/<feature>/index.vue`；通用 `components/ReXxx/index.vue`
- Props / Emits 必须显式类型化
- 模板中禁止复杂表达式，统一用 `computed`
- 谨慎使用 `v-html`，必须做安全过滤
- 列表渲染必须提供稳定 `key`

### 3.2 TypeScript

- 严格模式优先，函数参数和返回值必须显式类型
- 禁止隐式 any
- 类型命名:
  - DTO/VO: `UserResult`、`UserVO`
  - 表单: `CreateUserForm`
  - 查询参数: `UserQueryParams`
  - 枚举: `UserStatusEnum`
- 数据形状/接口返回用 `type`，组件 props 用 `interface`

### 3.3 样式

- 全局样式: `src/style/` 使用 SCSS
- 组件样式: 必须 `scoped`
- Tailwind CSS v4 用于快速布局，复杂样式用 SCSS
- BEM 用于自定义类名: `.user-card__title--active`
- 颜色/字号/间距来自设计 token，禁止硬编码

### 3.4 接口请求

- 接口封装在 `src/api/<module>.ts`
- 返回类型必须显式声明
- 统一使用 `http.request<T>(method, url, config)`
- 函数命名: 动词 + 名词，如 `getUserList`、`createUser`
- 禁止在业务组件中直接使用 axios

### 3.5 状态管理

- Pinia store 按模块放在 `src/store/modules/`
- 命名空间: `pure-<module>`
- state 和 actions 使用小驼峰
- store 只负责数据和副作用调度，不处理 UI 反馈
- 跨 store 调用通过 `store` 实例，避免循环依赖

### 3.6 制定原因

统一 Composition API 降低不同 AI 输出风格差异；显式类型让 AI 修改代码时更早发现错误；API/Store/组件分层让每一层可独立测试和替换。

---

## 4. 组件设计规范

### 4.1 拆分原则

满足任一条件必须拆分:
- 模板里出现 3 个以上独立 UI 区域
- 同时负责数据获取和大量展示逻辑
- props 数量超过 7 个
- 单文件超过 250 行
- 同一段模板重复出现 2 次以上

### 4.2 命名规范

| 类型 | 命名 | 示例 |
|---|---|---|
| 页面级组件 | `index.vue` 在 `views/<feature>/` | `views/system/user/index.vue` |
| 子页面 | 功能名 + `.vue` | `views/system/user/detail.vue` |
| 通用组件 | `Re` + 功能名 | `components/ReUserCard/index.vue` |
| 业务组件 | 业务域 + 功能名 | `views/system/user/components/UserForm.vue` |
| Composable | `use` + 功能名 | `composables/useUserList.ts` |

### 4.3 复用原则

- 先组合，后继承；优先用 props/slots/composables
- 通用组件必须无业务侵入
- 业务组件放在 `views/<feature>/components/`，禁止放入 `src/components/`
- 新增通用组件前，先搜索是否已有类似 `ReXxx`

### 4.4 制定原因

拆分标准客观化，避免 AI 为省事写大文件；命名规范让搜索和导入可预测；业务组件与通用组件隔离，防止公共组件被污染。

---

## 5. API、错误处理、日志规范

### 5.1 API 封装

```ts
// src/api/user.ts
import { http } from "@/utils/http";

export interface UserVO {
  id: number;
  username: string;
  nickname: string;
}

export interface UserQueryParams {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
}

export const getUserList = (params?: UserQueryParams) =>
  http.request<{ list: UserVO[]; total: number }>("get", "/users", { params });

export const createUser = (data: Partial<UserVO>) =>
  http.request<UserVO>("post", "/users", { data });
```

- 一个业务模块一个文件
- 请求/响应类型与接口函数同文件
- 分页接口统一返回 `{ list, total }`

### 5.2 错误处理

- 请求层: `utils/http.ts` 统一处理网络错误、401、token 刷新、响应码解析
- 业务层: 业务错误在调用处处理，使用 `try/catch`
- 禁止全局吞掉错误
- 用户反馈统一使用 `ElMessage` / `ElMessageBox`

### 5.3 日志

- 开发环境允许 `console.log`，生产构建自动移除
- 错误日志使用统一 `logError(error, context?)`
- 禁止在生产代码中保留 `console.log`

### 5.4 制定原因

统一错误处理避免 AI 写出风格迥异的提示；请求与业务错误分层便于定位；日志统一后未来接入监控成本极低。

---

## 6. Git Commit 与 Code Review 规范

### 6.1 Git Commit 规范

项目已配置 `@commitlint/config-conventional`，必须遵守:

```
<type>(<scope>): <subject>

<body>

<footer>
```

常用 type:

| Type | 含义 |
|---|---|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档更新 |
| `style` | 代码格式 |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |

示例:

```
feat(system/user): 新增用户管理页面

- 添加用户列表、搜索、分页
- 集成 createUser / updateUser / deleteUser 接口
- 抽离 UserForm 和 UserTable 组件
```

### 6.2 Code Review 规范

审查清单:
1. 是否只修改了需求范围内的文件？
2. 是否有未解释的公共组件/基础设施改动？
3. 类型是否完整？是否有新增的 any？
4. 是否遵循目录结构和命名规范？
5. 是否有未清理的 `console.log`、`debugger`、TODO？
6. 是否通过 `pnpm lint`、`pnpm typecheck`、`pnpm build`？
7. 组件拆分是否合理？行数是否过多？
8. API/store/组件职责是否清晰？

### 6.3 制定原因

Commit 规范让 changelog 和回滚更容易；Code Review 清单让人审代码时有明确抓手，不遗漏关键点。

---

## 7. AI 开发前检查清单

AI 在动手写代码前，必须完成:

- [ ] 已阅读项目根目录 `CLAUDE.md` 和 `.ai/prompts/system.md`
- [ ] 已阅读 `docs/ai-guidelines/` 中的相关规范
- [ ] 已查看本次需求涉及的业务模块目录，了解现有代码风格
- [ ] 已确认本次任务的红线范围（哪些文件不能动）
- [ ] 已列出本次任务需要新增/修改的文件清单
- [ ] 已判断是否需要新增通用组件 / composable / API 模块
- [ ] 已确认是否有现有的 `ReXxx` 组件或 `api/*` 可以复用
- [ ] 已与用户确认需求范围和验收标准

---

## 8. AI 开发后自检流程

AI 在提交代码前，必须完成:

- [ ] 代码已实现需求，且仅修改了任务范围内的文件
- [ ] 新增文件已放入正确的目录层级
- [ ] 所有新增/修改函数都有类型签名
- [ ] 没有新增的隐式 `any` 或 `@ts-ignore`
- [ ] 没有写死的测试数据、`console.log`、`debugger`
- [ ] 组件拆分符合规范（单文件不超过 250 行、props 不超过 7 个）
- [ ] 已运行 `pnpm lint` 并通过
- [ ] 已运行 `pnpm typecheck` 并通过
- [ ] 已运行 `pnpm build` 并通过
- [ ] 已手动验证关键路径
- [ ] 已按规范书写 Git Commit Message
- [ ] 已整理变更文件清单

---

## 9. 防止越界修改

### 9.1 技术隔离

1. 文件级保护: 在 `system.md` 中明确列出禁止修改文件清单
2. ESLint / Prettier: 强制格式化，防止以“风格不一致”修改无关文件
3. Git 预提交: `lint-staged` + Husky 拦截不符合规范的提交
4. PR 小粒度: 每次任务只产出 1 个明确需求的变更

### 9.2 流程隔离

1. 需求边界确认: AI 复述需求范围，人确认后再动手
2. 文件白名单: 每次任务列出允许修改的文件清单
3. 禁止自动修复红线内问题: 可报告，不可自行修复
4. Review 检查 diff: 用 `git diff --stat` 快速发现越界

### 9.3 制定原因

技术隔离降低越界可能性，流程隔离确保越界需经人确认，小粒度 PR 让越界改动无处隐藏。

---

## 10. 保持风格一致

### 10.1 自动化约束

| 工具 | 作用 |
|---|---|
| ESLint + typescript-eslint | 强制 TS/Vue 编码规范 |
| Prettier | 统一格式化 |
| Stylelint | 统一样式规范 |
| Husky + lint-staged | 提交前自动校验 |
| Commitlint | 强制 commit 格式 |
| `pnpm typecheck` | 编译期类型检查 |
| `pnpm build` | 构建产物检查 |

### 10.2 定期治理

1. 每周/每迭代抽查 3-5 个 AI 产出，检查规范符合度
2. 每月更新 `docs/ai-guidelines/` 和 `CLAUDE.md`
3. 规范文档使用版本号，重大变更需人审批

### 10.3 AI 提示词固化

把核心规范写入系统提示词，每次新会话自动加载。

### 10.4 制定原因

自动化工具是防止风格漂移的第一道防线；定期审计和版本化确保规范随项目演进；系统提示词让规范成为 AI 的默认行为。

---

## 11. 知识库与上下文

### 11.1 三层知识模型

| 层级 | 内容 | 位置 | 更新频率 |
|---|---|---|---|
| System Prompt | 硬性规则 | `.ai/prompts/system.md` | 低频 |
| Coding Standards | 具体技术约定 | `.ai/prompts/coding.md` | 中频 |
| Architecture Context | 项目结构、关键文件 | `.ai/context/architecture.md` | 中低频 |
| Project Memory | 运行中积累的经验 | `.ai/context/memory/*.md` | 高频 |
| Task Context | 单次任务背景 | 每次会话用户提供 | 每次 |

### 11.2 上下文恢复流程

每次新 AI 会话启动时:
1. 读取 `CLAUDE.md`
2. 读取 `.ai/prompts/system.md` 和 `coding.md`
3. 读取 `.ai/context/architecture.md` 和相关 memory
4. 用户补充本次任务背景、范围、验收标准

### 11.3 制定原因

三层模型把不变规则和变化记忆分开，避免提示词膨胀；架构上下文让新会话快速恢复项目认知；项目记忆持续积累，让 AI 越用越懂项目。

---

## 12. 规范分层沉淀

### 12.1 长期规则（System Prompt）

- 技术栈与版本锁定
- 目录结构与职责边界
- AI 红线
- 通用命名规范
- Commit 规范
- 自检清单

### 12.2 项目文档（docs/ai-guidelines/）

- 完整规范正文
- 具体编码约定示例
- 组件设计模式
- API 错误处理流程
- Code Review 指南

### 12.3 项目记忆（.ai/context/memory/）

- 关键决策记录
- 踩坑记录
- 业务模块特殊约定
- 用户对 AI 输出的反馈和修正

### 12.4 三者关系

```
System Prompt（硬性规则）
    ↓ 每次会话自动注入
AI 行为
    ↓ 参考
Project Docs（完整规范）
    ↓ 更新
Project Memory（经验沉淀）
```

### 12.5 制定原因

系统提示词只放最硬规则，避免冗长；完整文档供人深度阅读和 AI 检索；项目记忆持续积累，让 AI 越用越懂项目。
