<template>
  <div>
    <h2>Select Port</h2>
    <br>
    <div v-if="$store.state.output.errorMessage">{{ $store.state.output.errorMessage }}</div>

    <label>
      Port:
      <select v-model="selectedPort">
        <option value="">Select a port...</option>
        <option v-for="port in $store.state.output.ports" v-bind:value="port.comName" v-bind:key="port.comName">
          <span>{{ port.comName }}</span>
          <span v-if="port.manufacturer">&nbsp;&nbsp;{{ port.manufacturer }}</span>
        </option>
      </select>
    </label>
    <br>
    <br>
    <br>
    <br>
    <h2>Copy/Paste Arduino Code</h2>
    <br>
    <textarea rows="15" cols="70" v-model="arduinoCode"></textarea>
    <br>
    <br>
    <div class="buttons">
      <span></span>
      <button v-on:click="$parent.close()">Close</button>
    </div>
  </div>
</template>

<script>
const fs = require("fs");

export default {
  name: "LedRingDialog",
  props: ["$store"],
  data() {
    return {
      arduinoCode: ""
    };
  },
  computed: {
    selectedPort: {
      get() {
        if (this.$store.state.output.activePort) {
          return this.$store.state.output.activePort.path;
        }
        return "";
      },
      set(value) {
        this.$store.commit("setActivePort", value);
      }
    }
  },
  mounted() {
    this.$store.commit("setPorts");
    this.arduinoCode = fs.readFileSync("FastLED.ino", "utf8").toString();
  }
};
</script>

<style lang="scss">
.buttons {
  display: flex;
  justify-content: space-between;
}

textarea {
  width: 100%;
}
</style>