<template>
  <div class="properties-sidebar">Properties:
    <br>====
    <br>
    <br>
    <template v-if="this.$store.state.activeObject">
      <NamePanel />
      <PositionPanel />
      <RotationPanel v-if="this.type == 'Object'" />
      <ScalePanel v-if="this.type == 'Object'" />
      <ColorPanel v-if="this.type == 'LED'" />
    </template>
  </div>
</template>

<script>
import NamePanel from "./panels/NamePanel.vue";
import PositionPanel from "./panels/PositionPanel.vue";
import RotationPanel from "./panels/RotationPanel.vue";
import ScalePanel from "./panels/ScalePanel.vue";
import ColorPanel from "./panels/ColorPanel.vue";

export default {
  name: "PropertiesSidebar",
  components: {
    NamePanel,
    PositionPanel,
    RotationPanel,
    ScalePanel,
    ColorPanel
  },
  computed: {
    type: function() {
      return this.$store.state.activeObject.userData.type;
    }
  }
};
</script>

<style lang="scss">
.properties-sidebar {
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: #424242;
  overflow-y: auto;

  input {
    margin-bottom: 20px;
    width: 100%;
  }

  .third {
    width: 33.3333%;
  }
}
</style>
