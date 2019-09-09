<template>
  <div :style="{height:height, width:width}" v-loading="loading">
    <div class="dash-chart-title">
      整体概况
    </div>
    <el-form inline>
      <el-form-item label="市/州" v-if="regnum.length < 2">
        <el-select v-model="form.city">
          <el-option v-for="(item, idx) in cityJson" :key="idx" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="区/县">
        <el-select v-model="form.county">
          <el-option v-for="(item, idx) in countyJson" :key="idx" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item v-if="regnum.length < 2">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleResetSearch">重置</el-button>
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
              <div class="dash-statistic-content">{{ detail.people.total || 0 }}</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">在点</div>
              <div class="dash-statistic-content">{{ detail.people.isjob || 0 }}</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">不在点</div>
              <div class="dash-statistic-content">{{ detail.people.isnotjob || 0 }}</div>
            </el-col>
          </el-row>
        </div>
        <div>
          <h4>项目概况</h4>
          <el-row>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">项目数量</div>
              <div class="dash-statistic-content">{{ detail.project.total || 0 }}</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">计划阶段</div>
              <div class="dash-statistic-content">{{ detail.project.plan || 0 }}</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">实施阶段</div>
              <div class="dash-statistic-content">{{ detail.project.doing || 0 }}</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">审理阶段</div>
              <div class="dash-statistic-content">{{ detail.project.heard || 0 }}</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">报告阶段</div>
              <div class="dash-statistic-content">{{ detail.project.report || 0 }}</div>
            </el-col>
            <el-col :span="8" class="dash-statistic">
              <div class="dash-statistic-title">已经结束</div>
              <div class="dash-statistic-content">{{ detail.project.complete || 0 }}</div>
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
import axios from 'axios'
import map from "@/utils/guizhou.json"
import { getUserLocation, getAll } from '@/api/home'
import { regionData } from 'element-china-area-data'
const guizhouData = regionData.find(row => +row.value === 520000)

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
      },
      cityJson: guizhouData.children || [],
      countyJson: [],
      detail: {
        people: {},
        project: {}
      },
      loading: false,
      regnum: []
    }
  },
  mounted() {
    this.queryUserLocation()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initClick() {
      const that = this
      this.chart.on('click', function (params) {
        if (that.countyJson.length > 0) {
          const county = that.countyJson.find(row => row.label === params.name)
          that.form.county = county.value
        } else {
          const city = that.cityJson.find(row => row.label === params.name)
          that.form.city = city.value
          // that.handleChangeRegion()
          that.handleSearch()
        }
      })
    },
    queryUserLocation() {
      this.loading = true
      getUserLocation().then(res => {
        const { data } = res
        if (+data.regnum > 520000) {
          data.regnum = '52000,' + data.regnum
        }
        this.regnum = data.regnum ? data.regnum.split(',') : []
        this.form.city = this.regnum[1] || ''
        // this.form.county = this.regnum[2] || ''
        // this.handleChangeRegion()
        if (!this.form.city) {
          this.initChart('guizhou', map)
          this.initClick()
          this.queryData()
        } else {
          this.handleSearch(true)
        }
        this.loading = false
      })
    },
    queryData() {
      const { form: { city, county}} = this
      const params = {}
      if (city) params.city = city
      if (county) params.country = county
      getAll(params).then(res => {
        this.detail = res.data || {}
      })
    },
    handleSearch(first = false) {
      const { form: { city }} = this
      if (city) {
        const url = `/map/${city}_full.json`
        axios({
          url: url
        }).then(res => {
          this.initChart(city, res.data)
          if (first) {
            this.initClick()
          }
        })
      }
      this.queryData()
    },
    handleResetSearch() {
      this.form.city = ''
      this.form.county = ''
      this.countyJson = []
      this.initChart('guizhou', map)
      this.queryData()
    },
    handleChangeRegion() {
      if (this.form.city) {
        const item = this.cityJson.find(row => row.value === this.form.city)
        this.countyJson = item.children || []
      }
    },
    initChart(current, map) {
      const that = this
      this.chart = echarts.init(document.getElementById(this.id))
      echarts.registerMap(current, map)
      this.chart.setOption({
        backgroundColor: "#FFF",
        tooltip : {
          trigger: 'item',
          formatter: '{b}'
        },
        series: [
          {
            name: current,
            type: "map",
            map: current,
            aspectScale: 1,
            zoom: 1,
            left: '5%',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  color: '#FFFF'
                },
                areaColor: '#004981',
                borderColor: '#029fd4',
                borderWidth: 2
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