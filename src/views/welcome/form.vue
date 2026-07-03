<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rules";
import { FormProps } from "./utils/types";

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ user: "", region: "" })
});

// vue 规定所有的 prop 都遵循着单向绑定原则，直接修改 prop 时，Vue 会抛出警告。此处的写法仅仅是为了消除警告。
// 因为对一个 reactive 对象执行 ref，返回 Ref 对象的 value 值仍为传入的 reactive 对象，
// 即 newFormInline === props.formInline 为 true，所以此处代码的实际效果，仍是直接修改 props.formInline。
// 但该写法仅适用于 props.formInline 是一个对象类型的情况，原始类型需抛出事件
// 推荐阅读：https://cn.vuejs.org/guide/components/props.html#one-way-data-flow
const newFormInline = ref({ ...props.formInline });

const ruleFormRef = ref();
const getRef = () => {
  return ruleFormRef.value;
};
defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules">
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24"
        ><el-form-item label="姓名" prop="user">
          <el-input
            v-model="newFormInline.user"
            class="w-full"
            placeholder="请输入"
          /> </el-form-item
      ></re-col>
      <re-col :value="12" :xs="24" :sm="24"
        ><el-form-item label="城市" prop="region">
          <el-select
            v-model="newFormInline.region"
            class="w-full"
            placeholder="请选择"
          >
            <el-option label="上海" value="上海" />
            <el-option label="浙江" value="浙江" />
            <el-option label="深圳" value="深圳" />
          </el-select> </el-form-item
      ></re-col>
    </el-row>
  </el-form>
</template>
