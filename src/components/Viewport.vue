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
import { mapState } from "vuex";

export default {
  name: "Viewport",
  components: {
    Toolsbar,
    ViewportTools
  },
  data() {
    return {
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
      get: () => document.getElementById("viewport").clientWidth
    },
    height: {
      cache: false,
      get: () => document.getElementById("viewport").clientHeight
    },
    activeTool: function() {
      return this.$store.state.activeTool;
    },
    mode: function() {
      return this.$store.state.mode;
    },
    ...mapState([
      "buffer",
      "selection",
      "scene",
      "renderer",
      "transformControl",
      "transformDummy"
    ])
  },
  watch: {
    activeTool(tool, oldTool) {
      if (["select", "connect", "disconnect"].indexOf(this.activeTool) > -1) {
        this.scene.remove(this.transformControl);
      } else {
        if (this.$store.getters.activeElementsUuids.length) {
          this.scene.add(this.transformControl);
        }
      }

      if (this.activeTool == "move") {
        this.transformControl.setMode("translate");
      } else if (this.activeTool == "scale") {
        this.transformControl.setMode("scale");
      } else if (this.activeTool == "rotate") {
        this.transformControl.setMode("rotate");
      }
    }
  },
  methods: {
    init: function() {
      this.$store.commit("initLights");
      this.$store.commit("initCamera");
      this.$store.commit("initControls");
      this.$store.dispatch("initSelection");
      this.$store.dispatch("initConnection");
      this.$store.commit("initBuffer");
      this.$store.dispatch("applyLEDMaterial");
      this.$store.commit("addBox", {
        position: [0, -250, 0],
        scale: [100, 10, 100]
      });
      this.$store.dispatch("addLED");
      this.$store.commit("setMaxFps", 61);

      this.scene.background = new THREE.Color(0x191919);
      this.raycaster.linePrecision = 10;
      document.getElementById("viewport").appendChild(this.renderer.domElement);
    },
    update: function(delta) {
      this.$store.state.leds.activeMaterial.uniforms.time.value += delta;
      this.buffer.material.uniforms.time.value += delta;
    },
    render: function() {
      this.$store.commit("setFps", MainLoop.getFPS());
      this.selection.outlineComposer.render();
      this.selection.finalComposer.render();

      this.buffer.renderer.setRenderTarget(this.buffer.texture);
      this.buffer.renderer.render(this.buffer.scene, this.buffer.camera);
      this.buffer.renderer.setRenderTarget(null);
      this.buffer.renderer.render(this.buffer.scene, this.buffer.camera);
      this.buffer.renderer.readRenderTargetPixels(
        this.buffer.texture,
        0,
        0,
        this.buffer.width,
        this.buffer.height,
        this.buffer.data
      );
    },
    output: function() {
      let output = [255]; // First byte of each message has to be 255
      let nextLED = this.$store.state.connections.origin.userData.nextLED;
      let outputLength = 0;

      while (nextLED) {
        let index = this.$store.getters.LEDs.indexOf(nextLED);

        output.push(Math.round(this.buffer.data[index*4 + 0] * 254));
        output.push(Math.round(this.buffer.data[index*4 + 2] * 254));
        output.push(Math.round(this.buffer.data[index*4 + 1] * 254));
        outputLength += 3;
        nextLED = nextLED.userData.nextLED;
      }
      output.length = this.buffer.width * this.buffer.height * 3; // set output size to buffer size...
      output.fill(0, outputLength); // ...and fill remaining space with zeros to clear previous colors

      if (this.$store.state.output.activePort) {
        this.$store.state.output.activePort.write(output);
      }
    },
    onResize: function() {
      this.$store.state.camera.aspect = this.width / this.height;
      this.$store.state.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.selection.outlineComposer.setSize(this.width, this.height);
      this.selection.finalComposer.setSize(this.width, this.height);
      this.selection.outlineTarget.setSize(this.width, this.height);
      this.selection.outlineShaderPass.uniforms.resolution.value = {
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
      if (event.target !== this.renderer.domElement) return;

      this.raycaster.setFromCamera(this.upPosition, this.$store.state.camera);

      let intersects = this.raycaster.intersectObjects(
        this.scene.children,
        true
      );

      if (this.$store.state.activeTool == "connect") {
        this.$store.commit("handleConnectClick", {
          intersects,
          pointer: this.upPosition
        });
        return;
      }

      if (this.$store.state.activeTool == "disconnect") {
        this.$store.commit("handleDisconnectClick", intersects);
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
            this.$refs.saveIndicator.classList.add("visible");
            setTimeout(() => {
              this.$refs.saveIndicator.classList.remove("visible");
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
          if (this.$store.state.ctrlPressed) this.$store.dispatch("load");
          break;
        case 78: // n
          if (this.$store.state.ctrlPressed) remote.getCurrentWindow().reload();
          break;
        case 46: // delete
          this.$store.dispatch("deleteActiveElements");
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
          this.transformDummy.position,
          this.lastPosition
        );
        this.selection.selectionGroup.forEach(child => {
          child.position.add(this.positionDelta);
          child.userData.clone.position.add(this.positionDelta);
        });
        this.lastPosition.copy(this.transformDummy.position);
      } else if (this.$store.state.activeTool == "rotate") {
        this.rotationDelta.subVectors(
          this.transformDummy.rotation.toVector3(),
          this.lastRotation
        );
        this.selection.selectionGroup.forEach(child => {
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
        this.lastRotation.copy(this.transformDummy.rotation);
      } else if (this.$store.state.activeTool == "scale") {
        this.scaleDelta.subVectors(this.transformDummy.scale, this.lastScale);
        this.selection.selectionGroup.forEach(child => {
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
        this.lastScale.copy(this.transformDummy.scale);
      }
      this.$store.dispatch(
        "updateLEDConnections",
        this.selection.selectionGroup
      );
    },
    onTransformStart: function(event) {
      this.lastPosition.copy(this.transformDummy.position);
      this.lastRotation.copy(this.transformDummy.rotation);
      this.lastScale.copy(this.transformDummy.scale);
    },
    getPointer: function(event) {
      let pointer = event.changedTouches ? event.changedTouches[0] : event;
      let rect = this.renderer.domElement.getBoundingClientRect();

      return new THREE.Vector2(
        ((pointer.clientX - rect.left) / rect.width) * 2 - 1,
        (-(pointer.clientY - rect.top) / rect.height) * 2 + 1
      );
    },
    attachEventHandlers: function() {
      new ResizeObserver(this.onResize).observe(document.getElementById("viewport"));
      window.addEventListener("keydown", this.onKeydown);
      window.addEventListener("keyup", this.onKeyup);
      this.transformControl.addEventListener("dragging-changed", this.onDraggingChanged);
      this.transformControl.addEventListener("objectChange", this.onObjectChanged);
      this.transformControl.addEventListener("mouseDown", this.onTransformStart);
    }
  },
  mounted() {
    this.init();
    this.attachEventHandlers();
    MainLoop.setUpdate(this.update);
    MainLoop.setDraw(() => {
      this.render();
      this.output();
    }).start();
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
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
  transition: transform 2s ease, opacity 500ms ease;

  &.visible {
    transition: all 0s ease;
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
