<template>
  <div class="dialog">
    <div class="dialog-backdrop"></div>
    <div class="dialog-container">
      <div class="dialog-content">
        <component v-bind:is="content" v-bind:$store="store"></component>
      </div>
    </div>
  </div>
</template>

<script>
import LedRingDialog from "./LedRingDialog";
import LedGridDialog from "./LedGridDialog";
import LedLineDialog from "./LedLineDialog";
import EffectsDialog from "./EffectsDialog";
import ObjectDialog from "./ObjectDialog";
import OutputDialog from "./OutputDialog";

export default {
  name: "BaseDialog",
  components: {
    LedRingDialog,
    LedGridDialog,
    LedLineDialog,
    EffectsDialog,
    ObjectDialog,
    OutputDialog
  },
  props: ["type", "callback", "store"],
  computed: {
    content: function() {
      switch (this.type) {
        case "ledRing":
          return LedRingDialog;
          break;
        case "ledGrid":
          return LedGridDialog;
          break;
        case "ledLine":
          return LedLineDialog;
          break;
        case "effects":
          return EffectsDialog;
          break;
        case "object":
          return ObjectDialog;
          break;
        case "output":
          return OutputDialog;
          break;
        default:
          return "";
          break;
      }
    }
  },
  methods: {
    close: function() {
      this.$emit('destroy');
    },
    continue: function(options) {
      this.callback(options);
      this.close();
    }
  }
};
</script>

<style lang="scss">
.dialog-backdrop {
    box-shadow: inset 0 0 200px 20px rgba(0, 0, 0, 0.75);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5000;
}

.dialog-container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5001;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog-content {
    max-width: 400px;
    padding: 15px;
    background-color: #424242;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3), 0 3px 10px rgba(0, 0, 0, 0.5);
    color: #ffffff;
}
</style>