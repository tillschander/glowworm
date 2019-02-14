<template>
  <div class="dialog">
    <div class="dialog-backdrop"></div>
    <div class="dialog-container">
      <div class="dialog-content">
        <component v-bind:is="content"></component>
      </div>
    </div>
  </div>
</template>

<script>
import LedRingDialog from "./LedRingDialog.vue";
import EffectsDialog from "./EffectsDialog.vue";

export default {
  name: "BaseDialog",
  components: {
    LedRingDialog,
    EffectsDialog
  },
  props: ["type", "callback"],
  computed: {
    content: function() {
      if (this.type == "ledRing") {
        return LedRingDialog;
      } else if (this.type == "effects") {
        return EffectsDialog;
      } else {
        return "";
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