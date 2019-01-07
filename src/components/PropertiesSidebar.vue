<template>
      <div class="properties-sidebar">
        {{ objectProperties }}
      </div>
</template>

<script>
export default {
  name: 'PropertiesSidebar',
  props: {
    objectProperties: String
  }
}
</script>

<style scoped lang="scss">
.properties-sidebar {
  position: absolute;
  top: 60px;
  right: 0;
  bottom: 30px;
  width: 300px;
}
</style>
