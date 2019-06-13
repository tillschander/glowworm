export default {
  state: {
    clonedElements: [],
  },
  getters: {
    canCopy: (state, getters, rootState, rootGetters) => {
      if (!rootGetters.activeElement) return false;
      return ['LED', 'Object', 'Group', 'Animation', 'Mask'].indexOf(rootGetters.activeElement.userData.type) > -1;
    },
    canPaste: (state) => {
      return (state.clonedElements.length > 0) ? true : false;
    },
  },
  actions: {
    copy: function ({ state, getters, rootState, rootGetters }) {
      if (!getters.canCopy) return;

      state.clonedElements = [];
      rootGetters.activeElementsUuids.forEach(uuid => {
        let original = rootState.scene.getObjectByProperty("uuid", uuid);
        let clone = original.clone();

        state.clonedElements.push(clone);
      });
    },
    paste: function ({ state, rootState }) {
      let newUuids = [];

      state.clonedElements.forEach(clone => {
        let newClone = clone.clone();

        rootState.scene.add(newClone);
        newUuids.push(newClone.uuid);
        if (newClone.userData.type == 'Animation') {
          rootState.animations.animations.push({
            uuid: newClone.uuid,
            effects: [] // TODO clone effects
          });
        }
      });

      this.commit("clearActiveElements");
      newUuids.forEach(uuid => {
        this.commit("addActiveElement", uuid);
      });
    },
  }
}
