<template>
  <div :style="{height:height, width:width}">
    <div style="height: 45px;line-height: 45px;width: 100%;border-bottom: 1px solid #EEE;font-size: 16px;font-weight: bold;margin-bottom: 20px;">
      整体概况
    </div>
    <el-form inline>
      <el-form-item label="市/州">
        <el-select v-model="form.city"></el-select>
      </el-form-item>
      <el-form-item label="区/县">
        <el-select v-model="form.county"></el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <div :id="id" :class="className" :style="{height: `calc(${height} - 140px)`, width: '60%'}"/>
  </div>
</template>

<script>
import echarts from "echarts"
import resize from "./mixins/resize"
import map from "@/utils/guizhou.json"

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
      chart: null,
      form: {
        city: '',
        county: ''
      }
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
            name: "贵州",
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
