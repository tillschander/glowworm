<template>
  <div>
    <div class="form-element">
      <label>Frequency:</label>
      <input
        type="range"
        v-bind:value="frequency"
        v-on:input="apply('frequency', $event.target.value)"
        min="50"
        max="1000"
        step="50"
      >
    </div>
  </div>
</template>

<script>
import { default as Default } from "./Default";

export default {
  name: "Pulse",
  mixins: [Default],
  data() {
    return {
      frequency: this.properties["frequency"].value
    };
  }
};
</script>
