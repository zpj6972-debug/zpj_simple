<script setup lang="ts">
defineOptions({
  name: "Welcome"
});
import { useWelcome } from "./utils/hook";
import { ref } from "vue";
</script>

<template>
  <div>
    <div
      class="w-full h-full el-card flex flex-col items-center justify-center"
    />
  </div>
</template>
