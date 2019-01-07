import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    maxFps: 60,
    fps: 0,
    LEDs: []//[[0, 10, 0], [0, 10, 0], [0, 10, 0]],
  },
  mutations: {
    addLED: function (state, color = [10, 0, 0], position = [0, 0, 0], threejsUuid = undefined) {
      state.LEDs.push({
        color,
        position,
        threejsUuid
      });
      console.log(state);
      //state.LEDs.push(uuid);
    },
    /*
    pushLED: function(state) {
      state.LEDs.push([0,0,0]);
    },
    */
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
