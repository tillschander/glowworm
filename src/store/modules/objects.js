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
    addBox: function (state, options = {}) {
      this.dispatch('addObject', {
        mesh: new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10), state.objectMaterial),
        type: 'Box',
        uuid: options.uuid || THREE.Math.generateUUID(),
        name: options.name || 'Box',
        position: options.position || [0, 0, 0],
        rotation: options.rotation || [0, 0, 0],
        scale: options.scale || [1, 1, 1],
      });
    },
    addSphere: function (state, options = {}) {
      this.dispatch('addObject', {
        mesh: new THREE.Mesh(new THREE.SphereBufferGeometry(5, 10, 8), state.objectMaterial),
        type: 'Sphere',
        uuid: options.uuid || THREE.Math.generateUUID(),
        name: options.name || 'Sphere',
        position: options.position || [0, 0, 0],
        rotation: options.rotation || [0, 0, 0],
        scale: options.scale || [1, 1, 1],
      });
    },
    addPlane: function (state, options = {}) {
      this.dispatch('addObject', {
        mesh: new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10), state.planeMaterial),
        type: 'Plane',
        uuid: options.uuid || THREE.Math.generateUUID(),
        name: options.name || 'Plane',
        position: options.position || [0, 0, 0],
        rotation: options.rotation || [0, 0, 0],
        scale: options.scale || [1, 1, 1],
      });
    },
    addCylinder: function (state, options = {}) {
      this.dispatch('addObject', {
        mesh: new THREE.Mesh(new THREE.CylinderBufferGeometry(5, 5, 10, 12), state.objectMaterial),
        type: 'Cylinder',
        uuid: options.uuid || THREE.Math.generateUUID(),
        name: options.name || 'Cylinder',
        position: options.position || [0, 0, 0],
        rotation: options.rotation || [0, 0, 0],
        scale: options.scale || [1, 1, 1],
      });
    },
    addCone: function (state, options = {}) {
      this.dispatch('addObject', {
        mesh: new THREE.Mesh(new THREE.ConeBufferGeometry(5, 10, 12), state.objectMaterial),
        type: 'Cone',
        uuid: options.uuid || THREE.Math.generateUUID(),
        name: options.name || 'Cone',
        position: options.position || [0, 0, 0],
        rotation: options.rotation || [0, 0, 0],
        scale: options.scale || [1, 1, 1],
      });
    },
    addModel: function (state, options = {path: ''}) {
      let self = this;
      let loader = new THREE.OBJLoader();

      loader.load(
        "file://" + options.path,
        function(object) {
          object.userData.path = options.path;

          self.dispatch('addObject', {
            mesh: object,
            type: 'Model',
            uuid: options.uuid || THREE.Math.generateUUID(),
            name: options.name || 'Model',
            position: options.position || [0, 0, 0],
            rotation: options.rotation || [0, 0, 0],
            scale: options.scale || [1, 1, 1],
          });
        },
        null,
        function(error) {
          console.log(error);
        }
      );
    }
  },
  actions: {
    addObject: function ({ rootState }, options = {}) {
      options.mesh.userData.type = 'Object';
      options.mesh.userData.objectType = options.type;
      options.mesh.uuid = options.uuid;
      options.mesh.name = options.name;
      options.mesh.position.set(options.position[0], options.position[1], options.position[2]);
      options.mesh.rotateX(options.rotation[0]);
      options.mesh.rotateY(options.rotation[1]);
      options.mesh.rotateZ(options.rotation[2]);
      options.mesh.scale.set(options.scale[0], options.scale[1], options.scale[2]);
      
      rootState.scene.add(options.mesh);
      this.commit("clearActiveElements");
      this.commit("addActiveElement", options.mesh.uuid);
    },
  }
}
