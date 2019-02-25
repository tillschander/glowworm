<template>
  <div class="properties-sidebar">Properties:
    <br>====
    <br>
    <br>
    <template v-if="this.$store.state.activeObject">
      <template v-if="this.type == 'Animation'">
        <NamePanel/>
        <AnimationPanel/>
      </template>
      <template v-if="this.type == 'LED'">
        <NamePanel/>
        <PositionPanel/>
      </template>
      <template v-if="this.type == 'Object'">
        <NamePanel/>
        <PositionPanel/>
        <RotationPanel/>
        <ScalePanel/>
        <TexturePanel v-if="this.threeType == 'PlaneBufferGeometry'"/>
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
import AnimationPanel from "../panels/AnimationPanel";
import CameraPanel from "../panels/CameraPanel";
import TexturePanel from "../panels/TexturePanel";

export default {
  name: "PropertiesSidebar",
  components: {
    NamePanel,
    PositionPanel,
    RotationPanel,
    ScalePanel,
    AnimationPanel,
    CameraPanel,
    TexturePanel
  },
  computed: {
    type: function() {
      return this.$store.state.activeObject.userData.type;
    },
    threeType: function() {
      return this.$store.state.activeObject.geometry.type;
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
