<template>
  <div @mouseup="onMouseup" id="viewport" class="viewport"></div>
</template>

<script>
import MainLoop from "mainloop.js";
//import * as THREE from "three";
const THREE = require("three");
const OrbitControls = require("../assets/js/OrbitControls.js")(THREE);
const TransformControls = require("../assets/js/TransformControls.js")(THREE);

export default {
  name: "Viewport",
  data() {
    return {
      camera: null,
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
    },
    activeObject: function() {
      return this.$store.state.activeObject;
    }
  },
  watch: {
    maxFps(newMaxFps) {
      MainLoop.setMaxAllowedFPS(newMaxFps);
    },
    activeObject(object) {
      this.control.attach(object);
    }
  },
  methods: {
    init: function() {
      let container = document.getElementById("viewport");
      let aspect = this.width / this.height;

      this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 3000);
      this.camera.position.set(1000, 500, 1000);
      this.camera.lookAt(0, 200, 0);

      this.$store.state.scene.add(new THREE.GridHelper(1000, 10));

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      container.appendChild(this.renderer.domElement);

      this.light = new THREE.DirectionalLight(0xffffff, 2);
      this.light.position.set(1, 1, 1);
      this.$store.state.scene.add(this.light);

      this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
      this.orbit.update();

      this.control = new TransformControls(
        this.camera,
        this.renderer.domElement
      );
      this.control.addEventListener("dragging-changed", this.onDraggingChanged);
      this.control.addEventListener("objectChange", this.onObjectChanged);
      this.$store.state.scene.add(this.control);

      // TODO cleanup
      this.$store.state.lineGeometry.addAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(this.$store.state.maxConnections * 3), 3)
      );
      this.$store.state.lineGeometry.setDrawRange(
        0,
        this.$store.state.lineConnections.length
      );
      this.$store.state.line = new THREE.Line(
        this.$store.state.lineGeometry,
        new THREE.LineBasicMaterial({color: 0xff0000})
      );
      this.$store.state.scene.add(this.$store.state.line);
    },
    render: function() {
      this.$store.commit("setFps", MainLoop.getFPS());
      this.renderer.render(this.$store.state.scene, this.camera);
    },
    onResize: function() {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    },
    onMouseup: function(event) {
      let raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(this.getPointer(event), this.camera);

      let intersects = raycaster.intersectObjects(
        this.$store.state.scene.children
      );

      if (intersects.length > 0) {
        this.$store.commit("setActiveObject", intersects[0].object);
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
    onObjectChanged: function(event) {
      let obj = event.target.object;
      let position = [obj.position.x, obj.position.y, obj.position.z];
      let color = [
        obj.material.color.r,
        obj.material.color.g,
        obj.material.color.b
      ];

      this.$store.commit("updateLED", { uuid: obj.uuid, color, position });
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
    update: function(delta) {
      /*
      vueApp.leds = vueApp.leds.map(led => [led[0] + delta/4, 0, 0]);
      let output = [1].concat(vueApp.leds.reduce((acc, val) => acc.concat(val), [])); // Flat arr with 1 at the beginning
      if (port != undefined) {
          port.write(Buffer.from(output));
      }
      */

      // TODO move inside mainloop
      //console.log(this.$store.state.activeObject.material.color.r);
      if (this.$store.state.activePort && this.$store.state.activeObject) {
        this.$store.state.activePort.write(
          Buffer.from([
            1,
            this.$store.state.activeObject.material.color.g * 255,
            this.$store.state.activeObject.material.color.r * 255,
            this.$store.state.activeObject.material.color.b * 255,
            this.$store.state.activeObject.material.color.g * 255,
            this.$store.state.activeObject.material.color.r * 255,
            this.$store.state.activeObject.material.color.b * 255,
            this.$store.state.activeObject.material.color.g * 255,
            this.$store.state.activeObject.material.color.r * 255,
            this.$store.state.activeObject.material.color.b * 255
          ])
        );
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keydown", this.onKeydown);
    window.addEventListener("keyup", this.onKeyup);

    this.init();
    MainLoop.setUpdate(this.update);
    MainLoop.setDraw(this.render).start();
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
