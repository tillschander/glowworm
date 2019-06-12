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
    }
  },
  watch: {
    activeTool(tool, oldTool) {
      if (["select", "connect", "disconnect"].indexOf(this.activeTool) > -1) {
        this.$store.state.scene.remove(this.$store.state.transformControl);
      } else {
        if (this.$store.getters.activeElementsUuids.length) {
          this.$store.state.scene.add(this.$store.state.transformControl);
        }
      }

      if (this.activeTool == "move") {
        this.$store.state.transformControl.setMode("translate");
      } else if (this.activeTool == "scale") {
        this.$store.state.transformControl.setMode("scale");
      } else if (this.activeTool == "rotate") {
        this.$store.state.transformControl.setMode("rotate");
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

      this.$store.state.scene.background = new THREE.Color(0x191919);
      this.raycaster.linePrecision = 10;
      document
        .getElementById("viewport")
        .appendChild(this.$store.state.renderer.domElement);
    },
    update: function(delta) {
      this.$store.state.leds.activeMaterial.uniforms.time.value += delta;
      this.$store.state.buffer.material.uniforms.time.value += delta;
    },
    render: function() {
      this.$store.commit("setFps", MainLoop.getFPS());
      this.$store.state.selection.outlineComposer.render();
      this.$store.state.selection.finalComposer.render();

      this.$store.state.buffer.renderer.setRenderTarget(
        this.$store.state.buffer.texture
      );
      this.$store.state.buffer.renderer.render(
        this.$store.state.buffer.scene,
        this.$store.state.buffer.camera
      );
      this.$store.state.buffer.renderer.setRenderTarget(null);
      this.$store.state.buffer.renderer.render(
        this.$store.state.buffer.scene,
        this.$store.state.buffer.camera
      );
      this.$store.state.buffer.renderer.readRenderTargetPixels(
        this.$store.state.buffer.texture,
        0,
        0,
        this.$store.state.buffer.width,
        this.$store.state.buffer.height,
        this.$store.state.buffer.data
      );

      let output = new Array(
        this.$store.state.buffer.width * this.$store.state.buffer.height * 3
      );
      let index = 0;

      for (let i = 0; i < this.$store.state.buffer.data.length; i += 4) {
        output[index * 3 + 0] = Math.round(
          this.$store.state.buffer.data[i + 2] * 255
        ); // GREEN
        output[index * 3 + 1] = Math.round(
          this.$store.state.buffer.data[i + 1] * 255
        ); // BLUE
        output[index * 3 + 2] = Math.round(
          this.$store.state.buffer.data[i + 0] * 255
        ); // RED
        index++;
      }
      output = [1].concat(this.$store.state.buffer.data.length, output); // First byte of each message has to be 1

      if (this.$store.state.output.activePort) {
        this.$store.state.output.activePort.write(output);
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
    attachEventHandlers: function() {
      let control = this.$store.state.transformControl;
      let resizeObserver = new ResizeObserver(this.onResize);

      resizeObserver.observe(document.getElementById("viewport"));
      window.addEventListener("keydown", this.onKeydown);
      window.addEventListener("keyup", this.onKeyup);
      control.addEventListener("dragging-changed", this.onDraggingChanged);
      control.addEventListener("objectChange", this.onObjectChanged);
      control.addEventListener("mouseDown", this.onTransformStart);
    }
  },
  mounted() {
    this.init();
    this.attachEventHandlers();
    MainLoop.setUpdate(this.update);
    MainLoop.setDraw(this.render).start();
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
