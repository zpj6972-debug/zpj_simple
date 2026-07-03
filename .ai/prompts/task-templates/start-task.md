# 开发任务启动模板

## 使用方式

在每次新任务开始时，将本模板内容复制到对话中，并填写具体信息。

```markdown
## 任务背景

[一句话说明本次要做什么]

## 需求范围

- [ ] 新增页面: `views/xxx/xxx.vue`
- [ ] 新增组件: `components/xxx.vue` 或 `views/xxx/components/xxx.vue`
- [ ] 新增 API: `src/api/xxx.ts`
- [ ] 新增 Store: `src/store/modules/xxx.ts`
- [ ] 新增 Composable: `src/composables/useXxx.ts`
- [ ] 修复 bug: [具体描述]
- [ ] 重构: [具体描述]

## 红线文件（本次任务不可修改）

- src/utils/http.ts
- src/router/
- src/store/index.ts
- src/config/index.ts
- build/
- vite.config.ts
- .env
- src/components/Re*/
- [其他根据任务补充]

## 允许修改的文件清单

- [ ]
- [ ]

## 验收标准

- [ ] 功能实现
- [ ] 通过 pnpm lint
- [ ] 通过 pnpm typecheck
- [ ] 通过 pnpm build
- [ ] 关键路径手动验证

## 参考资料

- [相关 issue/文档/设计图]
```
