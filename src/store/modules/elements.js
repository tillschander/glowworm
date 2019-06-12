import Vue from 'vue';
import transformUtil from "../../utils/transform.js";

export default {
  state: {
    activeElements: {},
  },
  getters: {
    activeElementsUuids: (state, getters, rootState) => {
      return Object.keys(state.activeElements);
    },
    activeElementUuid: (state, getters, rootState) => {
      if (getters.activeElementsUuids.length) return getters.activeElementsUuids[0];
      return undefined;
    },
    activeElement: (state, getters, rootState) => {
      return rootState.scene.getObjectByProperty("uuid", getters.activeElementUuid);
    },
  },
  mutations: {
    addActiveElement(state, uuid) {
      Vue.set(state.activeElements, uuid, true);
      this.dispatch("addToSelectionGroup", uuid);
      this.dispatch("updateTransformControlVisibility");
    },
    removeActiveElement(state, uuid) {
      Vue.delete(state.activeElements, uuid);
      this.dispatch("removeFromSelectionGroup", uuid);
      this.dispatch("updateTransformControlVisibility");
    },
    clearActiveElements(state) {
      state.activeElements = {};
      this.dispatch("emptySelectionGroup");
      this.dispatch("updateTransformControlVisibility");
    },
  },
  actions: {
    addGroup: function ({ rootState }, options) {
      let group = new THREE.Group();
      let i = options.children.length;
      let center = transformUtil.getCenter(options.children);

      group.position.copy(center);
      while (i--) {
        options.children[i].position.sub(center)
        group.add(options.children[i]);
      }
      if (options.name) group.name = options.name;
      if (options.uuid) group.uuid = options.uuid;
      if (options.position) group.position.copy(options.position);
      if (options.rotation) group.rotation.copy(options.rotation);
      if (options.scale) group.scale.copy(options.scale);
      group.userData.type = 'Group';
      group.userData.groupType = options.groupType;
      rootState.scene.add(group);

      setTimeout(() => this.dispatch('updateLEDConnections', options.children), 1);
      this.commit("clearActiveElements");
      this.commit("addActiveElement", group.uuid);
    },
    deleteElement({ rootState }, element) {
      if (element.userData.type == 'LED') {
        this.dispatch("disconnectBoth", element);
      } else if (element.userData.groupType == 'LED') {
        element.children.forEach(child => {
          this.dispatch("disconnectBoth", child);
        });
      } else if (element.userData.type == 'Animation') {
        let index = rootState.animations.animations.findIndex((elem) => elem.uuid == element.uuid);
        rootState.animations.animations.splice(index, 1);
      }
      rootState.selection.selectionScene.remove(element.userData.clone);
      element.parent.remove(element);
    },
    deleteActiveElements: function ({ state, rootState }) {
      this.dispatch("emptySelectionGroup");
      for (const uuid in state.activeElements) {
        let element = rootState.scene.getObjectByProperty("uuid", uuid);

        if (element.userData.type !== 'Camera' && element.userData.type !== 'Origin') {
          this.dispatch("deleteElement", element);
        }
      }
      this.commit("clearActiveElements");
    }
  }
}
