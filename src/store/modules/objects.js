export default {
  state: {
    objectMaterial: new THREE.MeshPhongMaterial({ color: 0xDDDDDD }),
    planeMaterial: new THREE.MeshPhongMaterial({ color: 0xDDDDDD, side: THREE.DoubleSide })
  },
  getters: {
    objects: (state, getters, rootState) => {
      let objects = [];
      rootState.scene.traverse(function (child) {
        if (child.userData.type === "Object") {
          objects.push(child);
        }
      });
      return objects.sort((a, b) => a.id - b.id);
    },
  },
  mutations: {
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
      this.dispatch('addObject', object);
    },
    addSphere: function (state, options = { size: 5, position: [0, 0, 0] }) {
      let geometry = new THREE.SphereBufferGeometry(options.size, 10, 8);
      let mesh = new THREE.Mesh(geometry, state.objectMaterial);

      this.dispatch('addObject', { mesh, position: options.position, name: 'Sphere', type: 'sphere' });
    },
    addPlane: function (state, options = { size: [10, 10], position: [0, 0, 0] }) {
      let geometry = new THREE.PlaneBufferGeometry(options.size[0], options.size[1]);
      let mesh = new THREE.Mesh(geometry, state.planeMaterial);

      this.dispatch('addObject', { mesh, position: options.position, name: 'Plane', type: 'plane' });
    },
    addCylinder: function (state, options = { size: [5, 10], position: [0, 0, 0] }) {
      let geometry = new THREE.CylinderBufferGeometry(options.size[0], options.size[0], options.size[1]);
      let mesh = new THREE.Mesh(geometry, state.objectMaterial);

      this.dispatch('addObject', { mesh, position: options.position, name: 'Cylinder', type: 'cylinder' });
    },
    addCone: function (state, options = { size: [5, 10], position: [0, 0, 0] }) {
      let geometry = new THREE.ConeBufferGeometry(options.size[0], options.size[1], 12);
      let mesh = new THREE.Mesh(geometry, state.objectMaterial);

      this.dispatch('addObject', { mesh, position: options.position, name: 'Cone', type: 'cone' });
    }
  },
  actions: {
    addObject: function ({ state, rootState }, options = { mesh: null, position: [0, 0, 0], type: 'box' }) {
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
      rootState.scene.add(options.mesh);
      this.commit("clearActiveElements");
      this.commit("addActiveElement", options.mesh.uuid);
    },
  }
}
