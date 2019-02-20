<template>
  <div>
    Color:
    <br>
    <input
      type="color"
      v-bind:value="color"
      v-on:input="apply('color', $event.target.value, hexToThreeColor)"
    >
    Opacity:
    <br>
    <input
      type="range"
      v-bind:value="opacity"
      v-on:input="apply('opacity', $event.target.value)"
      min="0"
      max="1"
      step="0.01"
    >
  </div>
</template>

<script>
import { default as Default } from "./Default";
const THREE = require("three");

export default {
  name: "SimpleColor",
  mixins: [Default],
  data() {
    return {
      color: "#" + this.properties["color" + this.uuid].value.getHexString(),
      opacity: this.properties["opacity" + this.uuid].value
    };
  },
  methods: {
    hexToThreeColor: function(color) {
      return new THREE.Color(parseInt("0x" + color.slice(1)));
    }
  }
};
</script>
