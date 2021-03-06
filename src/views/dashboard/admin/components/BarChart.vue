<template>
  <div style="height: 400px;">
    <div :class="className" ref="chart1" />
  </div>
</template>

<script>
import echarts from "echarts"
require("echarts/theme/macarons") // echarts theme
import { getProject } from "@/api/home"
import resize from "./mixins/resize"
import { project } from "../../config"
const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    cityCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      data: {},
      chartData: []
    }
  },
  mounted() {
    this.queryData()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    cityCode() {
      this.queryData()
    }
  },
  methods: {
    queryData() {
      this.data = {}
      this.chartData = []
      getProject({
        city: this.cityCode
      }).then(res => {
        this.data = res.data
        const { list } = this.data
        Object.keys(list).forEach(key => {
          this.chartData.push({
            value: list[key],
            name: project[key]
          })
        })
        this.initChart()
      })
    },
    initChart() {
      const that = this
      const { data, chartData } = this
      this.chart = echarts.init(this.$refs.chart1, "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "horizontal",
          bottom: 20,
          data: Object.values(project),
          formatter: function(name) {
            let total = 0
            let tarValue
            for (var i = 0, l = chartData.length; i < l; i++) {
              total += chartData[i].value
              if (chartData[i].name == name) {
                tarValue = chartData[i].value
              }
            }
            return `${name}（${tarValue}）`
          }
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "70%"],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "center",
                color: "#4c4a4a",
                fontSize: 16,
                formatter: `项目总数\n\n${data.total}`
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: chartData
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
