## 基础配置

"Version": "6.2.0", // 平台版本号
"Title": "PureAdmin", // 平台标题
"FixedHeader": true, // 是否固定页头和标签页（true 内容区超出出现纵向滚动条 false 页头、标签页、内容区可纵向滚动）
"HiddenSideBar": false, // 隐藏菜单和页头，只显示标签页和内容区
"MultiTagsCache": false, // 是否开启持久化标签 （会缓存）
"KeepAlive": true, // 是否开启组件缓存（此处不同于路由的 keepAlive，如果此处为 true 表示设置路由的 keepAlive 起效，反之设置 false 屏蔽平台整体的 keepAlive，即使路由设置了keepAlive 也不再起作用）
"Locale": "zh", // 默认国际化语言 （zh 中文、en 英文）（会缓存）（max版本额外配置：tw 繁體中文、ja 日语、ko 韩语）
"Layout": "vertical", // 导航菜单模式 （vertical 左侧菜单模式、horizontal 顶部菜单模式、mix 混合菜单模式）（会缓存）（max版本额外配置：double 左侧双栏菜单模式）
"Theme": "light", // 主题模式（会缓存）
"DarkMode": false, // 是否开启暗黑模式 （会缓存）
"OverallStyle": "light", // 整体风格（浅色：light、深色：dark、自动：system）（会缓存）更多详情看 <https://github.com/pure-admin/vue-pure-admin/commit/dd783136229da9e291b518df93227111f4216ad0#commitcomment-137027417>
"Grey": false, // 灰色模式（会缓存）
"Weak": false, // 色弱模式（会缓存）
"HideTabs": false, // 是否隐藏标签页（会缓存）
"HideFooter": false, // 是否隐藏页脚（会缓存）
"SidebarStatus": true, // vertical左侧菜单模式模式下侧边栏状态（true 展开、false 收起）（会缓存）
"EpThemeColor": "#409EFF", // 主题色（会缓存）
"ShowLogo": true, // 是否显示logo（会缓存）
"ShowModel": "smart", // 标签页风格（smart 灵动模式、card 卡片模式）（会缓存）
"MenuArrowIconNoTransition": false, // 菜单展开、收起图标是否开启动画，如遇菜单展开、收起卡顿设置成 true 即可（默认 false，开启动画）
"CachingAsyncRoutes": false, // 是否开启动态路由缓存本地的全局配置，默认 false
"TooltipEffect": "light", // 可配置平台主体所有 el-tooltip 的 effect 属性，默认 light，不会影响业务代码
"ResponsiveStorageNameSpace": "responsive-", // 本地响应式存储的命名空间
"MenuSearchHistory": 6 // 菜单搜索历史的最大条目

---

# 前端工程开发指南（Developer Guide）

> 基于当前项目代码分析整理
> 文档性质：项目代码分析说明文档
> 目标读者：首次接触本项目的开发人员

---

## 目录

