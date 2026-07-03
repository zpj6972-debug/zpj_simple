function formatterColor(hslString: string, alpha = 1) {
  // 将字符串拆分为数组
  const hslParts = hslString.split(" ");

  // 拼接成 hsl() 格式
  const hslFormatted = `hsla(${hslParts[0]}, ${hslParts[1]}, ${hslParts[2]}, ${alpha})`;
  return hslFormatted;
}
function echartsInitSheme(echartsDom: any) {
  const dom = document.getElementsByTagName("body");
  if (!dom || !dom[0]) {
    return;
  }
  const rootStyle = getComputedStyle(dom[0]);
  const textColor = formatterColor(
    rootStyle.getPropertyValue("--foreground").trim()
  );
  const textColor8 = formatterColor(
    rootStyle.getPropertyValue("--foreground").trim(),
    0.8
  );
  const textColor5 = formatterColor(
    rootStyle.getPropertyValue("--foreground").trim(),
    0.5
  );
  const lineColor = formatterColor(
    rootStyle.getPropertyValue("--foreground").trim(),
    0.1
  );
  const areaColor = formatterColor(
    rootStyle.getPropertyValue("--background").trim()
  );
  // const backgroundColor = formatterColor(
  //   rootStyle.getPropertyValue("--background").trim()
  // );
  echartsDom.registerTheme("customed", {
    backgroundColor: "transparent",
    title: {
      textStyle: {
        color: textColor
      },
      subtextStyle: {
        color: textColor8
      }
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: lineColor
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: lineColor
        }
      },
      axisLabel: {
        show: true,
        color: textColor
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: [lineColor]
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [areaColor, areaColor]
        }
      }
    },
    valueAxis: {
      nameTextStyle: {
        color: textColor
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: lineColor
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: lineColor
        }
      },
      axisLabel: {
        show: true,
        color: textColor
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: [lineColor]
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [areaColor, areaColor]
        }
      }
    },
    logAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: lineColor
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: lineColor
        }
      },
      axisLabel: {
        show: true,
        color: textColor
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: [lineColor]
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [areaColor, areaColor]
        }
      }
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: lineColor
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: lineColor
        }
      },
      axisLabel: {
        show: true,
        color: textColor
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: [lineColor]
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [areaColor, areaColor]
        }
      }
    },
    toolbox: {
      iconStyle: {
        borderColor: textColor8
      },
      emphasis: {
        iconStyle: {
          borderColor: textColor5
        }
      }
    },
    legend: {
      textStyle: {
        color: textColor
      }
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: areaColor,
          width: 1
        },
        crossStyle: {
          color: areaColor,
          width: 1
        }
      }
    },
    timeline: {
      lineStyle: {
        color: "#DAE1F5",
        width: 2
      },
      itemStyle: {
        color: "#A4B1D7",
        borderWidth: 1
      },
      controlStyle: {
        color: "#A4B1D7",
        borderColor: "#A4B1D7",
        borderWidth: 1
      },
      checkpointStyle: {
        color: "#316bf3",
        borderColor: "fff"
      },
      label: {
        color: "#A4B1D7"
      },
      emphasis: {
        itemStyle: {
          color: "#FFF"
        },
        controlStyle: {
          color: "#A4B1D7",
          borderColor: "#A4B1D7",
          borderWidth: 1
        },
        label: {
          color: "#A4B1D7"
        }
      }
    },
    visualMap: {
      color: ["#bf444c", "#d88273", "#f6efa6"]
    },
    dataZoom: {
      handleSize: "undefined%",
      textStyle: {}
    },
    markPoint: {
      label: {
        color: textColor8
      },
      emphasis: {
        label: {
          color: textColor8
        }
      }
    }
  });
}

export default echartsInitSheme;
