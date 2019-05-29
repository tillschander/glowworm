<template>
  <div>
    <div class="form-element">
      <label>Color:</label>
      <input
        type="color"
        v-bind:value="color"
        v-on:input="apply('color', $event.target.value, hexToThreeColor)"
      >
    </div>
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
      color:
        "#" +
        new THREE.Color(
          this.properties["color"].value.x,
          this.properties["color"].value.y,
          this.properties["color"].value.z
        ).getHexString()
    };
  },
  methods: {
    hexToThreeColor: function(color) {
      let threeColor = new THREE.Color(color);
      return new THREE.Vector3(threeColor.r, threeColor.g, threeColor.b);
    }
  }
};
</script>
