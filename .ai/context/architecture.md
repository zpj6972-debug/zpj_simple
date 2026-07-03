# 项目架构上下文

## 技术栈

- Vue 3.5
- Vite 7
- TypeScript 5.9
- Pinia 3
- Element Plus 2.11
- Tailwind CSS 4
- pnpm

## 关键目录与文件

| 路径 | 职责 |
|---|---|
| `src/api/` | 业务接口定义与类型 |
| `src/components/Re*/` | 全局通用组件，Re 前缀 |
| `src/composables/` | 可复用状态/副作用逻辑 |
| `src/config/index.ts` | 平台配置读取，禁止修改 |
| `src/directives/` | 全局自定义指令 |
| `src/layout/` | 布局框架 |
| `src/router/` | 路由配置，禁止修改 |
| `src/store/` | Pinia 状态管理 |
| `src/store/index.ts` | store 入口，禁止修改 |
| `src/style/` | 全局 SCSS 样式、主题变量 |
| `src/utils/http.ts` | 请求封装，禁止修改 |
| `src/views/` | 页面级组件，按业务模块分文件夹 |
| `build/` | Vite 构建配置，禁止修改 |
| `vite.config.ts` | Vite 主配置，禁止修改 |

## 命名约定

- 通用组件: `ReXxx`
- Store 命名空间: `pure-<module>`
- API 文件: `src/api/<module>.ts`
- Composable: `useXxx.ts`
- 页面组件: `views/<feature>/index.vue`

## 关键约束

- 公共组件 `src/components/Re*/` 不得修改 props/emits/slots/导出签名
- Store 不处理 UI 反馈
- API 不处理状态管理
- 组件不直接调用 axios
