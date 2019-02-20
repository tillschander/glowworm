<template>
  <div @mousedown="onMouseDown" @mouseup="onMouseUp" id="viewport">
    <Toolsbar class="toolsbar" v-if="this.mode == 'design'"/>
    <ViewportTools class="viewport-tools" v-if="this.mode == 'design'"/>
  </div>
</template>

<script>
import MainLoop from "mainloop.js";
import Toolsbar from "./Toolsbar";
import ViewportTools from "./ViewportTools";
//import * as THREE from "three";
const THREE = require("three");
const OrbitControls = require("../assets/js/OrbitControls.js")(THREE);
const TransformControls = require("../assets/js/TransformControls.js")(THREE);

export default {
  name: "Viewport",
  components: {
    Toolsbar,
    ViewportTools
  },
  data() {
    return {
      renderer: null,
      light1: null,
      light2: null,
      orbit: null,
      control: null,
      downPosition: new THREE.Vector2(),
      upPosition: new THREE.Vector2()
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
    },
    activeTool: function() {
      return this.$store.state.activeTool;
    },
    snapToGrid: function() {
      return this.$store.state.snapToGrid;
    },
    mode: function() {
      return this.$store.state.mode;
    }
  },
  watch: {
    maxFps(newMaxFps) {
      MainLoop.setMaxAllowedFPS(newMaxFps);
    },
    activeObject(object) {
      if (object) {
        if (object.userData.type == "Animation") {
          this.$store.state.scene.remove(this.highlighter);
          this.$store.state.scene.remove(this.control);
          this.$store.commit("applyLEDMaterial");
        } else {
          this.$store.state.scene.add(this.highlighter);
          this.highlighter.setFromObject(object);

          if (this.activeTool !== "select") {
            this.$store.state.scene.add(this.control);
            this.control.attach(object);
          }
        }
      } else {
        this.$store.state.scene.remove(this.highlighter);
        this.$store.state.scene.remove(this.control);
      }
    },
    activeTool(tool) {
      if (this.activeTool == "select") {
        this.$store.state.scene.remove(this.control);
      } else {
        if (
          this.activeObject &&
          this.activeObject.userData.type !== "Animation"
        ) {
          this.$store.state.scene.add(this.control);
          this.control.attach(this.activeObject);
        }

        if (this.activeTool == "move") {
          this.control.setMode("translate");
        } else if (this.activeTool == "scale") {
          this.control.setMode("scale");
        } else if (this.activeTool == "rotate") {
          this.control.setMode("rotate");
        }
      }
    },
    snapToGrid(snapToGrid) {
      if (snapToGrid) {
        this.control.setTranslationSnap(5);
        this.control.setRotationSnap(THREE.Math.degToRad(15));
      } else {
        this.control.setTranslationSnap(null);
        this.control.setRotationSnap(null);
      }
    }
  },
  methods: {
    init: function() {
      let container = document.getElementById("viewport");

      this.$store.state.camera.aspect = this.width / this.height;
      this.$store.state.camera.position.set(100, 100, 100);
      this.$store.state.camera.lookAt(0, 200, 0);
      this.$store.state.camera.userData.type = "Camera";
      this.$store.state.scene.add(this.$store.state.camera);

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      container.appendChild(this.renderer.domElement);

      this.light1 = new THREE.DirectionalLight(0xffffff, 0.7);
      this.light1.position.set(1.2, 1.5, 1.0);
      this.$store.state.scene.add(this.light1);
      this.light2 = new THREE.DirectionalLight(0xffffff, 0.3);
      this.light2.position.set(-1.1, -0.4, -0.9);
      this.$store.state.scene.add(this.light2);

      this.highlighter = new THREE.BoxHelper(undefined, 0x00ffff);
      this.$store.state.scene.add(this.highlighter);

      this.orbit = new OrbitControls(
        this.$store.state.camera,
        this.renderer.domElement
      );
      this.orbit.update();

      this.control = new TransformControls(
        this.$store.state.camera,
        this.renderer.domElement
      );
      this.control.addEventListener("dragging-changed", this.onDraggingChanged);
      this.control.addEventListener("objectChange", this.onObjectChanged);
      this.$store.state.scene.add(this.control);

      // TODO cleanup
      this.$store.state.lineGeometry.addAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array(this.$store.state.maxConnections * 3),
          3
        )
      );
      this.$store.state.lineGeometry.setDrawRange(
        0,
        this.$store.state.lineConnections.length
      );
      this.$store.state.line = new THREE.Line(
        this.$store.state.lineGeometry,
        new THREE.LineBasicMaterial({ color: 0xff0000 })
      );
      this.$store.state.scene.add(this.$store.state.line);

      this.$store.commit("applyLEDMaterial");
      this.$store.commit("addBox", {
        size: [1000, 10, 1000],
        position: [0, -250, 0]
      });
      this.$store.commit("addLED");
      this.$store.commit("toggleSnapToGrid");
    },
    render: function() {
      this.$store.commit("setFps", MainLoop.getFPS());
      this.renderer.render(this.$store.state.scene, this.$store.state.camera);

      /*
      for (let [uuid, data] of Object.entries(this.$store.state.LEDs)) {
        let index = this.$store.state.lineConnections.indexOf(uuid);
        let r = ("" + Math.round(data.color[0] * 255)).padStart(3, "0");
        let g = ("" + Math.round(data.color[1] * 255)).padStart(3, "0");
        let b = ("" + Math.round(data.color[2] * 255)).padStart(3, "0");
        let string = "pixel," + r + g + b + index + "\n";
        this.$store.state.activePort.write(Buffer.from(string, "utf8"));
      }
      */
    },
    onResize: function() {
      this.$store.state.camera.aspect = this.width / this.height;
      this.$store.state.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    },
    onMouseDown: function(event) {
      this.downPosition = this.getPointer(event);
    },
    onMouseUp: function(event) {
      this.upPosition = this.getPointer(event);

      if (this.downPosition.distanceTo(this.upPosition) !== 0) return;

      if (event.target !== this.renderer.domElement) return;

      let raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(this.getPointer(event), this.$store.state.camera);

      let intersects = raycaster.intersectObjects(
        this.$store.state.scene.children
      );

      if (intersects.length > 0) {
        let type = intersects[0].object.userData.type;

        if (type == "LED" || type == "Object") {
          this.$store.commit("setActiveObject", intersects[0].object);
        }
      } else {
        this.$store.commit("setActiveObject", undefined);
      }
    },
    onKeydown: function(event) {
      switch (event.keyCode) {
        case 81: // Q
          this.$store.commit("setActiveTool", "select");
          break;
        case 87: // W
          this.$store.commit("setActiveTool", "move");
          break;
        case 69: // E
          this.$store.commit("setActiveTool", "rotate");
          break;
        case 82: // R
          this.$store.commit("setActiveTool", "scale");
          break;
        case 65: // A
          this.$store.commit("addLED");
          break;
        case 83: // S
          this.$store.commit("addBox");
          break;
        case 68: // D
          this.$store.commit("addAnimation");
          break;
        case 46: // Delete
          if (this.activeObject)
            this.$store.commit("deleteObject", this.activeObject);
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

      this.$store.commit("updateObject", { uuid: obj.uuid, position });
    },
    getPointer: function(event) {
      let pointer = event.changedTouches ? event.changedTouches[0] : event;
      let rect = this.renderer.domElement.getBoundingClientRect();

      return new THREE.Vector2(
        ((pointer.clientX - rect.left) / rect.width) * 2 - 1,
        (-(pointer.clientY - rect.top) / rect.height) * 2 + 1
      );
    },
    update: function(delta) {
      this.highlighter.update();
      this.$store.state.activeLEDMaterial.uniforms.time.value += delta;
    }
  },
  mounted() {
    var ro = new ResizeObserver(this.onResize);

    ro.observe(document.getElementById("viewport"));
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
#viewport {
  overflow: hidden;
  height: 100%;
  position: relative;
}

.toolsbar {
  position: absolute;
  top: 0;
  left: 0;
}

.viewport-tools {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
