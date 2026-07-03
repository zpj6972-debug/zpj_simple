# Coding Prompt — 编码规范

## Vue 组件

- 统一使用 `<script setup lang="ts">`
- SFC 顺序: script → template → style
- style 必须加 `scoped lang="scss"`，全局样式在 `src/style/` 中管理
- Props / Emits 必须显式类型化，使用 `withDefaults` 提供默认值
- 模板中禁止复杂表达式，使用 `computed`
- 列表渲染必须提供稳定 `key`
- 谨慎使用 `v-html`，必须做安全过滤

## TypeScript

- 函数参数和返回值必须显式类型
- 禁止隐式 any
- 类型命名:
  - 接口返回: `*Result`
  - 视图对象: `*VO`
  - 表单: `*Form`
  - 查询参数: `*QueryParams`
  - 枚举: `*Enum`
- 数据形状用 `type`，组件 props 用 `interface`

## 样式

- 复杂样式使用 SCSS + BEM: `.user-card__title--active`
- 简单布局使用 Tailwind 工具类
- 颜色/字号/间距必须来自设计 token，禁止硬编码
- 组件内禁止使用 `!important`

## API 封装

- 接口放在 `src/api/<module>.ts`
- 使用 `http.request<T>(method, url, config)`
- 返回类型必须显式声明
- 函数命名: `get*List`, `create*`, `update*`, `delete*`

## Pinia Store

- 文件放在 `src/store/modules/<module>.ts`
- 命名空间: `pure-<module>`
- state 小驼峰，actions 小驼峰
- store 只处理数据和副作用调度，不处理 UI 反馈
- 跨 store 调用通过 `store` 实例，避免循环依赖

## 组件拆分

满足任一条件必须拆分:
- 3 个以上独立 UI 区域
- 同时负责数据获取和大量展示
- props 超过 7 个
- 单文件超过 250 行
- 同一段模板重复 2 次以上

## 数据流

- 优先 props down / events up
- `v-model` 只用于真正的双向组件
- `provide/inject` 只用于深层上下文
- 禁止在子组件中直接修改 props
