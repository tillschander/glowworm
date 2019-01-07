<template>
  <div class="header">
    <div v-if="errorMessage">{{ errorMessage }}</div>

    <label for="ports">Port:</label>
    <select>
      <option
        v-for="port in ports"
        v-bind:value="port.manufacturer"
        v-bind:key="port.comName"
      >{{ port.manufacturer }}</option>
    </select>
    
    <button @click="sendSerial">Send Serial</button>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      ports: [],
      serialport: null,
      errorMessage: "",
      port: null,
      LEDs: [[0, 10, 0], [0, 10, 0], [0, 10, 0]]
    };
  },
  methods: {
    sendSerial: function() {
      // TODO use store
      this.LEDs = this.LEDs.map(led => [0, 0, 100]);
      let output = [1].concat(
        this.LEDs.reduce((acc, val) => acc.concat(val), [])
      ); // Flat arr with 1 at the beginning
      if (this.port != undefined) {
        this.port.write(Buffer.from(output));
      }
      console.log(this.port, output);
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
          // TODO better logic
          this.ports.push(p);
          this.port = new SerialPort(p.comName, {
            baudRate: 1000000
          });

          // TODO move inside mainloop
          var pp = this.port;
          function foo() {
            pp.write(Buffer.from([1, 0, 0, 20, 0, 0, 20, 0, 0, 20]));
            window.requestAnimationFrame(foo);
          }
          foo();
        }
      });
    });
  }
};
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 60px;
}
</style>
