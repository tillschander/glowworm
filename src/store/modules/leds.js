import ledMaterialUtil from "../../utils/ledMaterial.js";

export default {
  state: {
    activeMaterial: null,
  },
  getters: {
    LEDs: (state, getters, rootState) => {
      let LEDs = [];
      rootState.scene.traverse(function (child) {
        if (child.userData.type === "LED") {
          LEDs.push(child);
        }
      });
      return LEDs.sort((a, b) => a.id - b.id);
    },
  },
  actions: {
    addLED: function ({ state, rootState }, options = { position: [0, 0, 0] }) {
      let geometry = new THREE.PlaneBufferGeometry(10, 10);
      let material = state.activeMaterial;
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
              let masked = effect.maskObject && effect.maskObject.userData.LEDs.includes(this.uuid);

              if (rootState.mode == 'live') {
                if (animation.uuid == rootState.leftAnimation) {
                  state.activeMaterial.uniforms['maskedleft' + effect.uuid].value = masked;
                  updateList.push('maskedleft' + effect.uuid);
                }
                if (animation.uuid == rootState.rightAnimation) {
                  state.activeMaterial.uniforms['maskedright' + effect.uuid].value = masked;
                  updateList.push('maskedright' + effect.uuid);
                }
              } else {
                state.activeMaterial.uniforms['masked' + effect.uuid].value = masked;
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
              uniforms.setValue(gl, name, state.activeMaterial.uniforms[name].value);
            });
          }
        }
      }

      rootState.scene.add(mesh);

      this.dispatch("connectMaybe", mesh);
      this.commit("clearActiveElements");
      this.commit("addActiveElement", mesh.uuid);
    },
    applyLEDMaterial: function ({ state, rootState, rootGetters }) {
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
        mixValue: new THREE.Uniform(rootState.mixValue),
        globalOpacity: new THREE.Uniform(rootState.globalOpacity),
      };

      if (rootState.mode == 'design') {
        if (rootGetters.activeElementsUuids.length == 1) {
          activeAnimation = rootState.animations.animations.find(
            animation => animation.uuid == rootGetters.activeElementUuid
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
      } else if (rootState.mode == 'live') {
        if (rootState.leftAnimation) {
          activeAnimation = rootState.animations.animations.find(
            animation => animation.uuid == rootState.leftAnimation
          );

          activeAnimation.effects.forEach(effect => {
            let uniqueEffect = ledMaterialUtil.makeEffectUnique(effect, 'left' + effect.uuid, 'left');

            uniforms = Object.assign(uniforms, uniqueEffect.properties);
            shaderParameters += "\n" + uniqueEffect.shaderParameters;
            shader += "\n" + uniqueEffect.shader;
          });
          activeAnimations.push(activeAnimation);
        }

        if (rootState.rightAnimation) {
          activeAnimation = rootState.animations.animations.find(
            animation => animation.uuid == rootState.rightAnimation
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
        width: { value: rootState.buffer.width },
        height: { value: rootState.buffer.height }
      });
      let material = ledMaterialUtil.getLEDMaterial(uniforms, { activeAnimations }, shaderParameters, shader);
      rootState.buffer.material = ledMaterialUtil.getBufferMaterial(bufferUniforms, shaderParameters, shader);



      for (let i = 0; i < this.getters.LEDs.length; i++) {
        ledMaterialUtil.applyAttributes(rootState, this.getters.LEDs[i], i);
        this.getters.LEDs[i].material = material;
        this.getters.LEDs[i].needsUpdate = true;
      }

      if (rootState.buffer.object) {
        rootState.buffer.object.material = rootState.buffer.material;
        rootState.buffer.object.needsUpdate = true;
        rootState.buffer.geometry.attributes.LEDPosition.needsUpdate = true;
      }

      this.dispatch('setActiveMaterial', material);
    },
    setActiveMaterial: function({state, rootState}, material) {
      state.activeMaterial = material;
    }
  }
}
