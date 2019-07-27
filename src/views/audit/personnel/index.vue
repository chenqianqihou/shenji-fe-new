<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <tab-pane v-if="activeName==item.key" :type="item.key" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './components/TabPane'

export default {
  name: 'Tab',
  components: { tabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '审计机关', key: '3' },
        { label: '第三方机构', key: '1' }
      ],
      activeName: '3',
      createdTimes: 0
    }
  },
  created() {
    // init the default  selected tab
    const tab = this.$route.query.tab || '3'
    if (tab) {
      this.activeName = tab
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
