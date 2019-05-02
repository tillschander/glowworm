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
    save: function ({ state, rootState }) {
      let saveState = {};

      for (const key in rootState) {
        switch (key) {
          case 'fps':
          case 'scene':
          case 'lineGeometry':
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
          case 'line':
          case 'persistence':
          case 'shiftPressed':
          case 'maxConnections':
          case 'activeLEDMaterial':
          case 'selectionGroup':
          case 'orbit':
          case 'ports':
            continue;
          case 'lineConnections':
            // TODO ?
            continue;
          case 'activePort':
            // TODO ?
            continue;
          case 'camera':
            saveState[key] = {
              position: rootState.camera.position,
              target: rootState.orbit.target
            }
            continue;
          case 'LEDs':
            saveState[key] = rootState[key].map(LED => {
              let threeObject = rootState.scene.getObjectByProperty("uuid", LED.uuid);
              return {
                uuid: LED.uuid,
                name: threeObject.name,
                position: threeObject.position
              }
            });
            break;
          case 'objects':
            saveState[key] = rootState[key].map(object => {
              let threeObject = rootState.scene.getObjectByProperty("uuid", object.uuid);
              return {
                uuid: object.uuid,
                name: threeObject.name,
                type: threeObject.userData.objectType,
                position: threeObject.position,
                rotation: threeObject.rotation,
                scale: threeObject.scale,
              }
            });
            break;
          case 'animations':
            saveState[key] = rootState[key].map(animation => {
              let threeObject = rootState.scene.getObjectByProperty("uuid", animation.uuid);
              return {
                uuid: animation.uuid,
                name: threeObject.name,
                effects: animation.effects
              }
            });
            break;
          default:
            saveState[key] = rootState[key];
            break;
        }
      }

      Object.keys(rootState.activeObjects).forEach(uuid => {
        let threeObject = rootState.scene.getObjectByProperty("uuid", uuid);
        let type = threeObject.userData.type;
        let newPosition = threeObject.position.clone();
        let elements = (type == 'LED') ? saveState['LEDs'] : saveState['objects'];

        newPosition.add(threeObject.parent.position);
        elements[elements.findIndex(elem => elem.uuid == uuid)].position = newPosition;

        // TODO:
        // - rotation: threeObject.rotation,
        // - scale: threeObject.scale,
        // - selected groups
      });

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
    load: function ({ rootState }, path) {
      let data = JSON.parse(fs.readFileSync(path, 'utf8'));

      this.commit('emptySelectionGroup');
      for (var i = rootState.LEDs.length - 1; i >= 0; i--) {
        this.commit('deleteObject', rootState.scene.getObjectByProperty("uuid", rootState.LEDs[i].uuid));
      };
      for (var i = rootState.objects.length - 1; i >= 0; i--) {
        this.commit('deleteObject', rootState.scene.getObjectByProperty("uuid", rootState.objects[i].uuid));
      };
      for (var i = rootState.animations.length - 1; i >= 0; i--) {
        this.commit('deleteObject', rootState.scene.getObjectByProperty("uuid", rootState.animations[i].uuid));
      };

      for (const key in data) {
        switch (key) {
          case 'LEDs':
            data.LEDs.forEach(LED => {
              this.commit('addLED', {
                uuid: LED.uuid,
                name: LED.name,
                position: [LED.position.x, LED.position.y, LED.position.z]
              });
            });
            break;
          case 'objects':
            data.objects.forEach(object => {
              let properties = {
                uuid: object.uuid,
                name: object.name,
                type: object.type,
                position: [object.position.x, object.position.y, object.position.z],
                rotation: [object.rotation._x, object.rotation._y, object.rotation._z],
                scale: [object.scale.x, object.scale.y, object.scale.z]
              };

              if (object.type == 'box') {
                this.commit('addBox', properties);
              } else if (object.type == 'plane') {
                this.commit('addPlane', properties);
              } else if (object.type == 'model') {
                this.commit('addObject', properties);
              }
            });
            break;
          case 'animations':
            data.animations.forEach(animation => {
              this.commit('addAnimation', {
                uuid: animation.uuid,
                name: animation.name,
                effects: animation.effects
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
          case 'activeObjects':
            // skip and handle last so it won't be overridden
            break;
          case 'camera':
            rootState.camera.position.set(data[key].position.x, data[key].position.y, data[key].position.z);
            rootState.orbit.target.set(data[key].target.x, data[key].target.y, data[key].target.z);
            rootState.orbit.update();
            break;
          default:
            console.log('Unrecognized save data: ' + key);
            break;
        }
      }

      this.commit('clearActiveObjects');
      Object.keys(data.activeObjects).forEach(uuid => {
        this.commit("addActiveObject", uuid);
      });
    }
  }
}
