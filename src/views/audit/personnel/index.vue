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
    const { $route: { query: { tab }}} = this
    const type = tab ? ([1, 2].includes(+tab) ? '2' : '3') : '3'
    return {
      tabMapOptions: [
        { label: '审计机关', key: '3' },
        { label: '第三方机构', key: '2' }
      ],
      activeName: type
    }
  },
  watch: {
    activeName(newVal) {
      this.$router.push({
        path: '/audit/personnel',
        query: {
          tab: newVal
        }
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
