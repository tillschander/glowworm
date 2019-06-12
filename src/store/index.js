import Vue from 'vue';
import Vuex from 'vuex';
import MainLoop from "mainloop.js";
import persistence from './modules/persistence.js';
import connections from './modules/connections.js';
import masks from './modules/masks.js';
import selection from './modules/selection.js';
import objects from './modules/objects.js';
import leds from './modules/leds.js';
import animations from './modules/animations.js';
import output from './modules/output.js';
import buffer from './modules/buffer.js';
import elements from './modules/elements.js';
import transformUtil from "../utils/transform.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    maxFps: 61,
    fps: 0,
    renderer: new THREE.WebGLRenderer(),
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(50, 1, 1, 99999),
    orbitControl: null,
    transformControl: null,
    transformDummy: new THREE.Object3D(),
    activeTool: 'move',
    mode: 'design',
    snapToGrid: false,
    ctrlPressed: false,
    leftAnimation: null,
    rightAnimation: null,
    mixValue: 0.5,
    globalOpacity: 1.0,
  },
  modules: {
    persistence,
    connections,
    masks,
    selection,
    objects,
    animations,
    leds,
    output,
    buffer,
    elements
  },
  getters: {
    activeObject: state => {
      if (state.selection.selectionGroup.length > 1) {
        return state.transformDummy;
      }
      return state.selection.selectionGroup[0];
    },
    canMove: state => {
      return transformUtil.canActiveObjectTraslate(state, 'move');
    },
    canRotate: state => {
      return transformUtil.canActiveObjectTraslate(state, 'rotate');
    },
    canScale: state => {
      return transformUtil.canActiveObjectTraslate(state, 'scale');
    },
  },
  mutations: {
    setActiveTool: function (state, tool) {
      if (state.selection.selectionGroup.length > 1) {
        if (tool == 'rotate' || tool == 'scale') {
          return state.activeTool = 'select';
        }
      }
      return state.activeTool = tool;
    },
    setFps: function (state, fps) {
      state.fps = fps;
    },
    setMaxFps: function (state, maxFps) {
      state.maxFps = maxFps;
      MainLoop.setMaxAllowedFPS(maxFps);
    },
    setMode: function (state, mode) {
      state.mode = mode;
    },
    setCtrlPressed: function (state, bool) {
      state.ctrlPressed = bool;
    },
    setSnapToGrid: function (state, bool) {
      state.snapToGrid = bool;

      if (bool) {
        state.transformControl.setTranslationSnap(5);
        state.transformControl.setRotationSnap(THREE.Math.degToRad(15));
      } else {
        state.transformControl.setTranslationSnap(null);
        state.transformControl.setRotationSnap(null);
      }
    },
    setLiveAnimation: function (state, options) {
      state[options.side + 'Animation'] = options.uuid;
    },
    setMixValue: function (state, value) {
      state.mixValue = value;
    },
    setGlobalOpacity: function (state, value) {
      state.globalOpacity = value;
    },
    initCamera: function (state) {
      state.camera.position.set(100, 100, 100);
      state.camera.lookAt(0, 200, 0);
      state.camera.userData.type = "Camera";
      state.scene.add(state.camera);
    },
    initLights: function (state) {
      let light1 = new THREE.DirectionalLight(0xffffff, 0.7);
      let light2 = new THREE.DirectionalLight(0xffffff, 0.3);

      light1.position.set(1.2, 1.5, 1.0);
      light2.position.set(-1.1, -0.4, -0.9);
      state.scene.add(light1);
      state.scene.add(light2);
    },
    initControls: function(state) {
      state.orbitControl = new THREE.OrbitControls(state.camera, state.renderer.domElement);
      state.orbitControl.update();

      state.transformControl = new THREE.TransformControls(state.camera, state.renderer.domElement);
      state.scene.add(state.transformControl);
      state.scene.add(state.transformDummy);
      state.transformControl.attach(state.transformDummy);
    }
  },
  actions: {
    updateTransformControlVisibility: function({state, rootGetters}, activeElementsUuids) {
      if (rootGetters.activeElementsUuids.length) {
        if (["move", "scale", "rotate"].indexOf(state.activeTool) > -1) {
          state.scene.add(state.transformControl);
        } else {
          state.scene.remove(state.transformControl);
        }
      } else {
        state.scene.remove(state.transformControl);
      }
    }
  }
})
