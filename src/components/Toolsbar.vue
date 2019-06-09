<template>
  <div class="tools-sidebar">
    <section>
      <button
        v-on:click="setActiveTool('select')"
        v-bind:class="{ active: activeTool == 'select' }"
        class="tool"
        title="Select (Q)"
      >
        <div v-html="iconUtil.load('select')"></div>
        <span class="name">Select</span>
      </button>
      <button
        v-on:click="setActiveTool('move')"
        v-bind:class="{ active: activeTool == 'move' }"
        v-bind:disabled="!$store.getters.canMove"
        class="tool"
        title="Move (W)"
      >
        <div v-html="iconUtil.load('move')"></div>
        <span class="name">Move</span>
      </button>
      <button
        v-on:click="setActiveTool('rotate')"
        v-bind:class="{ active: activeTool == 'rotate' }"
        v-bind:disabled="!$store.getters.canRotate"
        class="tool"
        title="Rotate (E)"
      >
        <div v-html="iconUtil.load('rotate')"></div>
        <span class="name">Rotate</span>
      </button>
      <button
        v-on:click="setActiveTool('scale')"
        v-bind:class="{ active: activeTool == 'scale' }"
        v-bind:disabled="!$store.getters.canScale"
        class="tool"
        title="Scale (R)"
      >
        <div v-html="iconUtil.load('scale')"></div>
        <span class="name">Scale</span>
      </button>
    </section>
    <section>
      <div class="toolgroup">
        <button v-on:click="addLed" class="tool" title="Add LED (A)">
          <div v-html="iconUtil.load('add_led')"></div>
          <span class="name">Add LED</span>
        </button>
        <button v-on:click="addLedRing" class="tool" title="Add LED-Ring">
          <div v-html="iconUtil.load('add_led_ring')"></div>
          <span class="name">Add LED-Ring</span>
        </button>
        <button v-on:click="addLedGrid" class="tool" title="Add LED-Grid">
          <div v-html="iconUtil.load('add_led_grid')"></div>
          <span class="name">Add LED-Grid</span>
        </button>
        <button v-on:click="addLedLine" class="tool" title="Add LED-Line">
          <div v-html="iconUtil.load('add_led_line')"></div>
          <span class="name">Add LED-Line</span>
        </button>
      </div>
      <div class="toolgroup">
        <button v-on:click="addBox" class="tool" title="Add Box (S)">
          <div v-html="iconUtil.load('add_box')"></div>
          <span class="name">Add Box</span>
        </button>
        <button v-on:click="addSphere" class="tool" title="Add Sphere">
          <div v-html="iconUtil.load('add_sphere')"></div>
          <span class="name">Add Sphere</span>
        </button>
        <button v-on:click="addPlane" class="tool" title="Add Plane">
          <div v-html="iconUtil.load('add_plane')"></div>
          <span class="name">Add Plane</span>
        </button>
        <button v-on:click="addCylinder" class="tool" title="Add Cylinder">
          <div v-html="iconUtil.load('add_cylinder')"></div>
          <span class="name">Add Cylinder</span>
        </button>
        <button v-on:click="addCone" class="tool" title="Add Cone">
          <div v-html="iconUtil.load('add_cone')"></div>
          <span class="name">Add Cone</span>
        </button>
        <button v-on:click="addModel" class="tool" title="Add Model">
          <div v-html="iconUtil.load('add_model')"></div>
          <span class="name">Add Model</span>
        </button>
      </div>
      <button v-on:click="addAnimation" class="tool" title="Add Animation (D)">
        <div v-html="iconUtil.load('add_animation')"></div>
        <span class="name">Add Animation</span>
      </button>
      <button v-on:click="addMask" class="tool" title="Add Mask (F)">
        <div v-html="iconUtil.load('add_mask')"></div>
        <span class="name">Add Mask</span>
      </button>
    </section>
    <section>
      <button
        v-on:click="connect"
        v-bind:class="{ active: activeTool == 'connect' }"
        class="tool"
        title="Connect (C)"
      >
        <div v-html="iconUtil.load('connect')"></div>
        <span class="name">Connect</span>
      </button>
      <button
        v-on:click="disconnect"
        v-bind:class="{ active: activeTool == 'disconnect' }"
        class="tool"
        title="Disconnect (V)"
      >
        <div v-html="iconUtil.load('disconnect')"></div>
        <span class="name">Disconnect</span>
      </button>
    </section>
  </div>
</template>

<script>
import iconUtil from "../utils/icon.js";

export default {
  name: "Toolsbar",
  data() {
    return {
      iconUtil: iconUtil
    };
  },
  methods: {
    setActiveTool(tool) {
      this.$store.commit("setActiveTool", tool);
    },
    addLed: function() {
      this.$store.dispatch("addLED");
    },
    addLedRing: function() {
      this.$dialog({
        type: "ledRing",
        store: this.$store
      });
    },
    addLedGrid: function() {
      this.$dialog({
        type: "ledGrid",
        store: this.$store
      });
    },
    addLedLine: function() {
      this.$dialog({
        type: "ledLine",
        store: this.$store
      });
    },
    addBox: function() {
      this.$store.commit("addBox");
    },
    addSphere: function() {
      this.$store.commit("addSphere");
    },
    addPlane: function() {
      this.$store.commit("addPlane");
    },
    addCylinder: function() {
      this.$store.commit("addCylinder");
    },
    addCone: function() {
      this.$store.commit("addCone");
    },
    addModel: function() {
      this.$dialog({
        type: "object",
        store: this.$store
      });
    },
    addAnimation: function() {
      this.$store.dispatch("addAnimation");
    },
    addMask: function() {
      this.$store.dispatch("addMask");
    },
    connect: function() {
      this.setActiveTool("connect");
      this.$store.commit("clearActiveElements");
    },
    disconnect: function() {
      this.setActiveTool("disconnect");
      this.$store.commit("clearActiveElements");
    }
  },
  computed: {
    mode: function() {
      return this.$store.state.mode;
    },
    activeTool: function() {
      return this.$store.state.activeTool;
    }
  }
};
</script>

<style scoped lang="scss">
.tools-sidebar,
section {
  display: flex;
  flex-flow: column;
  margin: 10px 0 0 10px;
}

section {
  margin: 0 0 9px 0;
}

.toolgroup {
  width: 68px;
  overflow: hidden;
  height: 51px;

  &:hover {
    width: auto;
  }
}

.tool {
  width: 68px;
  height: 50px;
  margin-bottom: 1px;
  font-size: 9px;
  padding: 0;
  border: 0;
  background: #424242;
  color: #ffffff;
  position: relative;

  &:hover,
  &:focus,
  &.active {
    background: #424242;
    border: 0;
    outline: 0;
  }

  &:focus {
    color: #ffffff;
  }

  &:hover {
    color: #00ffff;
  }

  &.active {
    color: #00ffff;
  }

  &:disabled {
    color: #888888;
  }

  svg {
    fill: currentColor;
    stroke: currentColor;
  }

  .name {
    position: absolute;
    bottom: 4px;
    left: 0;
    width: 100%;
  }
}
</style>
