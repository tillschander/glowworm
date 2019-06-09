<template>
  <div @mousedown="onMouseDown" @mouseup="onMouseUp" @mousemove="onMouseMove" id="viewport">
    <Toolsbar class="toolsbar" v-if="this.mode == 'design'"/>
    <ViewportTools class="viewport-tools" v-if="this.mode == 'design'"/>
    <div class="save-indicator" ref="saveIndicator">Saved</div>
  </div>
</template>

<script>
const remote = require("electron").remote;
import MainLoop from "mainloop.js";
import Toolsbar from "./Toolsbar";
import ViewportTools from "./ViewportTools";
import transformUtil from "../utils/transform.js";

export default {
  name: "Viewport",
  components: {
    Toolsbar,
    ViewportTools
  },
  data() {
    return {
      light1: null,
      light2: null,
      control: null,
      downPosition: new THREE.Vector2(),
      upPosition: new THREE.Vector2(),
      raycaster: new THREE.Raycaster(),
      lastPosition: new THREE.Vector3(),
      positionDelta: new THREE.Vector3(),
      lastRotation: new THREE.Vector3(),
      rotationDelta: new THREE.Vector3(),
      lastScale: new THREE.Vector3(),
      scaleDelta: new THREE.Vector3()
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
    activeElements: function() {
      return this.$store.state.activeElements;
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
    activeElements(objects, oldObjects) {
      // Show or hide helpers based on what's selected.
      if (Object.keys(objects).length) {
        if (
          this.activeTool == "move" ||
          this.activeTool == "scale" ||
          this.activeTool == "rotate"
        ) {
          this.$store.state.scene.add(this.$store.state.transformControl);
        } else {
          this.$store.state.scene.remove(this.$store.state.transformControl);
        }
      } else {
        this.$store.state.scene.remove(this.$store.state.transformControl);
      }
    },
    activeTool(tool, oldTool) {
      if (
        this.activeTool == "select" ||
        this.activeTool == "connect" ||
        this.activeTool == "disconnect"
      ) {
        this.$store.state.scene.remove(this.$store.state.transformControl);
      } else {
        this.$store.state.scene.add(this.$store.state.transformControl);
      }

      if (this.activeTool == "move") {
        this.$store.state.transformControl.setMode("translate");
      } else if (this.activeTool == "scale") {
        this.$store.state.transformControl.setMode("scale");
      } else if (this.activeTool == "rotate") {
        this.$store.state.transformControl.setMode("rotate");
      }
    },
    snapToGrid(snapToGrid) {
      if (snapToGrid) {
        this.$store.state.transformControl.setTranslationSnap(5);
        this.$store.state.transformControl.setRotationSnap(
          THREE.Math.degToRad(15)
        );
      } else {
        this.$store.state.transformControl.setTranslationSnap(null);
        this.$store.state.transformControl.setRotationSnap(null);
      }
    }
  },
  methods: {
    init: function() {
      let container = document.getElementById("viewport");

      this.$store.state.scene.background = new THREE.Color(0x191919);

      this.$store.state.camera.aspect = this.width / this.height;
      this.$store.state.camera.position.set(100, 100, 100);
      this.$store.state.camera.lookAt(0, 200, 0);
      this.$store.state.camera.userData.type = "Camera";
      this.$store.state.scene.add(this.$store.state.camera);

      this.$store.state.renderer.setSize(this.width, this.height);
      container.appendChild(this.$store.state.renderer.domElement);
      this.$store.state.bufferRenderer.setRenderTarget(
        this.$store.state.bufferTexture
      );
      //container.appendChild(this.$store.state.bufferRenderer.domElement);

      this.light1 = new THREE.DirectionalLight(0xffffff, 0.7);
      this.light1.position.set(1.2, 1.5, 1.0);
      this.$store.state.scene.add(this.light1);
      this.light2 = new THREE.DirectionalLight(0xffffff, 0.3);
      this.light2.position.set(-1.1, -0.4, -0.9);
      this.$store.state.scene.add(this.light2);

      this.$store.state.orbitControl = new THREE.OrbitControls(
        this.$store.state.camera,
        this.$store.state.renderer.domElement
      );
      this.$store.state.orbitControl.update();

      this.$store.state.transformControl = new THREE.TransformControls(
        this.$store.state.camera,
        this.$store.state.renderer.domElement
      );
      this.$store.state.transformControl.addEventListener(
        "dragging-changed",
        this.onDraggingChanged
      );
      this.$store.state.transformControl.addEventListener(
        "objectChange",
        this.onObjectChanged
      );
      this.$store.state.transformControl.addEventListener(
        "mouseDown",
        this.onTransformStart
      );
      this.$store.state.scene.add(this.$store.state.transformControl);
      this.$store.state.scene.add(this.$store.state.transformDummy);
      this.$store.state.transformControl.attach(
        this.$store.state.transformDummy
      );

      this.raycaster.linePrecision = 10;

      this.$store.dispatch("initSelection");
      this.$store.dispatch("initConnection");

      this.$store.dispatch("applyLEDMaterial");

      this.$store.commit("addBox", {
        position: [0, -250, 0],
        scale: [100, 10, 100]
      });
      this.$store.dispatch("addLED");
    },
    render: function() {
      this.$store.commit("setFps", MainLoop.getFPS());
      this.$store.state.selection.outlineComposer.render();
      this.$store.state.selection.finalComposer.render();

      this.$store.state.bufferRenderer.render(
        this.$store.state.bufferScene,
        this.$store.state.bufferCamera
      );
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
    handleConnectClick: function(intersects) {
      let leds = intersects.filter(
        e =>
          e.object.userData.type == "LED" || e.object.userData.type == "Origin"
      );

      if (leds.length) {
        let led = leds[0].object;

        if (
          this.$store.state.connections.toConnect.length == 1 &&
          led.userData.type == "Origin"
        )
          return;
        this.$store.state.connections.toConnect.push(led);
        this.$store.state.scene.add(this.$store.state.connections.connectArrow);
        this.$store.dispatch("updateConnectArrow", {
          led,
          pointer: this.upPosition
        });
      } else {
        this.$store.state.connections.toConnect = [];
        this.$store.state.scene.remove(
          this.$store.state.connections.connectArrow
        );
      }

      if (this.$store.state.connections.toConnect.length > 1) {
        let LED1 = this.$store.state.connections.toConnect[0];
        let LED2 = this.$store.state.connections.toConnect[1];

        this.$store.dispatch("connectFromTo", { from: LED1, to: LED2 });
        this.$store.state.connections.toConnect = [];
        this.$store.state.scene.remove(
          this.$store.state.connections.connectArrow
        );
      }
    },
    handleDisconnectClick: function(intersects) {
      let arrows = intersects.filter(
        entry => entry.object.parent.userData.type == "Arrow"
      );
      if (arrows.length) {
        this.$store.dispatch("removeConnection", arrows[0].object.parent);
      }
    },
    onResize: function() {
      this.$store.state.camera.aspect = this.width / this.height;
      this.$store.state.camera.updateProjectionMatrix();
      this.$store.state.renderer.setSize(this.width, this.height);
      this.$store.state.selection.outlineComposer.setSize(
        this.width,
        this.height
      );
      this.$store.state.selection.finalComposer.setSize(
        this.width,
        this.height
      );
      this.$store.state.selection.outlineTarget.setSize(
        this.width,
        this.height
      );
      this.$store.state.selection.outlineShaderPass.uniforms.resolution.value = {
        x: this.width,
        y: this.height
      };
    },
    onMouseDown: function(event) {
      this.downPosition = this.getPointer(event);
    },
    onMouseUp: function(event) {
      this.upPosition = this.getPointer(event);

      if (this.$store.state.mode !== "design") return;
      if (this.downPosition.distanceTo(this.upPosition) !== 0) return;
      if (event.target !== this.$store.state.renderer.domElement) return;

      this.raycaster.setFromCamera(this.upPosition, this.$store.state.camera);

      let intersects = this.raycaster.intersectObjects(
        this.$store.state.scene.children,
        true
      );

      if (this.$store.state.activeTool == "connect") {
        this.handleConnectClick(intersects);
        return;
      }

      if (this.$store.state.activeTool == "disconnect") {
        this.handleDisconnectClick(intersects);
        return;
      }

      intersects = intersects.filter(intersect => {
        return ["LED", "Object", "Group", "Origin"].includes(
          intersect.object.userData.type
        );
      });

      if (intersects.length > 0) {
        let object = intersects[0].object;
        let type = object.userData.type;

        if (object.parent.type == "Group") {
          object = object.parent;
          type = "Group";
        }

        if (!this.$store.state.ctrlPressed) {
          this.$store.dispatch("emptySelectionGroup");
          this.$store.commit("clearActiveElements");
        }

        this.$store.commit("addActiveElement", object.uuid);
      } else {
        this.$store.dispatch("emptySelectionGroup");
        this.$store.commit("clearActiveElements");
      }
    },
    onMouseMove: function(event) {
      if (this.$store.state.activeTool == "connect") {
        if (this.$store.state.connections.toConnect.length == 1) {
          let pointer = this.getPointer(event);
          let led = this.$store.state.connections.toConnect[0];
          this.$store.dispatch("updateConnectArrow", { led, pointer });
        }
      }
      /*
      this.raycaster.setFromCamera(
        this.getPointer(event),
        this.$store.state.camera
      );
      this.intersects = this.raycaster.intersectObject(this.$store.state.line);
      if (this.intersects.length === 0) {
        if (this.oldIndex !== -1) this.restoreColor();
        this.oldIndex = -1;
      } else {
        let idx = this.intersects[0].index;
        if (idx !== this.oldIndex) this.highlightSegment(idx);
      }
      */
    },
    onKeydown: function(event) {
      if (event.target.type == "text") return;
      if (this.$store.state.mode !== "design") return;

      switch (event.keyCode) {
        case 81: // q
          if (this.$store.state.ctrlPressed) {
            remote.getCurrentWindow().close();
          } else {
            this.$store.commit("setActiveTool", "select");
          }
          break;
        case 87: // w
          this.$store.commit("setActiveTool", "move");
          break;
        case 69: // e
          this.$store.commit("setActiveTool", "rotate");
          break;
        case 82: // r
          this.$store.commit("setActiveTool", "scale");
          break;
        case 65: // a
          this.$store.dispatch("addLED");
          break;
        case 83: // s
          if (this.$store.state.ctrlPressed) {
            this.$store.dispatch("save");
            this.$refs.saveIndicator.classList.add('visible');
            setTimeout(() => {
              this.$refs.saveIndicator.classList.remove('visible');
            }, 20);
          } else {
            this.$store.commit("addBox");
          }
          break;
        case 68: // d
          this.$store.dispatch("addAnimation");
          break;
        case 70: // f
          this.$store.dispatch("addMask");
          break;
        case 67: // c
          this.$store.commit("setActiveTool", "connect");
          this.$store.commit("clearActiveElements");
          break;
        case 86: // v
          this.$store.commit("setActiveTool", "disconnect");
          this.$store.commit("clearActiveElements");
          break;
        case 76: // l
          if (this.$store.state.ctrlPressed) this.$store.dispatch('load');
          break;
        case 78: // n
          if (this.$store.state.ctrlPressed) remote.getCurrentWindow().reload();
          break;
        case 46: // delete
          this.$store.commit("deleteActiveElements");
          break;
        case 17: // ctrl
          this.$store.commit("setCtrlPressed", true);
          break;
      }
    },
    onKeyup: function(event) {
      switch (event.keyCode) {
        case 17: // Ctrl
          this.$store.commit("setCtrlPressed", false);
          break;
      }
    },
    onDraggingChanged: function(event) {
      this.$store.state.orbitControl.enabled = !event.value;
    },
    onObjectChanged: function(event) {
      if (this.$store.state.activeTool == "move") {
        this.positionDelta.subVectors(
          this.$store.state.transformDummy.position,
          this.lastPosition
        );
        this.$store.state.selection.selectionGroup.forEach(child => {
          child.position.add(this.positionDelta);
          child.userData.clone.position.add(this.positionDelta);
        });
        this.lastPosition.copy(this.$store.state.transformDummy.position);
      } else if (this.$store.state.activeTool == "rotate") {
        this.rotationDelta.subVectors(
          this.$store.state.transformDummy.rotation.toVector3(),
          this.lastRotation
        );
        this.$store.state.selection.selectionGroup.forEach(child => {
          if (child.userData.type !== "LED") {
            child.rotation.set(
              child.rotation.x + this.rotationDelta.x,
              child.rotation.y + this.rotationDelta.y,
              child.rotation.z + this.rotationDelta.z
            );
            child.userData.clone.rotation.set(
              child.rotation.x + this.rotationDelta.x,
              child.rotation.y + this.rotationDelta.y,
              child.rotation.z + this.rotationDelta.z
            );
          }
        });
        this.lastRotation.copy(this.$store.state.transformDummy.rotation);
      } else if (this.$store.state.activeTool == "scale") {
        this.scaleDelta.subVectors(
          this.$store.state.transformDummy.scale,
          this.lastScale
        );
        this.$store.state.selection.selectionGroup.forEach(child => {
          if (child.userData.type !== "LED") {
            child.scale.add(this.scaleDelta);
            child.userData.clone.scale.add(this.scaleDelta);
          }
          if (child.userData.groupType == "LED") {
            for (let i = 0; i < child.children.length; i++) {
              if (child.userData.clone.scale.x !== 1)
                child.userData.clone.children[i].scale.setX(
                  1 / child.userData.clone.scale.x
                );
              if (child.userData.clone.scale.y !== 1)
                child.userData.clone.children[i].scale.setY(
                  1 / child.userData.clone.scale.y
                );
              if (child.userData.clone.scale.z !== 1)
                child.userData.clone.children[i].scale.setZ(
                  1 / child.userData.clone.scale.z
                );
            }
          }
        });
        this.lastScale.copy(this.$store.state.transformDummy.scale);
      }
      this.$store.dispatch(
        "updateLEDConnections",
        this.$store.state.selection.selectionGroup
      );
    },
    onTransformStart: function(event) {
      this.lastPosition.copy(this.$store.state.transformDummy.position);
      this.lastRotation.copy(this.$store.state.transformDummy.rotation);
      this.lastScale.copy(this.$store.state.transformDummy.scale);
    },
    getPointer: function(event) {
      let pointer = event.changedTouches ? event.changedTouches[0] : event;
      let rect = this.$store.state.renderer.domElement.getBoundingClientRect();

      return new THREE.Vector2(
        ((pointer.clientX - rect.left) / rect.width) * 2 - 1,
        (-(pointer.clientY - rect.top) / rect.height) * 2 + 1
      );
    },
    update: function(delta) {
      this.$store.state.leds.activeMaterial.uniforms.time.value += delta;
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

.save-indicator {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 100;
  font-size: 5em;
  background: #333;
  padding: 0.25em;
  opacity: 0;
  transform: translate(-50%,-50%) scale(0);
  pointer-events: none;
  transition: transform 2s ease, opacity 500ms ease;

  &.visible {
    transition: all 0s ease;
    opacity: 1;
    transform: translate(-50%,-50%) scale(1);
  }
}
</style>
