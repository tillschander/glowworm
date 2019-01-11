<template>
  <div class="properties-sidebar">
    <div class="position">
      <input v-model="activeObject.position.x" type="number">
      <input v-model="activeObject.position.y" type="number">
      <input v-model="activeObject.position.z" type="number">
    </div>
    <input v-model="activeObject.material.color.r" type="range" min="0" max="1" step="0.01">
    <input v-model="activeObject.material.color.g" type="range" min="0" max="1" step="0.01">
    <input v-model="activeObject.material.color.b" type="range" min="0" max="1" step="0.01">
  </div>
</template>

<script>
export default {
  name: "PropertiesSidebar",
  props: {
    objectProperties: String
  },
  computed: {
    activeObject: {
      get() {
        return (
          this.$store.state.activeObject || {
            position: 0,
            material: { color: { r: 0, g: 0, b: 0 } }
          }
        );
      },
      set(value) {
        this.$store.commit("setActiveObject", this.activeObject);
      }
    }
  },
  data: function() {
    return {
      sliderVal: ""
    };
  }
};
</script>

<style scoped lang="scss">
.properties-sidebar {
  position: absolute;
  top: 40%;
  right: 0;
  bottom: 30px;
  width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 20px;
  }

  .position input {
    width: 33.3333%;
  }
}
</style>
