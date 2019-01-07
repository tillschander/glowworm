<template>
  <div @mouseup="onMouseup" id="viewport" class="viewport"></div>
</template>

<script>
import MainLoop from "mainloop.js";
//import * as THREE from "three";
let THREE = require("three");
let OrbitControls = require("../assets/js/OrbitControls.js")(THREE);
let TransformControls = require("../assets/js/TransformControls.js")(THREE);

export default {
  name: "Viewport",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      light: null,
      orbit: null,
      control: null
    };
  },
  computed: {
    width: {
      cache: false,
      get: function() {
        return document.getElementById("viewport").clientWidth;
      }
    },
    height: {
      cache: false,
      get: function() {
        return document.getElementById("viewport").clientHeight;
      }
    },
    maxFps: function() {
      return this.$store.state.maxFps;
    }
  },
  watch: {
    /*
    LEDs(newLEDs, oldLEDs) {
      newLEDs.forEach(LED => {
        this.addLED("0xffffff");
      });
    },
    */
    maxFps(newMaxFps) {
      MainLoop.setMaxAllowedFPS(newMaxFps);
    }
  },
  methods: {
    init: function() {
      let container = document.getElementById("viewport");
      let aspect = this.width / this.height;

      this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 3000);
      this.camera.position.set(1000, 500, 1000);
      this.camera.lookAt(0, 200, 0);

      this.scene = new THREE.Scene();
      this.scene.add(new THREE.GridHelper(1000, 10));

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      container.appendChild(this.renderer.domElement);

      this.light = new THREE.DirectionalLight(0xffffff, 2);
      this.light.position.set(1, 1, 1);
      this.scene.add(this.light);

      this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
      this.orbit.update();

      this.control = new TransformControls(
        this.camera,
        this.renderer.domElement
      );
      this.control.addEventListener("dragging-changed", this.onDraggingChanged);
      this.scene.add(this.control);
    },
    render: function() {
      this.$store.commit("setFps", MainLoop.getFPS());
      this.renderer.render(this.scene, this.camera);
    },
    onResize: function() {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    },
    onMouseup: function(event) {
      let raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(this.getPointer(event), this.camera);

      let intersects = raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        this.selectObject(intersects[0].object);
      } else {
        this.deselectObject();
      }
    },
    onKeydown: function(event) {
      switch (event.keyCode) {
        case 81: // Q
          this.control.setSpace(
            this.control.space === "local" ? "world" : "local"
          );
          break;
        case 17: // Ctrl
          this.control.setTranslationSnap(100);
          this.control.setRotationSnap(THREE.Math.degToRad(15));
          break;
        case 87: // W
          this.control.setMode("translate");
          break;
        case 69: // E
          this.control.setMode("rotate");
          break;
        case 82: // R
          this.control.setMode("scale");
          break;
      }
    },
    onKeyup: function(event) {
      switch (event.keyCode) {
        case 17: // Ctrl
          this.control.setTranslationSnap(null);
          this.control.setRotationSnap(null);
          break;
      }
    },
    onDraggingChanged: function(event) {
      this.orbit.enabled = !event.value;
    },
    selectObject: function(object) {
      //vueApp.selectObject = object;
      this.control.attach(object);
    },
    deselectObject: function() {
      this.control.detach();
    },
    getPointer: function(event) {
      let pointer = event.changedTouches ? event.changedTouches[0] : event;
      let rect = this.renderer.domElement.getBoundingClientRect();

      return {
        x: ((pointer.clientX - rect.left) / rect.width) * 2 - 1,
        y: (-(pointer.clientY - rect.top) / rect.height) * 2 + 1,
        button: event.button
      };
    },
    addLED: function(color) {
      let geometry = new THREE.OctahedronBufferGeometry(50, 0);
      let material = new THREE.MeshBasicMaterial({ color: color });
      let mesh = new THREE.Mesh(geometry, material);

      this.scene.add(mesh);
      this.selectObject(mesh);
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keydown", this.onKeydown);
    window.addEventListener("keyup", this.onKeyup);

    this.init();
    //MainLoop.setUpdate(update); // was sendSerial()
    MainLoop.setDraw(this.render).start();
    console.log(this.scene);
    this.$store.state.LEDs.forEach(LED => {
      this.addLED('#009900');
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("keydown", this.onKeydown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
};
</script>

<style scoped lang="scss">
.viewport {
  position: absolute;
  top: 60px;
  left: 50px;
  right: 300px;
  bottom: 30px;
}
</style>
