<template>
  <div>
    <div></div>
    <div>{{ this.$store.state.fps.toFixed(2) }} FPS</div>
  </div>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #333333;
  padding: 0 6px;
}
</style>
