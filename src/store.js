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
    camera: new THREE.PerspectiveCamera(50, 1, 1, 99999),
    activeObject: null,
    ports: [],
    activePort: null,
    activeTool: 'select',
    line: null,
    lineGeometry: new THREE.BufferGeometry(),
    lineConnections: [],
    maxConnections: 512,
    mode: 'design',
    objects: [],
    animations: [],
    snapToGrid: false,
    showHelpers: true,
    activeLEDMaterial: null
  },
  mutations: {
    addLED: function (state, options = { position: [0, 0, 0] }) {
      let geometry = new THREE.OctahedronBufferGeometry(5, 0);
      let material = state.activeLEDMaterial;
      let mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(options.position[0], options.position[1], options.position[2]);
      mesh.userData.type = 'LED';
      state.scene.add(mesh);
      Vue.set(state.LEDs, mesh.uuid, {
        position: options.position
      });
      // TODO cleanup
      let index = state.lineConnections.length;
      state.lineConnections.push(mesh.uuid);
      state.line.geometry.attributes.position.array[index * 3] = options.position[0];
      state.line.geometry.attributes.position.array[index * 3 + 1] = options.position[1];
      state.line.geometry.attributes.position.array[index * 3 + 2] = options.position[2];
      state.line.geometry.setDrawRange(0, state.lineConnections.length);
      this.commit('setActiveObject', mesh);

      if (state.activePort) {
        let n = Object.keys(state.LEDs).length;
        state.activePort.write(
          Buffer.from('count,' + n + '\n', 'utf8')
        );
      }
    },
    addObject: function (state, options = { mesh: null, position: [0, 0, 0] }) {
      let object = {
        uuid: options.mesh.uuid,
        position: options.position
      };

      if (options.name) object.name = options.name;
      options.mesh.position.set(options.position[0], options.position[1], options.position[2]);
      options.mesh.userData.type = 'Object';
      state.scene.add(options.mesh);
      state.objects.push(object);
      this.commit('setActiveObject', options.mesh);
    },
    addAnimation: function (state) {
      let animation = new THREE.Object3D();

      animation.userData.type = 'Animation';
      animation.visble = false;
      state.scene.add(animation);
      state.animations.push({
        uuid: animation.uuid,
        effects: []
      });
      this.commit('setActiveObject', animation);
    },
    addBox: function (state, options = { size: [10, 10, 10], position: [0, 0, 0] }) {
      let geometry = new THREE.BoxBufferGeometry(options.size[0], options.size[1], options.size[2]);
      let material = new THREE.MeshPhongMaterial({ color: 0xDDDDDD });
      let mesh = new THREE.Mesh(geometry, material);

      this.commit('addObject', { mesh, position: options.position });
    },
    addPort: function (state, port) {
      state.ports.push(port);
    },
    updateObject: function (state, updates) {
      let threeObject = state.scene.getObjectByProperty('uuid', updates.uuid);
      let type = threeObject.userData.type;

      if (updates.name !== undefined) {
        threeObject.userData.name = updates.name;

        if (type == 'LED') {
          let index = updates.uuid;
          let newAttributes = Object.assign({}, state.LEDs[index]);

          newAttributes.name = updates.name;
          Vue.set(state.LEDs, index, newAttributes);
        } else if (type == 'Animation') {
          let index = state.animations.findIndex((elem) => elem.uuid == updates.uuid);
          let newAttributes = Object.assign({}, state.animations[index]);

          newAttributes.name = updates.name;
          Vue.set(state.animations, index, newAttributes);
        } else {
          let index = state.objects.findIndex((elem) => elem.uuid == updates.uuid);
          let newAttributes = Object.assign({}, state.objects[index]);

          newAttributes.name = updates.name;
          Vue.set(state.objects, index, newAttributes);
        }
      }

      if (updates.color !== undefined) {
        threeObject.material.color.r = updates.color[0];
        threeObject.material.color.g = updates.color[1];
        threeObject.material.color.b = updates.color[2];

        if (type == 'LED') {
          state.LEDs[updates.uuid].color = updates.color;
        }
      }

      if (updates.position !== undefined) {
        threeObject.position.x = updates.position[0];
        threeObject.position.y = updates.position[1];
        threeObject.position.z = updates.position[2];

        if (type == 'LED') {
          let index = state.lineConnections.indexOf(updates.uuid);

          state.LEDs[updates.uuid].position = updates.position;
          state.line.geometry.attributes.position.array[index * 3] = updates.position[0];
          state.line.geometry.attributes.position.array[index * 3 + 1] = updates.position[1];
          state.line.geometry.attributes.position.array[index * 3 + 2] = updates.position[2];
          state.line.geometry.setDrawRange(0, state.lineConnections.length);
          state.line.geometry.attributes.position.needsUpdate = true;
        } else {
          let index = state.objects.findIndex((elem) => elem.uuid == updates.uuid);

          state.objects[index].position = updates.position;
        }
      }

      if (updates.scale !== undefined) {
        let index = state.objects.findIndex((elem) => elem.uuid == updates.uuid);

        threeObject.scale.x = updates.scale[0];
        threeObject.scale.y = updates.scale[1];
        threeObject.scale.z = updates.scale[2];

        state.objects[index].scale = updates.scale;
      }

      if (updates.rotation !== undefined) {
        let index = state.objects.findIndex((elem) => elem.uuid == updates.uuid);

        threeObject.rotation.x = updates.rotation[0];
        threeObject.rotation.y = updates.rotation[1];
        threeObject.rotation.z = updates.rotation[2];

        state.objects[index].rotation = updates.rotation;
      }
    },
    deleteObject(state, object) {
      if (object.userData.type == 'LED') {
        delete state.LEDs[object.uuid];
      } else {
        let index = state.objects.findIndex((elem) => elem.uuid == object.uuid);

        state.objects.splice(index, 1);
      }

      this.commit('setActiveObject', null);
      state.scene.remove(object);
    },
    setActivePort(state, port) {
      state.activePort = port;
    },
    setActiveTool: function (state, tool) {
      state.activeTool = tool;
    },
    setActiveObject(state, object) {
      state.activeObject = object;
    },
    setFps: function (state, fps) {
      state.fps = fps;
    },
    setMaxFps: function (state, maxFps) {
      state.maxFps = maxFps;
    },
    setMode: function (state, mode) {
      state.mode = mode;
    },
    toggleSnapToGrid: function (state) {
      state.snapToGrid = !state.snapToGrid;
    },
    toggleShowHelpers: function (state) {
      state.showHelpers = !state.showHelpers;
    },
    applyLEDMaterial: function (state) {
      let uniforms = { time: new THREE.Uniform(0.0) };
      let shaderParameters = "";
      let shader = "";
      let activeAnimation = null;

      if (state.activeObject) {
        activeAnimation = state.animations.find(
          animation => animation.uuid == state.activeObject.uuid
        );
      }

      if (activeAnimation) {
        activeAnimation.effects.forEach(effect => {
          uniforms = THREE.UniformsUtils.merge([uniforms, effect.properties]);//Object.assign(uniforms, effect.properties);
          shaderParameters += "\n" + effect.shaderParameters;
          shader += "\n" + effect.shader;
        });
      }

      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: [
          "uniform float time;",
          "varying lowp vec4 vColor;",
          shaderParameters,
          "void main() {",
          "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
          "vColor = vec4(0.0);",
          shader,
          "}"
        ].join("\n"),
        fragmentShader: [
          "varying lowp vec4 vColor;",
          "void main() {",
          "gl_FragColor = vColor;",
          "}"
        ].join("\n")
      });

      for (let LED in state.LEDs) {
        let object = state.scene.getObjectByProperty("uuid", LED);

        object.material = material;
        object.needsUpdate = true;
      }

      state.activeLEDMaterial = material;
    }
  },
  actions: {

  }
})
