export default {
  state: {
    animations: [],
  },
  actions: {
    addAnimation: function ({ state, rootState }, options = {}) {
      let animation = new THREE.Object3D();

      if (options.name) animation.name = options.name;
      if (options.uuid) animation.uuid = options.uuid;
      animation.userData.type = 'Animation';
      animation.visible = false;
      rootState.scene.add(animation);
      state.animations.push({
        uuid: animation.uuid,
        effects: options.effects || []
      });
      this.commit("clearActiveElements");
      this.commit("addActiveElement", animation.uuid);
    },
  }
}
