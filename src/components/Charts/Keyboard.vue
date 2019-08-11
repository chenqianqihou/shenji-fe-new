<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts"
import resize from "./mixins/resize"
import map from "@/utils/map.json"

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "200px"
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      echarts.registerMap("guizhou", map)
      this.chart.setOption({
        backgroundColor: "#FFF",
        tooltip : {
          trigger: 'item',
          formatter: '{b}'
        },
        series: [
          {
            name: "中国",
            type: "map",
            map: "guizhou",
            itemStyle: {
              normal: {
                areaColor: '#004981',
                borderColor: '#029fd4',
                borderWidth: 3
              }
            },
            emphasis:{
              color: 'rgba(198, 79, 56, 1)'
            }
          }
        ]
      })
    }
  }
}
</script>