- [一、项目整体架构](#一项目整体架构)
- [二、项目目录结构](#二项目目录结构)
- [三、Mock 服务使用说明](#三mock-服务使用说明重点)
- [四、接口请求机制](#四接口请求机制)
- [五、组件化开发](#五组件化开发重点)
- [六、项目配置](#六项目配置重点)
- [七、页面开发流程](#七页面开发流程)
- [八、项目公共能力](#八项目公共能力)
- [九、样式规范](#九样式规范)
- [十、图表开发规范](#十图表开发规范重点)
- [十一、开发规范总结](#十一开发规范总结)

---

## 一、项目整体架构

### 1.1 技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | `^3.5.22` | 采用 Composition API + `<script setup>` |
| 语言 | TypeScript | `^5.9.3` | 全项目 TS 化 |
| 构建工具 | Vite | `^7.1.12` | 主配置文件：`vite.config.ts` |
| UI 框架 | Element Plus | `^2.11.5` | 手动按需引入，注册文件：`src/plugins/elementPlus.ts` |
| 状态管理 | Pinia | `^3.0.3` | 入口：`src/store/index.ts` |
| 路由 | Vue Router | `^4.6.3` | 入口：`src/router/index.ts` |
| 请求库 | Axios | `^1.12.2` | 二次封装：`src/utils/http/index.ts` |
| 图表库 | ECharts | `^6.0.0` | 按需引入配置：`src/plugins/echarts.ts` |
| CSS 方案 | Tailwind CSS + SCSS | Tailwind `^4.1.16`、sass `^1.93.2` | `src/style/tailwind.css`、`src/style/*.scss` |
| 图标 | Iconify / SVG / Iconfont | `@iconify/vue`、`unplugin-icons` | 统一封装在 `src/components/ReIcon` |
| 工具库 | @pureadmin/utils | `^2.6.2` | 提供 `storageLocal`、`debounce`、`deviceDetection` 等 |
| 表格增强 | @pureadmin/table | `^3.3.0` | 在 `main.ts` 中全局 `app.use(Table)` |
| Mock | vite-plugin-fake-server | `^2.2.0` | 配置在 `build/plugins.ts` |
| 包管理 | pnpm | `>=9` | `package.json` 中 `preinstall` 强制使用 pnpm |
| Node 版本 | Node.js | `^20.19.0 \|\| >=22.13.0` | `engines` 限定 |

### 1.2 架构思想

项目属于 **Vue 3 + Vite 的后台管理中台架构**，整体协作关系如下：

```
public/platform-config.json  （系统运行配置）
           ↓
src/main.ts 启动应用
           ↓
src/App.vue （ElConfigProvider + router-view + ReDialog）
           ↓
src/layout/index.vue  （整体布局：侧边栏、顶部导航、标签页、主体内容）
           ↓
src/views/** 页面组件
           ↓
src/api/** 接口定义  →  src/utils/http/index.ts 请求封装  →  Mock / 后端服务
           ↓
src/store/modules/**  Pinia 状态管理
```

核心模块协作说明：

- **页面（Views）**：`src/views` 下的 `.vue` 文件，一个页面对应一个功能模块，例如 `src/views/welcome/index.vue` 是首页。
- **组件（Components）**：`src/components` 存放公共业务组件，如 `ReDialog`（弹窗）、`ReIcon`（图标）、`ReCol`（栅格）、`ReAuth/RePerms`（权限）。
- **API**：`src/api` 下按业务模块拆分，例如 `src/api/user.ts` 定义登录相关接口。
- **Store**：`src/store/modules` 下有 `user`、`permission`、`multiTags`、`app`、`settings` 等模块，管理登录态、路由菜单、标签页、布局配置。
- **Utils**：`src/utils` 提供认证、消息提示、打印、树处理、响应式存储、请求封装等工具。
- **Hooks**：主要在 `src/layout/hooks`（布局相关）和页面内部 `utils/hook.ts`（业务逻辑抽离）。
- **Directives**：`src/directives` 提供 `v-auth`、`v-perms`、`v-copy`、`v-longpress` 等自定义指令。
- **公共配置**：环境变量 `.env*`、`public/platform-config.json`、`src/config/index.ts`、`vite.config.ts`。

---

## 二、项目目录结构

### 2.1 根目录关键文件

| 文件 | 作用 |
|------|------|
| `vite.config.ts` | Vite 主配置：端口、代理、别名、插件、构建 |
| `package.json` | 依赖、脚本、引擎约束 |
| `.env` / `.env.development` / `.env.production` | 环境变量 |
| `eslint.config.js` / `stylelint.config.js` | ESLint / Stylelint 配置 |
| `postcss.config.js` | PostCSS 配置，生产环境启用 cssnano |
| `public/platform-config.json` | 运行时全局配置 |
| `build/` | Vite 插件、构建工具函数、CDN/压缩/依赖预构建配置 |

### 2.2 `src` 主要目录

#### `src/views` — 页面目录

存放所有业务页面，一个菜单页通常对应一个文件夹。

实际示例：

- `src/views/welcome/index.vue`：首页
- `src/views/welcome/form.vue`：首页内弹窗使用的表单组件
- `src/views/welcome/utils/hook.tsx`：首页的业务 hook
- `src/views/welcome/utils/rules.ts`：表单校验规则
- `src/views/welcome/utils/types.ts`：类型定义
- `src/views/login/index.vue`：登录页
- `src/views/permission/button/index.vue`：按钮权限示例页
- `src/views/error/403.vue`、`404.vue`、`500.vue`：异常页

使用规范：页面级组件写在 `views` 下；若页面较复杂，可在页面目录内拆分子组件和 `utils` 目录。

#### `src/components` — 公共组件

| 组件 | 路径 | 作用 |
|------|------|------|
| ReAuth | `src/components/ReAuth` | 按钮级权限组件（基于路由 `meta.auths`） |
| RePerms | `src/components/RePerms` | 按钮级权限组件（基于登录返回 `permissions`） |
| ReDialog | `src/components/ReDialog` | 全局弹窗管理组件，提供 `addDialog`/`closeDialog` |
| ReCol | `src/components/ReCol` | 对 `ElCol` 的二次封装 |
| ReIcon | `src/components/ReIcon` | 统一图标渲染，支持 iconfont / svg / iconify |
| RePureTableBar | `src/components/RePureTableBar` | 表格工具栏封装 |
| ReSegmented | `src/components/ReSegmented` | 分段控制器 |
| ReText | `src/components/ReText` | 文本省略 + tippy 提示 |

#### `src/api` — 接口定义

按业务拆分，示例：

```ts
// src/api/user.ts
import { http } from "@/utils/http";

export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login", { data });
};
```

实际接口：`/login`、`/refresh-token`、`/get-async-routes` 定义在 `src/api/user.ts` 和 `src/api/routes.ts`。

#### `src/utils` — 工具函数

| 文件 | 作用 |
|------|------|
| `src/utils/http/index.ts` | Axios 二次封装（PureHttp 类） |
| `src/utils/auth.ts` | Token 读写、权限判断 |
| `src/utils/message.ts` | 基于 Element Plus Message 的封装 |
| `src/utils/mitt.ts` | 全局事件总线 |
| `src/utils/tree.ts` | 树形数据处理 |
| `src/utils/print.ts` | 打印工具 |
| `src/utils/responsive.ts` | 响应式 localStorage 注入 |
| `src/utils/propTypes.ts` | 扩展 vue-types |

#### `src/store/modules` — 状态管理

- `user.ts`：登录、登出、Token 刷新、用户信息
- `permission.ts`：菜单、缓存路由
- `multiTags.ts`：多标签页
- `app.ts`：侧边栏、布局、设备类型、视口
- `settings.ts`：标题、固定头部、隐藏侧边栏

#### `src/router` — 路由

- `src/router/index.ts`：路由实例、路由守卫、自动导入 `modules`
- `src/router/modules/home.ts`：首页路由
- `src/router/modules/error.ts`：异常页面路由
- `src/router/modules/remaining.ts`：不参与菜单的路由（登录、403、500、redirect）
- `src/router/utils.ts`：路由排序、动态路由处理、权限过滤、历史模式

#### `src/layout` — 布局框架

- `src/layout/index.vue`：整体布局根组件
- `src/layout/components/lay-sidebar`：侧边栏
- `src/layout/components/lay-tag`：标签页
- `src/layout/components/lay-content`：主体内容区
- `src/layout/hooks`：布局相关 Hooks

#### `src/directives` — 自定义指令

- `auth`、`perms`：按钮权限
- `copy`：双击复制
- `longpress`：长按
- `optimize`：优化相关
- `ripple`：水波纹效果

#### `src/plugins` — 插件配置

- `elementPlus.ts`：Element Plus 手动按需引入
- `echarts.ts`：ECharts 按需引入（当前 `main.ts` 中未启用）

#### `src/style` — 样式

- `index.scss`：引入主题、过渡、Element 定制、侧边栏、暗黑模式
- `reset.scss`：CSS Reset
- `tailwind.css`：Tailwind CSS v4 配置
- `element-plus.scss`：Element Plus 样式覆盖
- `sidebar.scss`：侧边栏样式
- `dark.scss`：暗黑模式变量
- `theme.scss`：主题变量
- `transition.scss`：过渡动画
- `login.css`：登录页样式

#### `mock` — Mock 数据

- `mock/login.ts`：登录接口 Mock
- `mock/asyncRoutes.ts`：动态路由 Mock
- `mock/refreshToken.ts`：刷新 Token Mock

#### `build` — 构建配置

- `plugins.ts`：Vite 插件列表
- `utils.ts`：别名、环境变量处理、路径解析
- `optimize.ts`：依赖预构建配置
- `cdn.ts`：CDN 配置
- `compress.ts`：gzip/brotli 压缩配置
- `info.ts`：打包信息插件

---

## 三、Mock 服务使用说明（重点）

### 3.1 Mock 如何开启

Mock 由 `vite-plugin-fake-server` 提供，在 `build/plugins.ts` 中注册：

```ts
// build/plugins.ts
import { vitePluginFakeServer } from "vite-plugin-fake-server";

vitePluginFakeServer({
  logger: false,
  include: "mock",
  infixName: false,
  enableProd: true  // 生产环境也启用
})
```

只要项目启动（`pnpm dev` 或 `pnpm build`），Mock 服务就会自动启用，无需额外启动服务。

### 3.2 Mock 如何关闭

目前配置中 `enableProd: true`，开发/生产默认都开启。若需关闭，可：

1. 修改 `build/plugins.ts`，将 `enableProd` 改为 `false`，或注释掉 `vitePluginFakeServer` 插件。
2. 关闭后，请求会走 Vite 的 `server.proxy` 代理到真实后端。

代理配置在 `vite.config.ts`：

```ts
// vite.config.ts
server: {
  proxy: {
    "/api": {
      target: "http://172.16.11.120",
      changeOrigin: true,
      secure: false,
      rewrite: (path: any) => path.replace(/^\/api/, "")
    }
  }
}
```

当前项目接口没有统一加 `/api` 前缀（如 `/login`），所以该代理目前未实际生效。若后端接口以 `/api` 开头，可统一修改。

### 3.3 Mock 数据存放位置

| 位置 | 说明 |
|------|------|
| `mock/*.ts` | 全局 Mock 接口，按接口模块拆分 |
| 页面内部 | 页面内直接写死数据用于 UI 占位（不推荐作为接口 mock） |

当前项目所有 Mock 接口都集中在 `mock/` 目录：

- `mock/login.ts`：模拟 `/login` 登录
- `mock/asyncRoutes.ts`：模拟 `/get-async-routes` 动态路由
- `mock/refreshToken.ts`：模拟 `/refresh-token`

### 3.4 新增一个 Mock 接口的完整流程

**步骤 1：新建 Mock 数据文件**

在 `mock/` 下新建文件，例如 `mock/user.ts`：

```ts
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/user/list",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          { id: 1, name: "张三" },
          { id: 2, name: "李四" }
        ]
      };
    }
  }
]);
```

**步骤 2：注册接口（自动）**

`vite-plugin-fake-server` 会自动扫描 `include: "mock"` 目录下的所有文件，无需手动注册。

**步骤 3：页面调用**

在 `src/api/user.ts` 中定义：

```ts
import { http } from "@/utils/http";

type UserListResult = {
  success: boolean;
  data: Array<{ id: number; name: string }>;
};

export const getUserList = () => {
  return http.request<UserListResult>("get", "/user/list");
};
```

页面中使用：

```ts
import { getUserList } from "@/api/user";

const fetchData = async () => {
  const res = await getUserList();
  console.log(res.data);
};
```

**步骤 4：切换真实接口**

1. 关闭 Mock 插件或设置 `enableProd: false`。
2. 在 `vite.config.ts` 中配置真实后端代理，或修改 `src/utils/http/index.ts` 中的 `baseURL`。
3. 确保真实接口路径与 Mock 一致（如 `/user/list`）。

---

## 四、接口请求机制

### 4.1 请求流程

```
页面 (View)
  ↓ 调用
API 层 (src/api/xxx.ts)
  ↓ 调用 http.request
PureHttp 封装 (src/utils/http/index.ts)
  ↓ 调用
Axios
  ↓
Mock 服务 / 后端接口
```

### 4.2 请求封装位置

核心文件：`src/utils/http/index.ts`

```ts
const defaultConfig: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};
```

### 4.3 请求拦截器

在 `PureHttp.httpInterceptorsRequest()` 中实现：

- 支持 `beforeRequestCallback` 自定义前置处理。
- Token 白名单：`/refresh-token`、`/login` 不携带 Token。
- 其他请求自动从 `getToken()` 读取 Token 并设置 `Authorization: Bearer xxx`。
- Token 过期时调用 `useUserStoreHook().handRefreshToken()` 无感刷新，并暂存后续请求。

关键代码（`src/utils/http/index.ts:60-113`）：

```ts
const whiteList = ["/refresh-token", "/login"];
return whiteList.some(url => config.url.endsWith(url))
  ? config
  : new Promise(resolve => {
      const data = getToken();
      if (data) {
        const now = new Date().getTime();
        const expired = parseInt(data.expires) - now <= 0;
        if (expired) {
          if (!PureHttp.isRefreshing) {
            PureHttp.isRefreshing = true;
            useUserStoreHook()
              .handRefreshToken({ refreshToken: data.refreshToken })
              .then(res => {
                const token = res.data.accessToken;
                config.headers["Authorization"] = formatToken(token);
                PureHttp.requests.forEach(cb => cb(token));
                PureHttp.requests = [];
              })
              .finally(() => {
                PureHttp.isRefreshing = false;
              });
          }
          resolve(PureHttp.retryOriginalRequest(config));
        } else {
          config.headers["Authorization"] = formatToken(data.accessToken);
          resolve(config);
        }
      } else {
        resolve(config);
      }
    });
```

### 4.4 响应拦截器

在 `PureHttp.httpInterceptorsResponse()` 中实现：

- 支持 `beforeResponseCallback` 自定义后置处理。
- 默认直接返回 `response.data`。
- 错误处理区分取消请求和非取消请求。

```ts
instance.interceptors.response.use(
  (response: PureHttpResponse) => {
    const $config = response.config;
    if (typeof $config.beforeResponseCallback === "function") {
      $config.beforeResponseCallback(response);
      return response.data;
    }
    if (PureHttp.initConfig.beforeResponseCallback) {
      PureHttp.initConfig.beforeResponseCallback(response);
      return response.data;
    }
    return response.data;
  },
  (error: PureHttpError) => {
    const $error = error;
    $error.isCancelRequest = Axios.isCancel($error);
    return Promise.reject($error);
  }
);
```

### 4.5 Token 管理

在 `src/utils/auth.ts` 中：

- `TokenKey = "authorized-token"`：存 Cookie
- `userKey = "user-info"`：存 localStorage
- `multipleTabsKey = "multiple-tabs"`：存在 Cookie，用于多标签页登录态共享
- `getToken()`：优先读 Cookie，没有则读 localStorage
- `setToken(data)`：写入 Cookie + localStorage
- `removeToken()`：清除登录态
- `formatToken(token)`：格式化为 `Bearer xxx`

### 4.6 Loading / 超时 / BaseURL

- **超时**：`timeout: 10000`（10 秒）
- **BaseURL**：当前未显式设置 `baseURL`，请求直接以相对路径发出。
- **Loading**：项目未在请求层统一封装 Loading，由页面自行通过 `el-button :loading` 或 `el-loading` 控制。

---

## 五、组件化开发（重点）

### 5.1 公共组件放在哪里

所有公共组件放在 `src/components` 下，命名统一以 `Re` 开头，例如：

- `ReDialog`：全局弹窗
- `ReIcon`：统一图标
- `ReCol`：栅格封装
- `ReAuth/RePerms`：权限组件

### 5.2 页面组件如何拆分

以 `src/views/welcome` 为例：

```
src/views/welcome/
  ├── index.vue          # 页面入口
  ├── form.vue           # 弹窗内表单子组件
  └── utils/
      ├── hook.tsx       # 页面业务逻辑 hook
      ├── rules.ts       # 表单校验规则
      └── types.ts       # 类型定义
```

典型复杂页面可拆分为：

- 查询表单组件
- 表格组件
- 分页组件
- Dialog / Drawer 组件
- 详情组件
- 图表组件

### 5.3 父子组件如何通信

项目主要采用以下方式：

1. **Props + Emit**：标准 Vue 父子通信
2. **ref + defineExpose**：父组件调用子组件方法

示例：`src/views/welcome/form.vue`

```ts
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ user: "", region: "" })
});

const newFormInline = ref({ ...props.formInline });
const ruleFormRef = ref();
const getRef = () => ruleFormRef.value;
defineExpose({ getRef });
```

父组件通过 `h(forms, { ref: formRef })` 拿到子组件实例，再调用 `formRef.value?.getRef()` 获取表单引用。

3. **全局状态（Pinia）**：跨组件共享数据
4. **全局事件总线（mitt）**：`src/utils/mitt.ts`

项目中父子通信以 **Props + ref/defineExpose** 为主，复杂状态走 Pinia。

### 5.4 如何新增一个公共组件

以新增 `ReExample` 为例：

1. 在 `src/components/ReExample/` 下创建：
   - `index.ts`：导出组件
   - `src/index.vue`：组件实现
   - `type.ts`：类型定义（可选）

2. `index.ts` 示例：

```ts
import { withInstall } from "@pureadmin/utils";
import reExample from "./src/index.vue";

export const ReExample = withInstall(reExample);
export default ReExample;
```

3. 全局注册（如需要）：在 `src/main.ts` 中 `app.component("ReExample", ReExample)`。

---

## 六、项目配置（重点）

### 6.1 环境配置

| 文件 | 作用 |
|------|------|
| `.env` | 基础环境变量，开发/生产都会加载 |
| `.env.development` | 开发环境专属 |
| `.env.staging` | 测试环境（需手动创建或使用） |
| `.env.production` | 生产环境专属 |

当前 `.env` 内容：

```ini
VITE_PORT = 8848
VITE_HIDE_HOME = false
```

当前 `.env.development` 内容：

```ini
VITE_PORT = 8848
VITE_PUBLIC_PATH = /
VITE_ROUTER_HISTORY = "hash"
```

当前 `.env.production` 内容：

```ini
VITE_PUBLIC_PATH = /
VITE_ROUTER_HISTORY = "hash"
VITE_CDN = false
VITE_COMPRESSION = "none"
```

### 6.2 接口地址配置

- 开发环境代理：`vite.config.ts` 中 `server.proxy`，当前目标为 `http://172.16.11.120`。
- 请求 BaseURL：当前未设置，可在 `src/utils/http/index.ts` 的 `defaultConfig` 中添加 `baseURL`。

### 6.3 路由配置

- 静态路由：`src/router/modules/*.ts`
- 动态路由：后端返回，由 `src/router/utils.ts` 中的 `initRouter()` 处理
- 路由历史模式：由 `.env` 中的 `VITE_ROUTER_HISTORY` 控制（`hash` / `h5`）

### 6.4 菜单配置

菜单由路由 `meta` 字段自动生成，无需单独配置菜单文件。

路由示例（`src/router/modules/home.ts`）：

```ts
export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "ep/home-filled",
    title: "首页",
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "首页"
      }
    }
  ]
} satisfies RouteConfigsTable;
```

`rank` 控制菜单排序，`icon` 使用 iconify 图标名。

### 6.5 权限配置

权限分为两类：

1. **页面级权限**：路由 `meta.roles`，例如：

```ts
meta: {
  roles: ["admin", "common"]
}
```

2. **按钮级权限**：
   - 路由 `meta.auths`（用于 `Auth` 组件/指令）
   - 登录接口返回的 `permissions`（用于 `Perms` 组件/指令）

权限判断函数：

- `hasAuth(value)`：`src/router/utils.ts`，基于当前路由 `meta.auths`
- `hasPerms(value)`：`src/utils/auth.ts`，基于登录返回 `permissions`

### 6.6 国际化

当前项目未启用国际化。`src/App.vue` 中固定使用 `zhCn`：

```ts
import zhCn from "element-plus/es/locale/lang/zh-cn";
```

如需国际化，需引入 `vue-i18n` 并配置语言包。

### 6.7 Element 配置

- 组件注册：`src/plugins/elementPlus.ts` 手动按需引入
- 语言包：`src/App.vue` 中 `ElConfigProvider` 传入 `zhCn`
- 主题色：由 `public/platform-config.json` 中 `EpThemeColor` 控制

### 6.8 全局样式

- 入口：`src/main.ts` 引入 `src/style/reset.scss`、`src/style/index.scss`、`src/style/tailwind.css`
- 主题变量：`src/style/theme.scss`
- Element 样式覆盖：`src/style/element-plus.scss`
- 侧边栏样式：`src/style/sidebar.scss`
- 暗黑模式：`src/style/dark.scss`

### 6.9 ECharts 配置

- 按需引入配置：`src/plugins/echarts.ts`
- 当前 `main.ts` 中未启用（注释掉了 `useEcharts`）
- 如需使用图表，取消 `main.ts` 中 `// .use(useEcharts)` 注释，并在页面中通过 `getCurrentInstance().appContext.config.globalProperties.$echarts` 访问

### 6.10 Proxy 配置

位置：`vite.config.ts`

```ts
server: {
  proxy: {
    "/api": {
      target: "http://172.16.11.120",
      changeOrigin: true,
      secure: false,
      rewrite: (path: any) => path.replace(/^\/api/, "")
    }
  }
}
```

当前接口路径没有 `/api` 前缀，所以代理未生效。若后端接口统一以 `/api` 开头，可直接使用。

### 6.11 Vite 配置

主文件：`vite.config.ts`

关键配置项：

- `base: VITE_PUBLIC_PATH`：部署基础路径
- `root`：项目根目录
- `resolve.alias`：别名 `@` 指向 `src`
- `server.port`：开发端口，默认 8848
- `server.proxy`：开发代理
- `plugins`：插件列表，由 `build/plugins.ts` 生成
- `optimizeDeps`：依赖预构建
- `build.target`：`es2015`
- `build.rollupOptions.output`：静态资源分类打包

别名配置在 `build/utils.ts`：

```ts
const alias: Record<string, string> = {
  "@": pathResolve("../src"),
  "@build": pathResolve()
};
```

---

## 七、页面开发流程

新增一个菜单页面的完整流程：

### 7.1 新建 View

在 `src/views/` 下创建页面目录和文件，例如 `src/views/demo/index.vue`：

```vue
<script setup lang="ts">
defineOptions({
  name: "Demo"
});
</script>

<template>
  <div>Demo 页面</div>
</template>
```

### 7.2 新建 API（如有后端接口）

在 `src/api/demo.ts` 中定义：

```ts
import { http } from "@/utils/http";

export const getDemoList = () => {
  return http.request<any>("get", "/demo/list");
};
```

### 7.3 配置 Router

在 `src/router/modules/demo.ts` 中新增：

```ts
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/demo",
  component: Layout,
  redirect: "/demo/index",
  meta: {
    icon: "ep/menu",
    title: "示例菜单",
    rank: 10
  },
  children: [
    {
      path: "/demo/index",
      name: "Demo",
      component: () => import("@/views/demo/index.vue"),
      meta: {
        title: "示例页面"
      }
    }
  ]
} satisfies RouteConfigsTable;
```

`src/router/index.ts` 会自动通过 `import.meta.glob` 扫描 `src/router/modules/**/*.ts`。

### 7.4 配置菜单

无需单独配置，菜单由路由 `meta` 自动生成。

### 7.5 调接口

在页面中：

```ts
import { getDemoList } from "@/api/demo";
import { onMounted } from "vue";

onMounted(async () => {
  const res = await getDemoList();
  console.log(res);
});
```

### 7.6 引入组件

使用 Element Plus 组件直接写标签即可（已全局注册），使用公共组件如：

```vue
<script setup lang="ts">
import ReCol from "@/components/ReCol";
</script>
```

### 7.7 页面布局

推荐使用 `el-card` 包裹内容，配合 `el-row/el-col` 或 `ReCol` 进行栅格布局。

---

## 八、项目公共能力

### 8.1 公共 Hooks

| Hook | 位置 | 作用 |
|------|------|------|
| `useLayout` | `src/layout/hooks/useLayout.ts` | 布局初始化 |
| `useNav` | `src/layout/hooks/useNav.ts` | 导航相关 |
| `useTag` | `src/layout/hooks/useTag.ts` | 标签页相关 |
| `useMultiFrame` | `src/layout/hooks/useMultiFrame.ts` | iframe 多开 |
| `useBoolean` | `src/layout/hooks/useBoolean.ts` | boolean 状态管理 |
| `useDataThemeChange` | `src/layout/hooks/useDataThemeChange.ts` | 主题切换 |
| `useWelcome` | `src/views/welcome/utils/hook.tsx` | 页面级业务 hook 示例 |

### 8.2 公共 Utils

| 工具 | 用法 |
|------|------|
| `message(msg, { type: 'success' })` | 消息提示 |
| `storageLocal()` | localStorage 封装（来自 `@pureadmin/utils`） |
| `debounce(fn, wait, immediate)` | 防抖 |
| `deviceDetection()` | 设备检测 |
| `getToken/setToken/removeToken` | Token 管理 |
| `hasAuth/hasPerms` | 权限判断 |
| `buildHierarchyTree/handleTree` | 树处理 |
| `Print` | 打印 |

### 8.3 日期工具

使用 `dayjs`，例如：

```ts
import dayjs from "dayjs";
dayjs().format("YYYY-MM-DD HH:mm:ss");
```

### 8.4 下载 / 导出

项目当前未封装统一的下载/导出工具，可直接使用 Axios 请求 Blob 数据。

### 8.5 权限控制

- 页面级：`meta.roles`
- 按钮级：`Auth` 组件、`Perms` 组件、`v-auth` 指令、`v-perms` 指令、`hasAuth()`、`hasPerms()`

---

## 九、样式规范

### 9.1 采用方案

- **Tailwind CSS v4**：原子类，主要工具类来源
- **SCSS**：复杂样式、主题变量、组件覆写
- **Scoped**：Vue 单文件组件样式默认 `scoped`
- **不使用 CSS Modules**

### 9.2 页面样式如何组织

- 简单页面：直接写在 `<style scoped>` 中
- 复杂页面：引入独立 CSS/SCSS 文件，如登录页：

```vue
<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
```

### 9.3 公共样式如何复用

- Tailwind 工具类：`flex`、`w-full`、`h-full`、`mt-4` 等
- 自定义 `@utility`：`src/style/tailwind.css` 中定义了 `flex-c`、`flex-bc`、`navbar-bg-hover`
- SCSS 变量：`src/style/theme.scss` 等

---

## 十、图表开发规范（重点）

当前项目 ECharts 配置在 `src/plugins/echarts.ts` 中，但 `main.ts` 未启用。图表开发建议如下：

### 10.1 启用 ECharts

取消 `src/main.ts` 中的注释：

```ts
import { useEcharts } from "@/plugins/echarts";
// ...
app.use(useEcharts);
```

### 10.2 按需引入

`src/plugins/echarts.ts` 已按需引入：

- 图表：`PieChart`、`BarChart`、`LineChart`
- 组件：`GridComponent`、`LegendComponent`、`TooltipComponent` 等
- 渲染器：`CanvasRenderer`、`SVGRenderer`

新增图表类型时，在此文件中补充引入。

### 10.3 公共配置

建议抽离 `src/utils/echarts.ts` 统一配置：

```ts
export const commonOptions = {
  tooltip: { trigger: "axis" },
  legend: { bottom: 0 },
  grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true }
};
```

### 10.4 Resize / 销毁

页面中使用 `useECharts` hook（来自 `@pureadmin/utils`）可自动处理 resize 和销毁：

```ts
import { useECharts } from "@pureadmin/utils";

const chartRef = ref();
const { setOptions } = useECharts(chartRef);

onMounted(() => {
  setOptions({ ... });
});
```

### 10.5 Empty 状态

无数据时由页面自行使用 `el-empty` 组件控制。

### 10.6 Mock 数据

图表数据可通过 `mock/` 下的接口返回，页面调 `src/api` 获取。

---

## 十一、开发规范总结

### 11.1 文件命名规范

- 页面目录：`kebab-case`，如 `src/views/permission/button`
- 组件文件：大驼峰，如 `ReDialog/index.vue`
- API 文件：小写，如 `user.ts`
- Hook 文件：`useXxx.ts` 或页面内 `hook.tsx`
- 样式文件：与组件/页面同名，`.scss` 或 `.css`

### 11.2 组件命名规范

- 公共组件以 `Re` 前缀命名
- 页面组件使用 `defineOptions({ name: "Xxx" })` 声明 name
- name 与路由 name 保持一致，用于 keep-alive 和标签页

### 11.3 API 命名规范

- 文件按业务模块拆分
- 函数采用 `getXxx`、`postXxx`、`updateXxx`、`deleteXxx` 等语义化命名
- 返回 `http.request<T>(method, url, config)`

### 11.4 CSS 命名规范

- 优先使用 Tailwind 原子类
- 需要覆写 Element Plus 时使用 `:deep()`
- 主题/公共变量放在 `src/style/` 下

### 11.5 Git 开发规范

项目配置了：

- `husky`：`package.json` 中 `"prepare": "husky"`
- `lint-staged`：package.json scripts 中有 `lint:eslint`、`lint:prettier`、`lint:stylelint`
- `commitlint`：依赖已安装 `@commitlint/cli`、`@commitlint/config-conventional`

提交前建议执行：

```bash
pnpm lint
```

### 11.6 推荐开发流程

1. 从路由开始：在 `src/router/modules/` 新增路由文件
2. 创建页面：`src/views/xxx/index.vue`
3. 拆分组件/子页面到同目录下
4. 定义 API：`src/api/xxx.ts`
5. 编写 Mock（如需）：`mock/xxx.ts`
6. 页面调接口、写业务逻辑
7. 样式优先 Tailwind，复杂场景使用 SCSS
8. 提交前执行 `pnpm lint`

---

## 附录：常用命令

```bash
# 安装依赖（强制使用 pnpm）
pnpm install

# 启动开发服务
pnpm dev

# 构建生产包
pnpm build

# 构建测试包
pnpm build:staging

# 预览生产包
pnpm preview

# 类型检查
pnpm typecheck

# 代码格式化与校验
pnpm lint
pnpm lint:eslint
pnpm lint:prettier
pnpm lint:stylelint
```
