<template>
  <div>
    <Effect
      v-for="effect in animation.effects"
      v-bind:properties="effect.properties"
      v-bind:type="effect.type"
      v-bind:name="effect.name"
      v-bind:uuid="effect.uuid"
      v-bind:key="effect.uuid"
    />
    <button v-on:click="addEffect">Add Effect</button>
  </div>
</template>

<script>
const THREE = require("three");
import Effect from "./Effect";

export default {
  name: "AnimationPanel",
  components: {
    Effect
  },
  computed: {
    uuid: function() {
      return Object.keys(this.$store.state.activeObjects)[0];
    },
    animation: function() {
      return this.$store.state.animations.find(
        animation => animation.uuid == this.uuid
      );
    }
  },
  methods: {
    addEffect: function() {
      let self = this;

      this.$dialog({
        type: "effects",
        callback: function(options) {
          self.animation.effects.push(options.effect);
          self.$store.commit("applyLEDMaterial");
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
button {
  width: 100%;
}
</style>
