import Vue from 'vue';
import Vuex from 'vuex';
import persistence from './modules/persistence.js';
import connections from './modules/connections.js';
import masks from './modules/masks.js';
import selection from './modules/selection.js';
import transformUtil from "../utils/transform.js";
import ledMaterialUtil from "../utils/ledMaterial.js";


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
    ctrlPressed: false,
    leftAnimation: null,
    rightAnimation: null,
    mixValue: 0.5,
    globalOpacity: 1.0,
    objectMaterial: new THREE.MeshPhongMaterial({ color: 0xDDDDDD }),
    planeMaterial: new THREE.MeshPhongMaterial({ color: 0xDDDDDD, side: THREE.DoubleSide })
  },
  modules: {
    persistence,
    connections,
    masks,
    selection
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
    },
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

        if (material.userData.activeAnimations) {
          material.userData.activeAnimations.forEach(animation => {
            animation.effects.forEach(effect => {
              let mask = state.scene.getObjectByProperty('uuid', effect.mask);
              let masked = mask && mask.userData.LEDs.includes(this.uuid);

              if (state.mode == 'live') {
                if (animation.uuid == state.leftAnimation) {
                  state.activeLEDMaterial.uniforms['maskedleft' + effect.uuid].value = masked;
                  updateList.push('maskedleft' + effect.uuid);
                }
                if (animation.uuid == state.rightAnimation) {
                  state.activeLEDMaterial.uniforms['maskedright' + effect.uuid].value = masked;
                  updateList.push('maskedright' + effect.uuid);
                }
              } else {
                state.activeLEDMaterial.uniforms['masked' + effect.uuid].value = masked;
                updateList.push('masked' + effect.uuid);
              }
            });
          });
        }

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
      let mesh = new THREE.Mesh(geometry, state.objectMaterial);
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
    addSphere: function (state, options = { size: 5, position: [0, 0, 0] }) {
      let geometry = new THREE.SphereBufferGeometry(options.size, 10, 8);
      let mesh = new THREE.Mesh(geometry, state.objectMaterial);

      this.commit('addObject', { mesh, position: options.position, name: 'Sphere', type: 'sphere' });
    },
    addPlane: function (state, options = { size: [10, 10], position: [0, 0, 0] }) {
      let geometry = new THREE.PlaneBufferGeometry(options.size[0], options.size[1]);
      let mesh = new THREE.Mesh(geometry, state.planeMaterial);

      this.commit('addObject', { mesh, position: options.position, name: 'Plane', type: 'plane' });
    },
    addCylinder: function (state, options = { size: [5, 10], position: [0, 0, 0] }) {
      let geometry = new THREE.CylinderBufferGeometry(options.size[0], options.size[0], options.size[1]);
      let mesh = new THREE.Mesh(geometry, state.objectMaterial);

      this.commit('addObject', { mesh, position: options.position, name: 'Cylinder', type: 'cylinder' });
    },
    addCone: function (state, options = { size: [5, 10], position: [0, 0, 0] }) {
      let geometry = new THREE.ConeBufferGeometry(options.size[0], options.size[1], 12);
      let mesh = new THREE.Mesh(geometry, state.objectMaterial);

      this.commit('addObject', { mesh, position: options.position, name: 'Cone', type: 'cone' });
    },
    addGroup: function (state, options) {
      let group = new THREE.Group();
      let i = options.children.length;
      let center = transformUtil.getCenter(options.children);

      group.position.copy(center);
      while (i--) {
        options.children[i].position.sub(center)
        group.add(options.children[i]);
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
      if (object.userData.type == 'LED') {
        this.dispatch("disconnectBoth", object);
      } else if (object.userData.groupType == 'LED') {
        object.children.forEach(child => {
          this.dispatch("disconnectBoth", child);
        });
      } else if (object.userData.type == 'Animation') {
        let index = state.animations.findIndex((elem) => elem.uuid == object.uuid);
        state.animations.splice(index, 1);
      }
      state.selection.selectionScene.remove(object.userData.clone);
      object.parent.remove(object);
    },
    setActivePort(state, port) {
      state.activePort = port;
    },
    setActiveTool: function (state, tool) {
      if (state.selection.selectionGroup.length > 1) {
        if (tool == 'rotate' || tool == 'scale') {
          return state.activeTool = 'select';
        }
      }
      return state.activeTool = tool;
    },
    addActiveObject(state, uuid) {
      Vue.set(state.activeObjects, uuid, true);
      this.dispatch("addToSelectionGroup", uuid);
    },
    clearActiveObjects(state) {
      state.activeObjects = {};
      this.dispatch("emptySelectionGroup");
    },
    deleteActiveObjects: function (state) {
      this.dispatch("emptySelectionGroup");
      for (const uuid in state.activeObjects) {
        let object = state.scene.getObjectByProperty("uuid", uuid);

        if (object.userData.type !== 'Camera' && object.userData.type !== 'Origin') {
          this.commit("deleteObject", object);
        }
      }
      this.commit("clearActiveObjects");
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
    setCtrlPressed: function (state, bool) {
      state.ctrlPressed = bool;
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

      if (state.mode == 'design') {
        if (Object.keys(state.activeObjects).length == 1) {
          let activeObjectUuid = Object.keys(state.activeObjects)[0];

          activeAnimation = state.animations.find(
            animation => animation.uuid == activeObjectUuid
          );
        }

        if (activeAnimation) {
          activeAnimation.effects.forEach(effect => {
            let uniqueEffect = ledMaterialUtil.makeEffectUnique(effect, effect.uuid);

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
            let uniqueEffect = ledMaterialUtil.makeEffectUnique(effect, 'left' + effect.uuid, 'left');

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
            let uniqueEffect = ledMaterialUtil.makeEffectUnique(effect, 'right' + effect.uuid, 'right');

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

      let bufferUniforms = Object.assign(uniforms, {
        width: { value: state.bufferWidth },
        height: { value: state.bufferHeight }
      });
      let material = ledMaterialUtil.getLEDMaterial(uniforms, {activeAnimations}, shaderParameters, shader);
      state.bufferMaterial = ledMaterialUtil.getBufferMaterial(bufferUniforms, shaderParameters, shader);

      

      for (let i = 0; i < this.getters.LEDs.length; i++) {
        ledMaterialUtil.applyAttributes(state, this.getters.LEDs[i], i);
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
