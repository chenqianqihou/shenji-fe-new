<template>
  <div :style="{height:height, width:width}">
    <div class="dash-chart-title">
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
    <div :style="{height: `calc(${height} - 140px)`, display: 'flex'}">
      <div :id="id" :class="className" :style="{height: '100%', width: '67%'}"/>
      <div style="width: 30%;margin-top: 100px">
        <div>
          <h4>人员概况</h4>
          <el-row>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">人员总数</div>
              <div class="dash-statistic-content">100</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">在点</div>
              <div class="dash-statistic-content">60</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">不在点</div>
              <div class="dash-statistic-content">140</div>
            </el-col>
          </el-row>
        </div>
        <div>
          <h4>项目概况</h4>
          <el-row>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">项目数量</div>
              <div class="dash-statistic-content">100</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">计划阶段</div>
              <div class="dash-statistic-content">100</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">实施阶段</div>
              <div class="dash-statistic-content">100</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">审理阶段</div>
              <div class="dash-statistic-content">100</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">报告阶段</div>
              <div class="dash-statistic-content">100</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">已经结束</div>
              <div class="dash-statistic-content">100</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
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
            aspectScale: 1,
            zoom: 1,
            left: '5%',
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
<style lang="scss" scoped>
  .dash-chart-title{
    height: 57px;
    line-height: 57px;
    width: 100%;
    border-bottom: 1px solid #EEE;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .dash-statistic{
    margin-bottom: 20px;
    &-title {
      margin-bottom: 4px;
      color: rgba(0,0,0,.45);
      font-size: 15px;
    }
    &-content {
      color: rgba(0,0,0,.85);
      font-size: 22px;
      font-family: Tahoma,Helvetica Neue,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    }
  }
</style>