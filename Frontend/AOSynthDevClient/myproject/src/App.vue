<template>
  <div id="app">
    <pageHeader></pageHeader>
    <router-view></router-view>
    <pageFooter></pageFooter>
  </div>
</template>

<script>
import pageHeader from './components/PageHeader'
import pageFooter from './components/PageFooter'
export default {
  name: 'app',
  components: {
    pageHeader,
    pageFooter
  }
}
</script>

<style>
</style>
