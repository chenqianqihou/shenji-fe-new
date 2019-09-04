<template>
  <div style="height: 400px;">
    <div :class="className" :style="{height:height,width:width}" ref="chart2" />
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      this.chart = echarts.init(this.$refs.chart2, 'macarons')

      this.chart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 30,
            top: 40,
            bottom: 20,
            data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        },
        series: [
            {
                 
                name:'访问来源',
                type:'pie',
                radius: ['50%', '70%'],
                center: ['35%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        color:'#4c4a4a',
                        formatter: '共发布活动'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ]
            }
        ]
      })
    }
  }
}
</script>
