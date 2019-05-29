<template>
  <div class="effect">
    <div class="title">
      <span>{{name}}</span>
      <span v-on:click="deleteEffect" class="delete">❌</span>
    </div>
    <div class="form-element">
      <label>Blend mode:</label>
      <select v-on:change="$refs.component.apply('blendMode', $event.target.value)">
        <option
          v-for="blendMode in blendModes"
          :key="blendMode.value"
          :value="blendMode.value"
        >{{blendMode.text}}</option>
      </select>
    </div>
    <div class="form-element">
      <label>Opacity:</label>
      <input
        type="range"
        v-on:input="$refs.component.apply('opacity', $event.target.value)"
        min="0"
        max="1"
        step="0.01"
      >
    </div>
    <component
      class="properties"
      v-bind:is="component"
      v-bind:properties="properties"
      v-bind:uuid="uuid"
      ref="component"
    />
  </div>
</template>

<script>
const THREE = require("three");

export default {
  name: "Effect",
  props: ["type", "name", "properties", "uuid"],
  data() {
    return {
      component: () => import(`./effects/${this.type}.vue`),
      blendModes: [
        { text: "Normal", value: 0 },
        { text: "Darken", value: 1 },
        { text: "Multiply", value: 2 },
        { text: "Lighten", value: 3 },
        { text: "Screen", value: 4 }
      ]
    };
  },
  methods: {
    deleteEffect: function() {
      let index = this.$parent.animation.effects.findIndex(
        effect => effect.uuid == this.uuid
      );

      this.$parent.animation.effects.splice(index, 1);
      this.$store.commit("applyLEDMaterial");
    }
  }
};
</script>

<style lang="scss">
.effect {
  margin-bottom: 1em;
  background: #333333;
  padding: 0 10px 0.5em 10px;
  left: -10px;
  position: relative;
  width: calc(100% + 20px);

  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 7px 10px;
    left: -10px;
    position: relative;
    width: calc(100% + 20px);
    background: rgba(0, 0, 0, 0.5);
    line-height: 1em;
  }

  .delete {
    cursor: pointer;
  }
}
</style>
