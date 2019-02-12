<template>
  <div class="animations-sidebar">
    Animations:
    <br>====
    <ul>
      <li v-for="animation in this.$store.state.animations">
        {{ animation }}
      </li>
    </ul>
    <button v-on:click="addAnimation">Add animation</button>
  </div>
</template>

<script>
export default {
  name: "AnimationsSidebar",
  methods: {
    addAnimation: function() {
      this.$store.commit("addAnimation");
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
</style>
