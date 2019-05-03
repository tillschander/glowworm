<template>
  <div class="io">
    <h2>Select Port</h2>
    <br>
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
    <br>
    <br>
    <br>
    <br>
    <h2>Copy/Paste Arduino Code</h2>
    <br>
    <textarea rows="15" cols="70">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit error animi illo porro veniam accusantium necessitatibus cupiditate aliquam minus atque, hic recusandae eaque mollitia qui excepturi, accusamus quasi voluptate quas?</textarea>
  </div>
</template>

<script>
export default {
  name: "IO",
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

<style scoped>
.io {
  padding: 10px;
  background: #424242;
  width: 100%;
  height: 100%;
}
</style>
