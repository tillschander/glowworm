import Vue from 'vue';
import Vuex from 'vuex';

const THREE = require("three");

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    maxFps: 60,
    fps: 0,
    LEDs: {},
    scene: new THREE.Scene(),
    activeObject: null,
    ports: [],
    activePort: null,
    line: null,
    lineGeometry: new THREE.BufferGeometry(),
    lineConnections: [],
    maxConnections: 512
  },
  mutations: {
    addLED: function (state, color = [10, 0, 0], position = [0, 0, 0]) {
      let geometry = new THREE.OctahedronBufferGeometry(50, 0);
      let material = new THREE.MeshBasicMaterial({ color: color });
      let mesh = new THREE.Mesh(geometry, material);

      state.scene.add(mesh);
      Vue.set(state.LEDs, mesh.uuid, {
        color,
        position
      });
      // TODO cleanup
      let index = state.lineConnections.length;
      state.lineConnections.push(mesh.uuid);
      state.line.geometry.attributes.position.array[index*3] = position[0];
      state.line.geometry.attributes.position.array[index*3+1] = position[1];
      state.line.geometry.attributes.position.array[index*3+2] = position[2];
      state.line.geometry.setDrawRange(0, state.lineConnections.length);
      this.commit('setActiveObject', mesh);
    },
    updateLED: function (state, updates) {
      if (updates.color !== undefined)
        state.LEDs[updates.uuid].color = updates.color;
      if (updates.position !== undefined) {
        state.LEDs[updates.uuid].position = updates.position;

        // TODO cleanup
        let index = state.lineConnections.indexOf(updates.uuid);
        state.line.geometry.attributes.position.array[index*3] = updates.position[0];
        state.line.geometry.attributes.position.array[index*3+1] = updates.position[1];
        state.line.geometry.attributes.position.array[index*3+2] = updates.position[2];
        state.line.geometry.setDrawRange(0, state.lineConnections.length);
        state.line.geometry.attributes.position.needsUpdate = true;
      }
    },
    addPort: function (state, port) {
      state.ports.push(port);
    },
    setActivePort(state, port) {
      state.activePort = port;
    },
    setActiveObject(state, object) {
      state.activeObject = object;
    },
    setFps: function (state, fps) {
      state.fps = fps;
    },
    setMaxFps: function (state, maxFps) {
      state.maxFps = maxFps;
    }
  },
  actions: {

  }
})
