<template>
  <div class="animations-sidebar">
    <b>Animations</b>
    <br>
    <div
      v-bind:key="uuid"
      v-bind:class="{ active: isActive(uuid), animation: true }"
      v-for="uuid in animations"
      v-on:click="setAnimation(uuid)"
    >{{ getName(uuid) }}</div>
  </div>
</template>

<script>
export default {
  name: "AnimationsSidebar",
  props: ["side"],
  data() {
    return {
      animations: []
    };
  },
  methods: {
    getName: function(uuid) {
      let animation = this.$store.state.scene.getObjectByProperty("uuid", uuid);
      return animation.name ? animation.name : animation.userData.type;
    },
    setAnimation: function(uuid) {
      this.$store.commit("setLiveAnimation", { side: this.side, uuid });
      this.$store.dispatch("applyLEDMaterial");
    },
    isActive: function(uuid) {
      return (
        this.$store.state[this.side + "Animation"] &&
        this.$store.state[this.side + "Animation"] == uuid
      );
    }
  },
  mounted: function() {
    this.$store.state.animations.animations.forEach(animation => {
      this.animations.push(animation.uuid);
    });
    
    if (!this.$store.state[this.side + "Animation"] && this.animations.length) {
      this.setAnimation(this.animations[0]);
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
