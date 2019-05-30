import Vue from 'vue';
import Vuex from 'vuex';
import persistence from './modules/persistence.js';
import connections from './modules/connections.js';
import masks from './modules/masks.js';

const THREE = require("three");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    maxFps: 61,
    fps: 0,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(50, 1, 1, 99999),
    orbit: null,
    activeObjects: {},
    activePort: null,
    activeTool: 'select',
    maxConnections: 256,
    mode: 'design',
    animations: [],
    snapToGrid: false,
    activeLEDMaterial: null,
    bufferRenderer: new THREE.WebGLRenderer(),
    bufferCamera: null,
    bufferScene: new THREE.Scene(),
    bufferTexture: null,
    bufferWidth: 16,
    bufferHeight: 16,
    bufferMaterial: null,
    bufferGeometry: null,
    bufferObject: null,
    buffer: null,
    shiftPressed: false,
    selectionGroup: new THREE.Group(),
    leftAnimation: null,
    rightAnimation: null,
    mixValue: 0.5,
    globalOpacity: 1.0
  },
  modules: {
    persistence,
    connections,
    masks
  },
  getters: {
    LEDs: state => {
      let LEDs = [];
      state.scene.traverse(function (child) {
        if (child.userData.type === "LED") {
          LEDs.push(child);
        }
      });
      return LEDs.sort((a, b) => a.id - b.id);
    },
    objects: state => {
      let objects = [];
      state.scene.traverse(function (child) {
        if (child.userData.type === "Object") {
          objects.push(child);
        }
      });
      return objects.sort((a, b) => a.id - b.id);
    }
  },
  mutations: {
    addLED: function (state, options = { position: [0, 0, 0] }) {
      let geometry = new THREE.PlaneBufferGeometry(10, 10);
      let material = state.activeLEDMaterial;
      let mesh = new THREE.Mesh(geometry, material);

      if (options.name) mesh.name = options.name;
      if (options.uuid) mesh.uuid = options.uuid;
      mesh.position.set(options.position[0], options.position[1], options.position[2]);
      mesh.userData.type = 'LED';

      // Set unique uniforms for each LED
      mesh.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
        var updateList = [];
        material.userData.activeAnimations.forEach(animation => {
          let side = '';
          if (state.mode == 'live' && animation.uuid == state.leftAnimation) side = 'left';
          if (state.mode == 'live' && animation.uuid == state.rightAnimation) side = 'right';
          animation.effects.forEach(effect => {
            let mask = state.scene.getObjectByProperty('uuid', effect.mask);
            if (mask && mask.userData.LEDs.includes(this.uuid)) {
              state.activeLEDMaterial.uniforms['masked' + side + effect.uuid].value = true;
            } else {
              state.activeLEDMaterial.uniforms['masked' + side + effect.uuid].value = false;
            }
            updateList.push('masked' + side + effect.uuid);
          });
        });

        if (updateList.length) {
          var materialProperties = renderer.properties.get(material);
          if (materialProperties.program) {
            var gl = renderer.getContext();
            var uniforms = materialProperties.program.getUniforms();
            gl.useProgram(materialProperties.program.program);
            updateList.forEach(function (name) {
              uniforms.setValue(gl, name, state.activeLEDMaterial.uniforms[name].value);
            });
          }
        }
      }

      state.scene.add(mesh);

      this.dispatch("connectMaybe", mesh);
      this.commit("clearActiveObjects");
      this.commit("addActiveObject", mesh.uuid);
    },
    addObject: function (state, options = { mesh: null, position: [0, 0, 0], type: 'box' }) {
      options.mesh.position.set(options.position[0], options.position[1], options.position[2]);
      if (options.name) options.mesh.name = options.name;
      //if (options.uuid) options.mesh.uuid = options.uuid;
      if (options.rotation) {
        options.mesh.rotateX(options.rotation[0]);
        options.mesh.rotateY(options.rotation[1]);
        options.mesh.rotateZ(options.rotation[2]);
      }
      if (options.scale) options.mesh.scale.set(options.scale[0], options.scale[1], options.scale[2]);
      options.mesh.userData.type = 'Object';
      options.mesh.userData.objectType = options.type;
      state.scene.add(options.mesh);
      this.commit("clearActiveObjects");
      this.commit("addActiveObject", options.mesh.uuid);
    },
    addAnimation: function (state, options = {}) {
      let animation = new THREE.Object3D();

      if (options.name) animation.name = options.name;
      if (options.uuid) animation.uuid = options.uuid;
      animation.userData.type = 'Animation';
      animation.visible = false;
      state.scene.add(animation);
      state.animations.push({
        uuid: animation.uuid,
        effects: options.effects || []
      });
      this.commit("clearActiveObjects");
      this.commit("addActiveObject", animation.uuid);
    },
    addBox: function (state, options = { position: [0, 0, 0], scale: [10, 10, 10] }) {
      let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
      let material = new THREE.MeshPhongMaterial({ color: 0xDDDDDD });
      let mesh = new THREE.Mesh(geometry, material);
      let object = {
        mesh,
        name: 'Box',
        position: options.position,
        scale: options.scale,
        type: 'box'
      }

      if (options.rotation) object.rotation = options.rotation;
      if (options.name) object.name = options.name;
      if (options.uuid) mesh.uuid = options.uuid;
      this.commit('addObject', object);
    },
    addPlane: function (state, options = { size: [30, 30], position: [0, 0, 0] }) {
      let geometry = new THREE.PlaneBufferGeometry(options.size[0], options.size[1]);
      let material = new THREE.MeshPhongMaterial({ color: 0xDDDDDD, side: THREE.DoubleSide });
      let mesh = new THREE.Mesh(geometry, material);

      this.commit('addObject', { mesh, position: options.position, name: 'Plane', type: 'plane' });
    },
    addGroup: function (state, options) {
      let group = new THREE.Group();
      let i = options.children.length;

      while (i--) {
        let child = options.children[i];

        group.add(child);
      }

      if (options.position) group.position.copy(options.position);
      if (options.name) group.name = options.name;
      group.userData.type = 'Group';
      group.userData.groupType = options.groupType;
      state.scene.add(group);
      this.commit("clearActiveObjects");
      this.commit("addActiveObject", group.uuid);
    },
    updateObjectName: function (state, updates) {
      let threeObject = state.scene.getObjectByProperty('uuid', updates.uuid);
      threeObject.name = updates.name;
    },
    deleteObject(state, object) {
      if (object.userData.type == 'LED' || (object.userData.type == "Group" && object.userData.groupType == 'LED')) {
        this.dispatch("disconnectBoth", object);
      } else if (object.userData.type == 'Animation') {
        let index = state.animations.findIndex((elem) => elem.uuid == object.uuid);
        state.animations.splice(index, 1);
      }
      object.parent.remove(object);
    },
    setActivePort(state, port) {
      state.activePort = port;
    },
    setActiveTool: function (state, tool) {
      state.activeTool = tool;
    },
    addActiveObject(state, uuid) {
      let newActiveObjects = Object.assign({}, state.activeObjects);
      newActiveObjects[uuid] = true;
      state.activeObjects = newActiveObjects;
    },
    clearActiveObjects(state) {
      state.activeObjects = {};
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
    setShiftPressed: function (state, bool) {
      state.shiftPressed = bool;
    },
    setSnapToGrid: function (state, bool) {
      state.snapToGrid = bool;
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
    emptySelectionGroup: function (state) {
      let group = state.selectionGroup.children;

      for (var i = group.length - 1; i >= 0; i--) {
        let child = group[i];

        child.applyMatrix(state.selectionGroup.matrixWorld);
        state.selectionGroup.remove(child);
        state.scene.add(child);
      }

      state.selectionGroup.position.set(0, 0, 0);
      state.selectionGroup.rotation.set(0, 0, 0);
      state.selectionGroup.scale.set(1, 1, 1);
      state.selectionGroup.updateMatrix();
    },
    deleteActiveObjects: function (state) {
      this.commit("emptySelectionGroup");
      for (const uuid in state.activeObjects) {
        this.commit("deleteObject", state.scene.getObjectByProperty("uuid", uuid));
      }
      this.commit("clearActiveObjects");
    },
    applyLEDMaterial: function (state) {
      let ledTexture = new THREE.TextureLoader().load(location.origin + '/led.png');
      let shineTexture = new THREE.TextureLoader().load(location.origin + '/shine.png');
      let shaderParameters = "";
      let shader = "";
      let activeAnimation = null;
      let activeAnimations = [];
      let uniforms = {
        time: new THREE.Uniform(0.0),
        ledTexture: new THREE.Uniform(ledTexture),
        shineTexture: new THREE.Uniform(shineTexture),
        mixValue: new THREE.Uniform(state.mixValue),
        globalOpacity: new THREE.Uniform(state.globalOpacity),
      };

      function makeEffectUnique(originalEffect, suffix, side) {
        let effect = JSON.parse(JSON.stringify(originalEffect));

        for (const key in effect.properties) {
          let uniqueKey = key + suffix;
          let regex = new RegExp(key, "g");

          effect.shaderParameters = effect.shaderParameters.replace(
            regex,
            uniqueKey
          );
          effect.shader = effect.shader.replace(regex, uniqueKey);
          effect.properties[uniqueKey] = effect.properties[key];
          delete effect.properties[key];
        }

        effect.variables.forEach(key => {
          let uniqueKey = key + suffix;
          let regex = new RegExp(key, "g");

          effect.shader = effect.shader.replace(regex, uniqueKey);
        });

        if (side) {
          effect.shader = effect.shader.replace(new RegExp("vColor", "g"), side + "VColor");
        }

        return effect;
      };

      if (state.mode == 'design') {
        if (Object.keys(state.activeObjects).length == 1) {
          let activeObjectUuid = Object.keys(state.activeObjects)[0];

          activeAnimation = state.animations.find(
            animation => animation.uuid == activeObjectUuid
          );
        }

        if (activeAnimation) {
          activeAnimation.effects.forEach(effect => {
            let uniqueEffect = makeEffectUnique(effect, effect.uuid);

            uniforms = Object.assign(uniforms, uniqueEffect.properties);
            shaderParameters += "\n" + uniqueEffect.shaderParameters;
            shader += "\n" + uniqueEffect.shader;
          });
          activeAnimations.push(activeAnimation);
        }
      } else if (state.mode == 'live') {
        if (state.leftAnimation) {
          activeAnimation = state.animations.find(
            animation => animation.uuid == state.leftAnimation
          );

          activeAnimation.effects.forEach(effect => {
            let uniqueEffect = makeEffectUnique(effect, 'left' + effect.uuid, 'left');

            uniforms = Object.assign(uniforms, uniqueEffect.properties);
            shaderParameters += "\n" + uniqueEffect.shaderParameters;
            shader += "\n" + uniqueEffect.shader;
          });
          activeAnimations.push(activeAnimation);
        }

        if (state.rightAnimation) {
          activeAnimation = state.animations.find(
            animation => animation.uuid == state.rightAnimation
          );

          activeAnimation.effects.forEach(effect => {
            let uniqueEffect = makeEffectUnique(effect, 'right' + effect.uuid, 'right');

            uniforms = Object.assign(uniforms, uniqueEffect.properties);
            shaderParameters += "\n" + uniqueEffect.shaderParameters;
            shader += "\n" + uniqueEffect.shader;
          });
          activeAnimations.push(activeAnimation);
        }

        shader = [
          "vec4 leftVColor = vec4(0.0, 0.0, 0.0, 1.0);",
          "vec4 rightVColor = vec4(0.0, 0.0, 0.0, 1.0);",
          shader,
          "vColor = mix(leftVColor, rightVColor, mixValue);",
          "vColor.rgb *= globalOpacity;"
        ].join("\n");
      }

      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        side: THREE.DoubleSide,
        transparent: true,
        //blending: THREE.AdditiveBlending,
        defines: {
          USE_MAP: true
        },
        userData: {
          activeAnimations
        },
        vertexShader: [
          "uniform float mixValue;",
          "uniform float globalOpacity;",
          "uniform float time;",
          "varying lowp vec4 vColor;",
          "attribute vec3 LEDPosition;",
          "attribute float LEDIndex;",
          "varying vec2 vUv;",

          // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
          "float random(float n){ return fract(sin(n) * 43758.5453123); }",
          "float random2(vec2 st){ return fract(sin(dot(st.xy ,vec2(12.9898, 78.233))) * 43758.5453); }",

          // https://github.com/jamieowen/glsl-blend
          "vec3 blendByMode(int mode, float opacity, vec3 base, vec3 blend) {",
          "  if (mode == 0) {", // normal
          "    return mix(base, blend, opacity);",
          "  } else if(mode == 1) {", // darken
          "    return mix(base, min(blend, base), opacity);",
          "  } else if(mode == 2) {", // multiply
          "    return mix(base, base * blend, opacity);",
          "  } else if(mode == 3) {", // lighten
          "    return mix(base, max(blend, base), opacity);",
          "  } else if(mode == 4) {", // screen
          "    return mix(base, 1.0 - ((1.0 - base) * (1.0 - blend)), opacity);",
          "  }",
          "}",

          shaderParameters,
          "void main() {",
          "  vUv = uv;",
          "  vColor = vec4(0.0, 0.0, 0.0, 1.0);",
          "  gl_Position = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);",
          "  gl_Position.xy += position.xy;",
          "  gl_Position = projectionMatrix * gl_Position;",
          shader,
          "}",
        ].join("\n"),
        fragmentShader: [
          "varying lowp vec4 vColor;",
          "uniform sampler2D ledTexture;",
          "uniform sampler2D shineTexture;",
          "varying vec2 vUv;",
          "void main() {",
          "  float brightness = max(max(vColor.r, vColor.g), vColor.b);",
          "  vec4 led = texture2D(ledTexture, vUv);",
          "  vec4 shine = texture2D(shineTexture, vUv);",
          "  gl_FragColor = led * vColor;",
          "  gl_FragColor.rgb += brightness * shine.a;",
          "}"
        ].join("\n")
      });

      state.bufferMaterial = new THREE.ShaderMaterial({
        uniforms: Object.assign(uniforms, {
          width: { value: state.bufferWidth },
          height: { value: state.bufferHeight }
        }),
        vertexShader: [
          "uniform float mixValue;",
          "uniform float globalOpacity;",
          "attribute vec3 LEDPosition;",
          "attribute float LEDIndex;",
          "uniform float time;",
          "uniform float width;",
          "uniform float height;",
          "varying vec4 vColor;",

          // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
          "float random(float n){ return fract(sin(n) * 43758.5453123); }",
          "float random2(vec2 st){ return fract(sin(dot(st.xy ,vec2(12.9898, 78.233))) * 43758.5453); }",

          // https://github.com/jamieowen/glsl-blend
          "vec3 blendByMode(int mode, float opacity, vec3 base, vec3 blend) {",
          "  if (mode == 0) {", // normal
          "    return mix(base, blend, opacity);",
          "  } else if(mode == 1) {", // darken
          "    return mix(base, min(blend, base), opacity);",
          "  } else if(mode == 2) {", // multiply
          "    return mix(base, base * blend, opacity);",
          "  } else if(mode == 3) {", // lighten
          "    return mix(base, max(blend, base), opacity);",
          "  } else if(mode == 4) {", // screen
          "    return mix(base, 1.0 - ((1.0 - base) * (1.0 - blend)), opacity);",
          "  }",
          "}",

          shaderParameters,
          "void main() {",
          "  vColor = vec4(0.0, 0.0, 0.0, 1.0);",
          "  vec2 pos = vec2(mod(LEDIndex, width) / width, floor(LEDIndex / width) / height) * 2.0 - 1.0;",
          "  pos += 1.0 / width;",
          "  gl_PointSize = 1.0;",
          "  gl_Position = vec4(pos, 0.0, 1.0);",
          shader,
          "}",
        ].join("\n"),
        fragmentShader: [
          "varying vec4 vColor;",
          "void main() {",
          "  gl_FragColor = vColor;",
          "}",
        ].join("\n")
      });

      function applyAttributes(object, index) {
        let LEDPosition = Float32Array.from(object.geometry.attributes.position.array);
        let length = object.geometry.attributes.position.array.length / 3;
        let LEDIndex = Float32Array.from({ length: length }, () => index);

        for (var i = 0; i < LEDPosition.length; i += 3) {
          LEDPosition[i] = object.position.x;
          LEDPosition[i + 1] = object.position.y;
          LEDPosition[i + 2] = object.position.z;
        }
        object.geometry.addAttribute('LEDPosition', new THREE.BufferAttribute(LEDPosition, 3));
        object.geometry.addAttribute('LEDIndex', new THREE.BufferAttribute(LEDIndex, 1));
        state.bufferGeometry.attributes.LEDPosition.array[index * 3] = object.position.x;
        state.bufferGeometry.attributes.LEDPosition.array[index * 3 + 1] = object.position.y;
        state.bufferGeometry.attributes.LEDPosition.array[index * 3 + 2] = object.position.z;
      }

      for (let i = 0; i < this.getters.LEDs.length; i++) {
        applyAttributes(this.getters.LEDs[i], i);
        this.getters.LEDs[i].material = material;
        this.getters.LEDs[i].needsUpdate = true;
      }

      if (state.bufferObject) {
        state.bufferObject.material = state.bufferMaterial;
        state.bufferObject.needsUpdate = true;
        state.bufferGeometry.attributes.LEDPosition.needsUpdate = true;
      }

      state.activeLEDMaterial = material;
    }
  }
})
