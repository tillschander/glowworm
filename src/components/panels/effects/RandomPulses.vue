<template>
  <div>
    Speed:
    <br>
    <input
      type="range"
      v-bind:value="speed"
      v-on:input="apply('speed', $event.target.value)"
      min="0"
      max="3"
      step="0.01"
    >
  </div>
</template>

<script>
import { default as Default } from "./Default";

export default {
  name: "RandomPulses",
  mixins: [Default],
  data() {
    return {
      speed: this.properties["speed"].value
    };
  }
};
</script>
