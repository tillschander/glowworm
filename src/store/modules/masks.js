export default {
    state: {},
    getters: {
        masks: (state, getters, rootState) => {
            let masks = [];
            rootState.scene.traverse(function (child) {
              if (child.userData.type === "Mask") {
                masks.push(child);
              }
            });
            return masks.sort((a, b) => a.id - b.id);
          },
    },
    actions: {
        updateMaskLEDs: function ({ rootState }, options) {
            rootState.scene.getObjectByProperty('uuid', options.uuid).userData.LEDs = options.LEDs;
        },
        addMask: function ({ rootState }, options) {
            let mask = new THREE.Object3D();

            mask.name = options.name || 'Mask';
            mask.userData.type = 'Mask';
            mask.visible = false;
            mask.userData.LEDs = options.LEDs || [];
            rootState.scene.add(mask);

            this.commit("clearActiveElements");
            this.commit("addActiveElement", mask.uuid);
        }
    }
}
