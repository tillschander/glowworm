<template>
  <div>
    Frequency:
    <br>
    <input
      type="range"
      v-bind:value="frequency"
      v-on:input="apply('frequency', $event.target.value)"
      min="50"
      max="1000"
      step="50"
    >
  </div>
</template>

<script>
import { default as Default } from "./Default";
const THREE = require("three");

export default {
  name: "Pulse",
  mixins: [Default],
  data() {
    return {
      frequency: this.properties["frequency" + this.uuid].value
    };
  },
  methods: {}
};
</script>
