<template>
  <div class="dashboard-editor-container">
    <div style="background:#fff;padding:0 16px 0 16px;margin-bottom:32px;height: 40vw;min-height:700px;">
      <chart height="100%" width="100%" />
    </div>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="dashboard-chart-title">审计特长</div>
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="dashboard-chart-title">年龄性别</div>
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="dashboard-chart-title">项目类型</div>
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Chart from './components/Keyboard'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    Chart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  height: 100%;
  padding: 32px;
  background-color: #f0f2f5;
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 5px 16px 0;
    margin-bottom: 32px;
  }

  .dashboard-chart-title{
    height: 45px;
    line-height: 45px;
    width: 100%;
    border-bottom: 1px solid #EEE;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
