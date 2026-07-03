import type { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive(<FormRules>{
  user: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  region: [{ required: true, message: "请选择区域", trigger: "change" }]
});
