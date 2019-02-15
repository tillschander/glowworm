<template>
  <div class="properties-sidebar">Properties:
    <br>====
    <br>
    <br>
    <template v-if="this.$store.state.activeObject">
      <template v-if="this.type == 'Animation'">
        <NamePanel/>
        <EffectsPanel/>
      </template>
      <template v-if="this.type == 'LED'">
        <NamePanel/>
        <PositionPanel/>
        <ColorPanel/>
      </template>
      <template v-if="this.type == 'Object'">
        <NamePanel/>
        <PositionPanel/>
        <RotationPanel/>
        <ScalePanel/>
      </template>
      <template v-if="this.type == 'Camera'">
        <PositionPanel/>
        <RotationPanel/>
        <CameraPanel/>
      </template>
    </template>
    <template v-else>Nothing selected</template>
  </div>
</template>

<script>
import NamePanel from "../panels/NamePanel";
import PositionPanel from "../panels/PositionPanel";
import RotationPanel from "../panels/RotationPanel";
import ScalePanel from "../panels/ScalePanel";
import ColorPanel from "../panels/ColorPanel";
import EffectsPanel from "../panels/EffectsPanel";
import CameraPanel from "../panels/CameraPanel";

export default {
  name: "PropertiesSidebar",
  components: {
    NamePanel,
    PositionPanel,
    RotationPanel,
    ScalePanel,
    ColorPanel,
    EffectsPanel,
    CameraPanel
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
