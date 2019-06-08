<template>
  <div>
    <h2>Select Port</h2>
    <br>
    <div v-if="errorMessage">{{ errorMessage }}</div>

    <label>
      Port:
      <select v-model="selectedPort">
        <option value>Select a port...</option>
        <option
          v-for="port in this.ports"
          v-bind:value="port.comName"
          v-bind:key="port.comName"
        >{{ port.comName }}</option>
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
      <button v-on:click="close()">Close</button>
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
      errorMessage: "",
      arduinoCode: "",
      ports: [],
      selectedPort: ""
    };
  },
  methods: {
    // sendSerial: function() {
    //   let output = [1].concat(
    //     this.LEDs.reduce((acc, val) => acc.concat(val), [])
    //   ); // Flat arr with 1 at the beginning
    // },
    setActivePort: function(comName) {
      let activePort = undefined;

      if (comName) {
        activePort = new SerialPort(comName, {
          baudRate: 1000000,
          lock: false
        });
      }
      this.$store.commit("setActivePort", activePort);
      // const parser = new Readline();
      // activePort.pipe(parser);
      // parser.on("data", line => console.log(`> ${line}`));
    },
    close() {
      this.$parent.close();
    }
  },
  watch: {
    selectedPort: function(newComName, oldComName) {
      if (newComName !== oldComName) this.setActivePort(newComName);
    }
  },
  mounted() {
    SerialPort.list((err, ports) => {
      if (err) {
        this.errorMessage = err.message;
        return;
      }

      ports.forEach(port => {
        if (port.manufacturer) this.setActivePort(comName);
      });

      this.ports = ports;
      //this.ports = ports.filter(port => port.manufacturer !== undefined);
      this.arduinoCode = fs.readFileSync("FastLED.ino", "utf8").toString();
    });
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