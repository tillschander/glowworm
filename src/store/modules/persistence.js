const fs = require('fs');

export default {
  state: {
    savePath: null
  },
  mutations: {
    setSavePath: function (state, path) {
      state.savePath = path;
    }
  },
  actions: {
    save: function ({ state, rootState, rootGetters }) {
      let saveState = {};

      for (const key in rootState) {
        switch (key) {
          case 'fps':
          case 'renderer':
          case 'scene':
          case 'orbitControl':
          case 'transformControl':
          case 'transformDummy':
          case 'activePort':
          case 'maxConnections':
          case 'bufferRenderer':
          case 'bufferCamera':
          case 'bufferScene':
          case 'bufferTexture':
          case 'bufferWidth':
          case 'bufferHeight':
          case 'bufferMaterial':
          case 'bufferGeometry':
          case 'bufferObject':
          case 'buffer':
          case 'ctrlPressed':
          case 'persistence':
          case 'selection':
            continue;
          case 'camera':
            saveState[key] = {
              position: rootState.camera.position,
              target: rootState.orbitControl.target
            }
            continue;
          case 'leds':
            saveState[key] = rootGetters.LEDs.map(LED => {
              return {
                uuid: LED.uuid,
                name: LED.name,
                position: LED.position,
                nextLED: LED.userData.nextLED
              };
            });
            break;
          case 'objects':
            saveState[key] = rootGetters.objects.map(object => {
              let data = {
                type: object.userData.objectType,
                uuid: object.uuid,
                name: object.name,
                position: object.position,
                rotation: object.rotation,
                scale: object.scale,
              };
              if (object.userData.path) data.path = object.userData.path;
              return data;
            });
            break;
          case 'animations':
            saveState[key] = rootState.animations[key].map(animation => {
              let threeObject = rootState.scene.getObjectByProperty("uuid", animation.uuid);
              return {
                uuid: animation.uuid,
                name: threeObject.name,
                effects: animation.effects
              };
            });
            break;
          case 'masks':
            saveState[key] = rootGetters.masks.map(mask => {
              return {
                uuid: mask.uuid,
                name: mask.name,
                LEDs: mask.userData.LEDs
              };
            });
            break;
          case 'connections':
            saveState['showConnections'] = rootState.connections.showConnections;
            saveState['origin'] = {
              position: rootState.connections.origin.position,
              nextLED: rootState.connections.origin.userData.nextLED
            };
            break;
          default:
            saveState[key] = rootState[key];
            break;
        }
      }

      if (state.savePath) {
        fs.writeFile(state.savePath, JSON.stringify(saveState, null, 2), (error) => {
          if (error) console.log(error);
          // TODO: Maybe add animation to show that the save was successfull
        });
      } else {
        // TODO: Ask for save path
        // TODO: enable ctrl+s
        console.log('Error: No save path defined.');
      }
    },
    load: function ({ rootState, rootGetters }, path) {
      let data = JSON.parse(fs.readFileSync(path, 'utf8'));

      this.dispatch('emptySelectionGroup');
      for (var i = rootGetters.LEDs.length - 1; i >= 0; i--) {
        this.commit('deleteElement', rootGetters.LEDs[i]);
      };
      for (var i = rootGetters.objects.length - 1; i >= 0; i--) {
        this.commit('deleteElement', rootGetters.objects[i]);
      };
      for (var i = rootState.animations.animations.length - 1; i >= 0; i--) {
        this.commit('deleteElement', rootState.scene.getObjectByProperty("uuid", rootState.animations[i].uuid));
      };
      for (var i = rootGetters.masks.length - 1; i >= 0; i--) {
        this.commit('deleteElement', rootState.scene.getObjectByProperty("uuid", rootState.animations[i].uuid));
      };

      for (const key in data) {
        switch (key) {
          case 'camera':
            rootState.camera.position.set(data[key].position.x, data[key].position.y, data[key].position.z);
            rootState.orbitControl.target.set(data[key].target.x, data[key].target.y, data[key].target.z);
            rootState.orbitControl.update();
            break;
          case 'leds':
            data.leds.forEach(LED => {
              this.dispatch('addLED', {
                uuid: LED.uuid,
                name: LED.name,
                position: [LED.position.x, LED.position.y, LED.position.z]
              });
            });
            rootGetters.LEDs.forEach(LED => {
              this.dispatch('disconnectBoth', LED);
            });
            data.leds.forEach(LED => {
              let ledObject = rootState.scene.getObjectByProperty('uuid', LED.uuid);
              let nextLedObject = rootState.scene.getObjectByProperty('uuid', LED.nextLED);

              if (nextLedObject) this.dispatch('connectFromTo', { from: ledObject, to: nextLedObject });
            });
            break;
          case 'objects':
            data.objects.forEach(object => {
              this.commit('add' + object.type, {
                uuid: object.uuid,
                name: object.name,
                position: [object.position.x, object.position.y, object.position.z],
                rotation: [object.rotation._x, object.rotation._y, object.rotation._z],
                scale: [object.scale.x, object.scale.y, object.scale.z],
                path: object.path
              });
            });
            break;
          case 'animations':
            data.animations.forEach(animation => {
              this.dispatch('addAnimation', {
                uuid: animation.uuid,
                name: animation.name,
                effects: animation.effects
              });
            });
            break;
          case 'masks':
            data.masks.forEach(mask => {
              this.dispatch('addMask', {
                uuid: mask.uuid,
                name: mask.name,
                LEDs: mask.LEDs
              });
            });
            break;
          case 'maxFps':
            this.commit('setMaxFps', data[key]);
            break;
          case 'activeTool':
            this.commit('setActiveTool', data[key]);
            break;
          case 'mode':
            this.commit('setMode', data[key]);
            break;
          case 'snapToGrid':
            this.commit('setSnapToGrid', data[key]);
            break;
          case 'showConnections':
            this.commit('setShowConnections', data[key]);
            break;
          case 'leftAnimation':
            this.commit('setLiveAnimation', { side: 'left', uuid: data[key] });
            break;
          case 'rightAnimation':
            this.commit('setLiveAnimation', { side: 'right', uuid: data[key] });
            break;
          case 'mixValue':
            this.commit('setMixValue', data[key]);
            break;
          case 'globalOpacity':
            this.commit('setGlobalOpacity', data[key]);
            break;
          case 'origin':
          case 'activeElements':
            // skip and handle later
            break;
          default:
            console.log('Unrecognized save data: ' + key);
            break;
        }
      }

      rootState.connections.origin.position.copy(data.origin.position);
      if (data.origin.nextLED) {
        let nextLED = rootState.scene.getObjectByProperty('uuid', data.origin.nextLED);
        this.dispatch('connectFromTo', { from: rootState.connections.origin, to: nextLED })
      }
      this.commit('clearActiveElements');
      Object.keys(data.activeElements).forEach(uuid => {
        this.commit("addActiveElement", uuid);
      });

      console.log(rootState);
    }
  }
}
