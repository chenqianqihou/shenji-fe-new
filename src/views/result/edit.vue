<template>
  <add-edit :result-id="+$route.params.id" />
</template>

<script>
import AddEdit from './components/AddEdit'
export default {
  components: {
    AddEdit
  }
}
</script>

<style lang="scss" scoped>
</style>
