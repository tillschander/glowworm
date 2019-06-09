<template>
  <div class="animations-sidebar">
    <b>Animations</b>
    <br>
    <div
      v-bind:key="animation.uuid"
      v-bind:class="{ active: isActive(animation), animation }"
      v-for="animation in this.$store.state.animations.animations"
      v-on:click="setAnimation(animation)"
    >{{ getNameFromUuid(animation.uuid) }}</div>
  </div>
</template>

<script>
export default {
  name: "AnimationsSidebar",
  props: ["side"],
  methods: {
    getNameFromUuid: function(uuid) {
      let animation = this.$store.state.scene.getObjectByProperty("uuid", uuid);
      return animation.name ? animation.name : animation.userData.type;
    },
    setAnimation: function(animation) {
      this.$store.commit("setLiveAnimation", { side: this.side, uuid: animation.uuid });
      this.$store.dispatch("applyLEDMaterial");
    },
    isActive: function(animation) {
      return (
        this.$store.state[this.side + "Animation"] &&
        this.$store.state[this.side + "Animation"] == animation.uuid
      );
    }
  },
  mounted: function() {
    if (!this.$store.state[this.side + "Animation"]) {
      if (this.$store.state.animations.animations.length) {
        this.setAnimation(this.$store.state.animations.animations[0]);
      }
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
  cursor: pointer;
  margin: 2px 0;
}

.active {
  color: #00ffff;
}
</style>
