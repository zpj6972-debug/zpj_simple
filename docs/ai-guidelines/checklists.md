# AI 开发检查清单

> 本文件提供可复制的 Markdown 清单，供每次任务使用。

---

## 任务开始前检查清单（Pre-Task）

复制以下内容到对话中，逐项确认:

```markdown
- [ ] 已阅读项目根目录 `CLAUDE.md` 和 `.ai/prompts/system.md`
- [ ] 已阅读 `docs/ai-guidelines/` 中的相关规范
- [ ] 已查看本次需求涉及的业务模块目录，了解现有代码风格
- [ ] 已确认本次任务的红线范围（哪些文件不能动）
- [ ] 已列出本次任务需要新增/修改的文件清单
- [ ] 已判断是否需要新增通用组件 / composable / API 模块
- [ ] 已确认是否有现有的 `ReXxx` 组件或 `api/*` 可以复用
- [ ] 已与用户确认需求范围和验收标准
```

---

## 任务完成后自检清单（Post-Task）

复制以下内容到对话中，逐项完成:

```markdown
- [ ] 代码已实现需求，且仅修改了任务范围内的文件
- [ ] 新增文件已放入正确的目录层级
- [ ] 所有新增/修改函数都有类型签名
- [ ] 没有新增的隐式 `any` 或 `@ts-ignore`
- [ ] 没有写死的测试数据、`console.log`、`debugger`
- [ ] 组件拆分符合规范（单文件不超过 250 行、props 不超过 7 个）
- [ ] 已运行 `pnpm lint` 并通过
- [ ] 已运行 `pnpm typecheck` 并通过
- [ ] 已运行 `pnpm build` 并通过
- [ ] 已手动验证关键路径（页面渲染、交互、接口调用）
- [ ] 已按 Conventional Commits 规范书写 commit message
- [ ] 已整理变更文件清单
```

---

## Code Review 清单

人工审查时使用:

```markdown
- [ ] 范围控制: 只修改了需求相关文件，无越界改动
- [ ] 架构合规: 新文件在正确目录，职责清晰
- [ ] 类型安全: 无隐式 any，类型命名规范
- [ ] 组件设计: 拆分合理，props/emits 显式类型化
- [ ] API/Store: 按模块组织，错误处理到位，store 不耦合 UI
- [ ] 样式: scoped，使用设计 token，无硬编码
- [ ] 规范执行: 通过 lint / typecheck / build，commit message 规范
- [ ] 安全: 无未过滤 `v-html`，无敏感信息硬编码
```
