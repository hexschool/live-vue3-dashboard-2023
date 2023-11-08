<template>
  <RouterView />
</template>

<script>
export default {
  data() {
    return {}
  },
};
</script>

<style lang="scss">
@import "./assets/scss/all";
// 推薦使用 CDN，因為 svg 不一定可以從 node_modules 導出
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css");
</style>
