<template>
  <div>
    <section class="output-section">
      <h2>Select Port</h2>
      <small>Select the port through which the Arduino is connected to the computer.</small>
      <br>
      <br>
      <div>
        <label>
          Port:
          <br>
          <select v-model="selectedPort" v-bind:disabled="programming">
            <option value>Select a port...</option>
            <option
              v-for="port in $store.state.output.ports"
              v-bind:value="port.comName"
              v-bind:key="port.comName"
            >
              <span>{{ port.comName }}</span>
              <span v-if="port.manufacturer">&nbsp;&nbsp;{{ port.manufacturer }}</span>
            </option>
          </select>
        </label>
      </div>
      <small v-if="$store.state.output.errorMessage">
        <br>
        Error: {{ $store.state.output.errorMessage }}
      </small>
    </section>
    <section class="output-section">
      <h2>Program Arduino</h2>
      <small>Program your Arduino to accept data from this software and convert it to signals for the LEDs (the right port has to be selected before programming). You only need to do this once per Arduino and can then use the same Arduino for different LED animation projects.</small>
      <br>
      <br>
      <div>
        <label class="program-form">
          Board:
          <br>
          <select v-model="selectedBoard" v-bind:disabled="programming">
            <option value>Select a board...</option>
            <option
              v-for="board in boards"
              v-bind:value="board.key"
              v-bind:key="board.key"
            >{{ board.name }}</option>
          </select>
        </label>
        <button
          v-bind:disabled="(selectedPort === '' || selectedBoard === '') ? true : false"
          class="program-button"
          v-on:click="program()"
        >Program</button>
      </div>
      <small v-if="programMessage">
        <br>
        {{ this.programMessage }}
      </small>
    </section>
    <div class="buttons">
      <span></span>
      <button v-on:click="$parent.close()">Close</button>
    </div>
  </div>
</template>

<script>
const fs = require("fs");
let Avrgirl = require("electron").remote.require("avrgirl-arduino");

export default {
  name: "LedRingDialog",
  props: ["$store"],
  data() {
    return {
      programming: false,
      selectedBoard: "",
      programMessage: "",
      boards: [
        {
          key: "uno",
          name: "Arduino Uno"
        },
        {
          key: "mega",
          name: "Arduino Mega"
        },
        {
          key: "leonardo",
          name: "Arduino Leonardo"
        },
        {
          key: "micro",
          name: "Arduino Micro"
        },
        {
          key: "nano",
          name: "Arduino Nano"
        }
      ]
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
  methods: {
    program: function() {
      let port = this.$store.state.output.activePort.path;

      this.$store.commit("setActivePort", null);
      this.programMessage = "Programming...";
      this.programming = true;
      new Avrgirl({
        board: this.selectedBoard,
        port: port
      }).flash(`public/sketches/arduino_${this.selectedBoard}.hex`, error => {
        if (error) {
          this.programMessage = error.name + ": " + error.message;
        } else {
          this.programMessage = "Programmed successfully!";
        }
        this.$store.commit("setActivePort", port);
        this.programming = false;
      });
    }
  },
  mounted() {
    this.$store.commit("setPorts");
  }
};
</script>

<style lang="scss">
.buttons {
  display: flex;
  justify-content: space-between;
}

.output-section {
  margin-bottom: 3rem;
}

.program-form {
  display: inline-block;
}

.program-button {
  display: inline-block;
  position: relative;
  top: -5px;
  left: 10px;
}
</style>