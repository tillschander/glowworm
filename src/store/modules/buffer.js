export default {
  state: {
    renderer: new THREE.WebGLRenderer(),
    camera: null,
    scene: new THREE.Scene(),
    texture: null,
    width: 8,
    height: 8,
    material: null,
    geometry: null,
    object: null,
    data: null,
  },
  mutations: {
    initBuffer(state) {
      let bufferLength = state.width * state.height;
      let indices = Float32Array.from({ length: bufferLength }, (v, k) => k);
      let positions = new Float32Array(bufferLength * 3);

      state.camera = new THREE.OrthographicCamera(
        state.width / -2,
        state.width / 2,
        state.height / 2,
        state.height / -2,
        -1,
        1
      );

      state.texture = new THREE.WebGLRenderTarget(state.width, state.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
      });

      state.geometry = new THREE.PlaneBufferGeometry(state.width - 1, state.height - 1, state.width - 1, state.height - 1);
      state.geometry.addAttribute("LEDIndex", new THREE.BufferAttribute(indices, 1));
      state.geometry.addAttribute("LEDPosition", new THREE.BufferAttribute(positions, 3));

      state.object = new THREE.Points(state.geometry, state.material);
      state.scene.add(state.object);

      state.data = new Float32Array(4 * bufferLength);

      state.renderer.setSize(128, 128);
      document.querySelector("body").appendChild(state.renderer.domElement);
    },
  }
}
