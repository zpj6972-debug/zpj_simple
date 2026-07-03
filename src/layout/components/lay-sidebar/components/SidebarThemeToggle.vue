<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
const { dataTheme, dataThemeChange } = useDataThemeChange();
import { useDark } from "@pureadmin/utils";
const { isDark } = useDark();
let flag = ref(false);
watch(
  isDark,
  val => {
    flag.value = val;
  },
  {
    immediate: true
  }
);
const toggle = (event: MouseEvent) => {
  const doc = document as any;
  const isSupported =
    doc.startViewTransition &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isSupported) {
    flag.value = !flag.value;
    dataTheme.value = flag.value;
    dataThemeChange(flag.value ? "dark" : "light");
    return;
  }
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = computeMaxRadius(x, y);

  // 开启视图过渡
  const transition = doc.startViewTransition(async () => {
    flag.value = !flag.value;
    dataTheme.value = flag.value;
    dataThemeChange(flag.value ? "dark" : "light");
    await nextTick();
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ];

    document.documentElement.animate(
      {
        clipPath: flag.value ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 450,
        easing: "ease-in",
        pseudoElement: flag.value
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)"
      }
    );
  });
};
const computeMaxRadius = (x, y) => {
  const maxX = Math.max(x, window.innerWidth - x);
  const maxY = Math.max(y, window.innerHeight - y);
  return Math.hypot(maxX, maxY);
};
</script>

<template>
  <span class="fullscreen-icon navbar-bg-hover" @click="toggle($event)">
    <IconifyIconOnline
      :icon="!flag ? 'material-symbols-light:dark-mode-rounded' : 'ci:sun'"
      class="size-5"
    />
  </span>
</template>

<style>
::view-transition-new(root),
::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 2147483646;
}

html.dark::view-transition-old(root) {
  z-index: 2147483646;
}

html.dark::view-transition-new(root) {
  z-index: 1;
}
</style>
