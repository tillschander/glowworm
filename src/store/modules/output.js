export default {
  state: {
    ports: [],
    activePort: null,
    errorMessage: "",
  },
  mutations: {
    setActivePort(state, comName) {
      this.commit("setOutputToBlack");

      if (comName) {
        state.activePort = new SerialPort(comName, {
          baudRate: 1000000,
          lock: false
        });
      } else {
        if (state.activePort && state.activePort.isOpen) state.activePort.close();
        state.activePort = null;
      }
    },
    setPorts: function (state, options = {autoSetActivePort: false}) {
      SerialPort.list((err, ports) => {
        if (err) {
          state.errorMessage = err.message;
          return;
        }

        state.errorMessage = "";
        state.ports = ports;
        if (options.autoSetActivePort) this.commit("autoSetActivePort");
      });
    },
    autoSetActivePort: function (state) {
      state.ports.forEach(port => {
        if (port.manufacturer) this.commit("setActivePort", port.comName);
      });
    },
    setOutputToBlack: function(state) {
      if (state.activePort) state.activePort.write(new Array(1024).fill(0));
    }
  }
}
