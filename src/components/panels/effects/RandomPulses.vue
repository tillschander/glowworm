<template>
  <div>
    <div class="form-element">
      <label>Speed:</label>
      <input
        type="range"
        v-bind:value="speed"
        v-on:input="apply('speed', $event.target.value)"
        min="0"
        max="3"
        step="0.01"
      >
    </div>
  </div>
</template>

<script>
import Default from "./Default.vue";

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
