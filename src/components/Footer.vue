<template>
  <div>
    <div v-if="errorMessage">{{ errorMessage }}</div>

    <label>
      Port:
      <select>
        <option
          v-for="port in this.$store.state.ports"
          v-bind:value="port.manufacturer"
          v-bind:key="port.comName"
          v-on:change="setPort(port)"
        >{{ port.manufacturer }}</option>
      </select>
    </label>
    {{ this.$store.state.fps.toFixed(2) }} FPS
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      errorMessage: ""
    };
  },
  methods: {
    /*
    sendSerial: function() {
      let output = [1].concat(
        this.LEDs.reduce((acc, val) => acc.concat(val), [])
      ); // Flat arr with 1 at the beginning
    }
    */
    setPort: function(port) {
      const activePort = new SerialPort(port.comName, {
        baudRate: 1000000,
        lock: false
      });
      this.$store.commit("setActivePort", activePort);
      //const parser = new Readline();
      //activePort.pipe(parser);
      //parser.on("data", line => console.log(`> ${line}`));
    }
  },
  mounted() {
    SerialPort.list((err, ports) => {
      if (err) {
        this.errorMessage = err.message;
        return;
      }

      ports.forEach(p => {
        if (p.manufacturer) {
          this.$store.commit("addPort", p);
        }
      });

      this.setPort(ports[0]);
    });
  }
};
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #333333;
  padding: 0 6px;
}
</style>
