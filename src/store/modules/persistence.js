const fs = require('fs');
const remote = require("electron").remote;

function saveToGroup(saveState, groupType, element) {
  let index = saveState.groups.findIndex(group => group.uuid == element.parent.uuid);

  if (index === -1) {
    saveState.groups.push({
      type: groupType,
      uuid: element.parent.uuid,
      name: element.parent.name,
      position: element.parent.position,
      rotation: element.parent.rotation,
      scale: element.parent.scale,
      children: [element.uuid]
    });
  } else {
    saveState.groups[index].children.push(element.uuid);
  }
}

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
    save: function({ state }) {
      if (state.savePath) {
        this.dispatch("executeSave");
      } else {
        let path = remote.dialog.showSaveDialog({
          filters: [{ name: "Custom File Type", extensions: ["json"] }],
          defaultPath: "save.json"
        });
  
        if (path) {
          this.commit("setSavePath", path);
          this.dispatch("executeSave");
        }
      }
    },
    load: function() {
      let paths = remote.dialog.showOpenDialog({
        filters: [{ name: "Custom File Type", extensions: ["json"] }],
        properties: ["openFile"]
      });

      if (paths && paths.length) {
        this.dispatch("executeLoad", paths[0]);
      }
    },
    executeSave: function ({ state, rootState, rootGetters }) {
      let saveState = {
        groups: []
      };

      for (const key in rootState) {
        switch (key) {
          case 'fps':
          case 'renderer':
          case 'scene':
          case 'orbitControl':
          case 'transformControl':
          case 'transformDummy':
          case 'activePort':
          case 'ctrlPressed':
          case 'persistence':
          case 'selection':
          case 'output':
          case 'buffer':
          case 'copypaste':
            continue;
          case 'camera':
            saveState[key] = {
              position: rootState.camera.position,
              target: rootState.orbitControl.target
            }
            continue;
          case 'leds':
            saveState[key] = rootGetters.LEDs.map(LED => {
              let data = {
                uuid: LED.uuid,
                name: LED.name,
                position: LED.position
              };

              if (LED.parent.userData.type == 'Group') saveToGroup(saveState, 'LED', LED);
              data.nextLED = (LED.userData.nextLED) ? LED.userData.nextLED.uuid : undefined;

              return data;
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

              if (object.parent.userData.type == 'Group') saveToGroup(saveState, 'Object', object);
              if (object.userData.path) data.path = object.userData.path;
              return data;
            });
            break;
          case 'animations':
            saveState[key] = rootState.animations[key].map(animation => {
              let threeObject = rootState.scene.getObjectByProperty("uuid", animation.uuid);
              let effects = animation.effects.map(effect => {
                delete effect.maskObject;
                return effect;
              });

              return {
                uuid: animation.uuid,
                name: threeObject.name,
                effects
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
              nextLED: rootState.connections.origin.userData.nextLED.uuid
            };
            break;
          case 'elements':
            saveState['activeElements'] = rootState.elements.activeElements;
            break;
          default:
            saveState[key] = rootState[key];
            break;
        }
      }

      if (state.savePath) {
        fs.writeFile(state.savePath, JSON.stringify(saveState, null, 2), (error) => {
          if (error) console.log(error);
        });
      } else {
        console.log('Error: No save path defined.');
      }
    },
    executeLoad: function ({ rootState, rootGetters }, path) {
      let data = JSON.parse(fs.readFileSync(path, 'utf8'));

      this.dispatch('emptySelectionGroup');
      for (var i = rootState.scene.children.length - 1; i >= 0; i--) {
        let toDelete = ['LED', 'Object', 'Group', 'Animation', 'Mask'];

        if (toDelete.indexOf(rootState.scene.children[i].userData.type) > -1) {
          this.dispatch('deleteElement', rootState.scene.children[i]);
        }
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
            data.leds.forEach(LEDData => {
              let LED = rootState.scene.getObjectByProperty('uuid', LEDData.uuid);
              let nextLED = rootState.scene.getObjectByProperty('uuid', LEDData.nextLED);

              if (nextLED) this.dispatch('connectFromTo', { from: LED, to: nextLED });
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
          case 'groups':
            // skip and handle later
            break;
          default:
            console.log('Unrecognized save data: ' + key);
            break;
        }
      }

      // Handle groups
      data.groups.forEach(group => {
        let children = group.children.map(child => rootState.scene.getObjectByProperty('uuid', child));

        this.dispatch("addGroup", {
          groupType: group.type,
          uuid: group.uuid,
          name: group.name,
          position: group.position,
          rotation: group.rotation,
          scale: group.scale,
          children,
        });
      });

      // Handle masks of effects
      rootState.animations.animations.map(animation => {
        animation.effects.map(effect => {
          if (effect.mask) {
            effect.maskObject = rootState.scene.getObjectByProperty('uuid', effect.mask);
          }
        })
      });

      // Handle origin
      rootState.connections.origin.position.copy(data.origin.position);
      if (data.origin.nextLED) {
        let nextLED = rootState.scene.getObjectByProperty('uuid', data.origin.nextLED);
        this.dispatch('connectFromTo', { from: rootState.connections.origin, to: nextLED })
      }

      // Handle active elements
      this.commit('clearActiveElements');
      Object.keys(data.activeElements).forEach(uuid => {
        this.commit("addActiveElement", uuid);
      });

      console.log(rootState);
    }
  }
}
