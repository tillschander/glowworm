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
      upPosition: new THREE.Vector2(),
      selectionGroup: new THREE.Group(),
      highlighter: new THREE.BoxHelper(undefined, 0x00ffff)
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
    activeObjects: function() {
      return this.$store.state.activeObjects;
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
    activeObjects(objects, oldObjects) {
      // Clear the selection group...
      this.emptySelectionGroup();

      // ...and refill it.
      Object.keys(objects).forEach(uuid => {
        this.selectionGroup.add(
          this.$store.state.scene.getObjectByProperty("uuid", uuid)
        );
      });

      // Move the selection group and its children so that
      // the origin of the selection group is it's center.
      // We do this so that the control helper is positioned correctly.
      let offset = new THREE.Vector3();
      this.$store.state.scene.add(this.highlighter);
      this.highlighter.setFromObject(this.selectionGroup);
      this.highlighter.geometry.computeBoundingBox();
      this.highlighter.geometry.boundingBox.getCenter(offset);
      this.selectionGroup.applyMatrix(
        new THREE.Matrix4().makeTranslation(offset.x, offset.y, offset.z)
      );
      this.selectionGroup.children.forEach(child => {
        child.applyMatrix(
          new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z)
        );
      });

      // Show or hide helpers based on what's selected.
      if (Object.keys(objects).length) {
        if (this.selectionGroup.children[0].userData.type == "Animation") {
          this.$store.state.scene.remove(this.highlighter);
          this.$store.state.scene.remove(this.control);
          this.$store.commit("applyLEDMaterial");
        } else if (this.activeTool !== "select") {
          this.$store.state.scene.add(this.control);
          this.control.attach(this.selectionGroup);
        }
      } else {
        this.$store.state.scene.remove(this.highlighter);
        this.$store.state.scene.remove(this.control);
      }
    },
    activeTool(tool) {
      if (this.selectionGroup.children[0].userData.type !== "Animation") {
        this.$store.state.scene.add(this.control);
        this.control.attach(this.selectionGroup);
      }

      if (this.activeTool == "select") {
        this.$store.state.scene.remove(this.control);
      } else if (this.activeTool == "move") {
        this.control.setMode("translate");
      } else if (this.activeTool == "scale") {
        this.control.setMode("scale");
      } else if (this.activeTool == "rotate") {
        this.control.setMode("rotate");
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

      this.selectionGroup.userData.type = "Group";
      this.$store.state.scene.add(this.selectionGroup);

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

      this.$store.state.bufferRenderer.render(
        this.$store.state.bufferScene,
        this.$store.state.bufferCamera,
        this.$store.state.bufferTexture,
        true
      );
      /*
      this.$store.state.bufferRenderer.render(
        this.$store.state.bufferScene,
        this.$store.state.bufferCamera
      );
      */
      this.$store.state.bufferRenderer.readRenderTargetPixels(
        this.$store.state.bufferTexture,
        0,
        0,
        this.$store.state.bufferWidth,
        this.$store.state.bufferHeight,
        this.$store.state.buffer
      );

      let buffer = this.$store.state.buffer;
      let output = new Array(
        this.$store.state.bufferWidth * this.$store.state.bufferHeight * 3
      );
      let index = 0;

      for (let i = 0; i < buffer.length; i += 4) {
        // Glediator output is GRB
        output[index * 3] = Math.round(buffer[i + 1] * 255);
        output[index * 3 + 1] = Math.round(buffer[i] * 255);
        output[index * 3 + 2] = Math.round(buffer[i + 2] * 255);
        index++;
      }
      output = [1].concat(output);

      if (this.$store.state.activePort) {
        this.$store.state.activePort.write(output);
      }
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
          if (!this.$store.state.shiftPressed) {
            this.emptySelectionGroup();
            this.$store.commit("clearActiveObjects");
          }
          this.$store.commit("addActiveObject", intersects[0].object.uuid);
        }
      } else {
        this.emptySelectionGroup();
        this.$store.commit("clearActiveObjects");
      }
    },
    onKeydown: function(event) {
      if (event.target.type == "text") return;

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
          this.emptySelectionGroup();
          for (const uuid in this.activeObjects) {
            this.$store.commit(
              "deleteObject",
              this.$store.state.scene.getObjectByProperty("uuid", uuid)
            );
          }
          this.$store.commit("clearActiveObjects");
          break;
        case 16: // Shift
          this.$store.commit("setShiftPressed", true);
          break;
      }
    },
    onKeyup: function(event) {
      switch (event.keyCode) {
        case 17: // Ctrl
          this.control.setTranslationSnap(null);
          this.control.setRotationSnap(null);
          break;
        case 16: // Shift
          this.$store.commit("setShiftPressed", false);
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
      this.$store.state.bufferMaterial.uniforms.time.value += delta;
    },
    initBuffer: function() {
      this.$store.state.bufferCamera = new THREE.OrthographicCamera(
        this.$store.state.bufferWidth / -2,
        this.$store.state.bufferWidth / 2,
        this.$store.state.bufferHeight / 2,
        this.$store.state.bufferHeight / -2,
        -1,
        1
      );

      this.$store.state.bufferRenderer.setSize(128, 128);
      document
        .querySelector("body")
        .appendChild(this.$store.state.bufferRenderer.domElement);

      this.$store.state.bufferTexture = new THREE.WebGLRenderTarget(
        this.$store.state.bufferWidth,
        this.$store.state.bufferHeight,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          type: THREE.FloatType
        }
      );

      var bufferLength =
        this.$store.state.bufferWidth * this.$store.state.bufferHeight;
      var indices = Float32Array.from({ length: bufferLength }, (v, k) => k);
      var positions = new Float32Array(bufferLength * 3);

      this.$store.state.buffer = new Float32Array(4 * bufferLength);

      this.$store.state.bufferGeometry = new THREE.PlaneBufferGeometry(
        this.$store.state.bufferWidth - 1,
        this.$store.state.bufferHeight - 1,
        this.$store.state.bufferWidth - 1,
        this.$store.state.bufferHeight - 1
      );
      this.$store.state.bufferGeometry.addAttribute(
        "LEDIndex",
        new THREE.BufferAttribute(indices, 1)
      );
      this.$store.state.bufferGeometry.addAttribute(
        "LEDPosition",
        new THREE.BufferAttribute(positions, 3)
      );

      this.$store.state.bufferObject = new THREE.Points(
        this.$store.state.bufferGeometry,
        this.$store.state.bufferMaterial
      );
      this.$store.state.bufferScene.add(this.$store.state.bufferObject);
    },
    emptySelectionGroup: function() {
      let group = this.selectionGroup.children;

      for (var i = group.length - 1; i >= 0; i--) {
        let child = group[i];

        child.applyMatrix(this.selectionGroup.matrixWorld);
        this.selectionGroup.remove(child);
        this.$store.state.scene.add(child);
      }

      this.$store.commit("updateObject", {
        uuid: this.selectionGroup.uuid,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      });
    }
  },
  mounted() {
    var ro = new ResizeObserver(this.onResize);

    ro.observe(document.getElementById("viewport"));
    window.addEventListener("keydown", this.onKeydown);
    window.addEventListener("keyup", this.onKeyup);

    this.init();
    this.initBuffer();
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
