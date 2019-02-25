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

export default {
  name: "BaseDialog",
  components: {
    LedRingDialog,
    LedGridDialog,
    LedLineDialog,
    EffectsDialog,
    ObjectDialog
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
</style>