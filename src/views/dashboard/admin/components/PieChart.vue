<template>
  <div style="height: 400px;">
    <div :class="className" :style="{height:height,width:width}" ref="chart2" />
    <div style="height: 80px;">
      <div style="height: 50px; margin: 15px 0;display:flex;background:#ebeef5;border-radius: 5px;text-align: center;line-height:50px;color: rgba(0, 0, 0, 0.65);" v-if="data.total">
        <div :style="{width: `${gender.male}%`, background: '#409eff', 'border-radius': '5px', color: '#EEE'}">男 {{gender.male}}%</div>
        <div :style="{width: `${gender.female}%`}" v-if="data.gender.female > 0">女 {{gender.female}}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getSex } from '@/api/home'
import { sex } from "../../config"

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '320px'
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
      chartData: [],
      gender: {}
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
      getSex({
        city: this.cityCode
      }).then(res => {
        this.data = res.data
        const { data } = this
        const { age } = this.data
        Object.keys(age).forEach(key => {
          this.chartData.push({
            value: age[key],
            name: sex[key]
          })
        })
        this.gender.male = data.total ? ((data.gender.man / data.total) * 100).toFixed(2) : 0
        this.gender.female = data.total ? ((data.gender.female / data.total) * 100).toFixed(2) : 0
        this.initChart()
      })
    },
    initChart() {
      const that = this
      const { data, chartData } = this
      this.chart = echarts.init(this.$refs.chart2, "macarons")

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "horizontal",
          bottom: 20,
          data: Object.values(sex),
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
                formatter: `总人数\n\n${data.total}`
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
