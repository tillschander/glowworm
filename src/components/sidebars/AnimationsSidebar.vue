<template>
  <div class="animations-sidebar">Animations:
    <br>====
    <div v-for="animation in this.$store.state.animations" class="animation">
      {{ animation }}
      <br>
    
  </div>
</template>

<script>
export default {
  name: "AnimationsSidebar",
  methods: {
    addAnimation: function() {
      this.$store.commit("addAnimation");
    },
    addEffect: function() {
      let self = this;

      this.$dialog({type: "effects", callback: function(options) {
        console.log(options);
      }});
    }
  }
};
</script>

<style scoped lang="scss">
.animations-sidebar {
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: #424242;
  overflow-y: auto;
}

.animation {
  background: #333333;
  padding: 10px;
  margin-bottom: 10px;
}

button {
  width: 100%;
}
</style>
