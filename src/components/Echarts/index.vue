<template>
  <div :id="id" class="sk-echart-contain" />
</template>
<script lang="ts" setup>
import * as echarts from "echarts";
import { onMounted, onBeforeUnmount, nextTick, watch, toRefs } from "vue";
import echartsInitSheme from "./theme";
import { useDark } from "@pureadmin/utils";

interface Props {
  id: string;
  loading?: boolean;
  options: any;
  Loading?: boolean;
}

const emit = defineEmits([
  "dragEnd",
  "dataZoom",
  "legendselectchanged",
  "chartClick"
]);

let myChart: any = null;

const props = withDefaults(defineProps<Props>(), {
  id: "sk-echart-main",
  loading: false,
  options: () => {
    return {
      title: {
        text: ""
      },
      tooltip: {},
      xAxis: {},
      series: []
    };
  }
});

let { id, loading, options, Loading } = toRefs(props);

watch(
  () => options.value,
  () => nextTick(() => render()),
  { deep: true }
);
const { isDark } = useDark();
watch(isDark, () => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  render();
});
watch(Loading, data => {
  if (data) {
    showLoading();
  } else {
    hideLoading();
  }
});

onMounted(() => {
  nextTick(() => {
    render();
  });
  window.addEventListener("resize", resize);
});

onBeforeUnmount(() => {
  if (myChart) myChart.clear();
  window.removeEventListener("resize", resize);
});

function render() {
  echarts && echartsInitSheme(echarts);
  let firstRender = true;

  if (myChart) {
    firstRender = false;
    myChart.clear();
  } else {
    myChart = echarts.init(document.getElementById(id.value), "customed", {
      locale: "ZH"
    });
  }

  myChart.setOption(options.value);

  if (firstRender) {
    myChart.getZr().on("mouseup", (evt: any) => {
      if (evt.target && evt.target.cursor === "ew-resize") {
        emit("dragEnd", evt);
      }
    });

    myChart.on("click", (params: number) => {
      emit("chartClick", params);
    });

    myChart.on("dataZoom", (zoom: number) => {
      emit("dataZoom", zoom);
    });

    myChart.on("legendselectchanged", (data: any) => {
      emit("legendselectchanged", data);
    });
  }
}

function getOption() {
  return options.value;
}

function setOption(obj: any) {
  if (myChart) myChart.setOption(obj);
}

function showLoading() {
  if (myChart) {
    myChart.showLoading({
      text: "加载中...",
      color: "#00ddff",
      textColor: "#ffffff",
      maskColor: "transparent"
    });
  }
}

function hideLoading() {
  if (myChart) {
    myChart.hideLoading();
  }
}

function resize() {
  nextTick(() => {
    myChart?.resize();
  });
}

function exportChart(file: any) {
  if (myChart) {
    let params = {
      type: "png",
      backgroundColor: "#060b21"
    };

    if (file) Object.assign(params, file);

    let dataUrl = myChart.getDataURL(params);
    let aTag = document.createElement("a");

    aTag.href = dataUrl;
    aTag.download =
      (file && file.name ? file.name : "trend_" + "2025-11-24 12:00:00") +
      ".png";
    document.body.appendChild(aTag);
    aTag.click();
    document.body.removeChild(aTag);
  }
}

function getChart() {
  return myChart;
}
defineExpose({
  showLoading,
  hideLoading,
  resize,
  exportChart,
  getOption,
  setOption,
  getChart
});
</script>
<style lang="scss" scoped>
.sk-echart-contain {
  width: 100%;
  height: 100%;
}
</style>
