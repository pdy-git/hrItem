<template>
  <div id="app">
    <router-view />
    <!-- <testIndex />
    <testIndex2 /> -->
    <!-- <MyPagination
      :total="299"
      :current-page="current"
      @changePageEvent="handleChange"
    /> -->
  </div>
</template>
<script>
// import MyPagination from '@/components/myPagination'
export default {
  name: 'App',
  // components: {
  //   MyPagination
  // },
  data() {
    return {
      current: 1
    }
  },
  methods: {
    handleChange(val) {
      this.current = val
    }
  }
}
</script>
