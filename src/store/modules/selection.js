import transformUtil from "../../utils/transform.js";

export default {
  state: {
    selectionGroup: [],
    selectionScene: new THREE.Scene(),
    selectionMaterial: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 0.3, 0.3) }),
    planeSelectionMaterial: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 0.3, 0.3), side: THREE.DoubleSide }),
    outlineTarget: new THREE.WebGLRenderTarget(),
    outlineComposer: null,
    outlineRenderPass: null,
    outlineShaderPass: null,
    finalComposer: null,
    renderPass: null,
    texturePass: null
  },
  actions: {
    addToSelectionGroup: function ({ state, rootState }, uuid) {
      let object = rootState.scene.getObjectByProperty("uuid", uuid);

      if (object.userData.type == 'LED') {
        if (object.parent.userData.type == 'Group') {
          object.userData.clone = new THREE.Group();
          object.userData.clone.position.copy(object.parent.position);
          object.userData.clone.rotation.copy(object.parent.rotation);
          object.userData.clone.scale.copy(object.parent.scale);
          object.userData.clone.add(new THREE.Mesh(new THREE.SphereBufferGeometry(3), state.selectionMaterial));
          object.userData.clone.children[0].position.copy(object.position);
          if (object.userData.clone.scale.x !== 1) object.userData.clone.children[0].scale.setX(1 / object.userData.clone.scale.x);
          if (object.userData.clone.scale.y !== 1) object.userData.clone.children[0].scale.setY(1 / object.userData.clone.scale.y);
          if (object.userData.clone.scale.z !== 1) object.userData.clone.children[0].scale.setZ(1 / object.userData.clone.scale.z);
        } else {
          object.userData.clone = new THREE.Mesh(new THREE.SphereBufferGeometry(3), state.selectionMaterial);
          object.userData.clone.position.copy(object.position);
        }
      } else if (object.userData.groupType == 'LED') {
        object.userData.clone = new THREE.Group();
        object.userData.clone.position.copy(object.position);
        object.userData.clone.rotation.copy(object.rotation);
        object.userData.clone.scale.copy(object.scale);
        for (let i = 0; i < object.children.length; i++) {
          object.userData.clone.add(new THREE.Mesh(new THREE.SphereBufferGeometry(3), state.selectionMaterial));
          object.userData.clone.children[i].position.copy(object.children[i].position);
          if (object.userData.clone.scale.x !== 1) object.userData.clone.children[i].scale.setX(1 / object.userData.clone.scale.x);
          if (object.userData.clone.scale.y !== 1) object.userData.clone.children[i].scale.setY(1 / object.userData.clone.scale.y);
          if (object.userData.clone.scale.z !== 1) object.userData.clone.children[i].scale.setZ(1 / object.userData.clone.scale.z);
        }
      } else if (object.userData.objectType == 'plane') {
        object.userData.clone = object.clone();
        object.userData.clone.material = state.planeSelectionMaterial;
      } else {
        object.userData.clone = object.clone();
        object.userData.clone.material = state.selectionMaterial;
      }
      state.selectionScene.add(object.userData.clone);
      state.selectionGroup.push(object);

      rootState.transformDummy.position.copy(transformUtil.getCenter(state.selectionGroup));
      rootState.transformDummy.rotation.set(0, 0, 0);
      rootState.transformDummy.scale.set(1, 1, 1);

      if ((rootState.activeTool == 'move' && !this.getters.canMove)
        || (rootState.activeTool == 'rotate' && !this.getters.canRotate)
        || (rootState.activeTool == 'scale' && !this.getters.canScale)) {
        this.commit('setActiveTool', 'select');
      }
    },
    emptySelectionGroup: function ({ state, rootState }) {
      for (var i = state.selectionGroup.length - 1; i >= 0; i--) {
        let child = state.selectionGroup[i];

        state.selectionGroup.splice(state.selectionGroup.indexOf(child), 1);
        state.selectionScene.remove(child.userData.clone);
        child.userData.clone = null;
      }
    },
    initSelection: function ({ state, rootState }) {
      state.outlineComposer = new THREE.EffectComposer(rootState.renderer, state.outlineTarget);
      state.outlineRenderPass = new THREE.RenderPass(state.selectionScene, rootState.camera);
      state.outlineShaderPass = new THREE.ShaderPass(THREE.SobelOperatorShader);
      state.finalComposer = new THREE.EffectComposer(rootState.renderer);
      state.renderPass = new THREE.RenderPass(rootState.scene, rootState.camera);
      state.texturePass = new THREE.ShaderPass({
        uniforms: {
          tOutline: { value: null },
          tDiffuse: { value: null },
          resolution: { value: new THREE.Vector2() }
        },
        vertexShader: [
          "varying vec2 vUv;",
          "void main() {",
          " vUv = uv;",
          " gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
          "}"
        ].join("\n"),
        fragmentShader: [
          "uniform sampler2D tOutline;",
          "uniform sampler2D tDiffuse;",
          "uniform vec2 resolution;",
          "varying vec2 vUv;",
          "void main() {",
          " vec4 previousPassColor = texture2D(tDiffuse, vUv);",
          " vec4 outlineColor = texture2D(tOutline, vUv);",
          " gl_FragColor = (1.0 - outlineColor.r) * previousPassColor + outlineColor.r * vec4(0.0,1.0,1.0,1.0);",
          "}"
        ].join("\n")
      });
      state.texturePass.uniforms["tOutline"].value = state.outlineComposer.renderTarget1;

      state.outlineComposer.addPass(state.outlineRenderPass);
      state.outlineComposer.addPass(state.outlineShaderPass);
      state.outlineComposer.addPass(new THREE.ShaderPass(THREE.CopyShader));
      state.finalComposer.addPass(state.renderPass);
      state.finalComposer.addPass(state.texturePass);
    }
  }
}
