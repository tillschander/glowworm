<template>
  <div class="properties-sidebar">Properties:
    <br>====
    <br>
    <br>
    <template v-if="this.activeObjectsCount == 1">
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
      <template v-if="this.type == 'Group'">
        <NamePanel/>
        <button v-on:click="ungroup">Ungroup</button>
      </template>
    </template>
    <template v-else-if="this.activeObjectsCount > 1">
      {{ this.activeObjectsCount }} selected
      <br>
      <br>
      <button v-on:click="group">Group</button>
    </template>
    <template v-else>Nothing selected</template>
  </div>
</template>

<script>
import Vue from 'vue';
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
    uuid: function() {
      return Object.keys(this.$store.state.activeObjects)[0];
    },
    object: function() {
      return this.$store.state.scene.getObjectByProperty("uuid", this.uuid);
    },
    type: function() {
      return this.object.userData.type;
    },
    threeType: function() {
      return this.object.geometry.type;
    },
    activeObjectsCount: function() {
      return Object.keys(this.$store.state.activeObjects).length;
    }
  },
  methods: {
    group: function() {
      let newGroup = this.$store.state.selectionGroup.clone();
      this.$store.commit("deleteActiveObjects");
      this.$store.commit("addGroup", {group: newGroup, name: 'Group'});
    },
    ungroup: function() {
      let children = this.object.children;

      for (var i = children.length - 1; i >= 0; i--) {
        let child = children[i];

        child.applyMatrix(this.object.matrixWorld);
        this.object.remove(child);
        this.$store.state.scene.add(child);

        if (child.userData.type == 'LED') {
          Vue.set(this.$store.state.LEDs, child.uuid, {
            position: [child.position.x, child.position.y, child.position.z]
          });
        } else {
          this.$store.state.objects.push({
            uuid: child.uuid,
            position: [child.position.x, child.position.y, child.position.z]
          });
        }
      }

      this.$store.commit("deleteObject", this.object);
      this.$store.commit("emptySelectionGroup");
      this.$store.commit("clearActiveObjects");
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
