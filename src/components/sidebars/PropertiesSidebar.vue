<template>
  <div class="properties-sidebar">Properties:
    <br>====
    <br>
    <br>
    <template v-if="this.activeCount == 1">
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
        <PositionPanel/>
        <RotationPanel/>
        <button v-on:click="ungroup">Ungroup</button>
      </template>
    </template>
    <template v-else-if="this.activeCount > 1">
      <PositionPanel/>
      <RotationPanel/>
      <div v-if="this.activeLEDs.length > 0">
        {{ this.activeLEDs.length }} LEDs selected
      </div>
      <div v-if="this.activeObjects.length > 0">
        {{ this.activeObjects.length }} Objects selected
      </div>
      <div v-if="this.activeGroups.length > 0">
        {{ this.activeGroups.length }} Groups selected
      </div>
      <br>
      <template v-if="this.activeLEDs.length == 0 || this.activeObjects.length == 0 ">
        <button v-on:click="group">Group</button>
      </template>
      <template v-else>
        <button disabled>Group</button>
      </template>
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
    activeCount: function() {
      return Object.keys(this.$store.state.activeObjects).length;
    },
    activeLEDs: function() {
      return this.$store.state.selectionGroup.children.filter(child => child.userData.type == 'LED');
    },
    activeObjects: function() {
      return this.$store.state.selectionGroup.children.filter(child => child.userData.type == 'Object');
    },
    activeGroups: function() {
      return this.$store.state.selectionGroup.children.filter(child => child.userData.type == 'Group');
    },
    canGroup: function() {
      if (false) {
        
      }
    }
  },
  methods: {
    group: function() {
      let newGroup = this.$store.state.selectionGroup.clone();
      let groupType = (this.activeLEDs.length === 0) ? 'Object' : 'LED';

      this.$store.commit("deleteActiveObjects");
      this.$store.commit("addGroup", {group: newGroup, name: 'Group', groupType: groupType});
    },
    ungroup: function() {
      let children = this.object.children;

      for (var i = children.length - 1; i >= 0; i--) {
        let elements;
        let child = children[i];

        child.applyMatrix(this.object.matrixWorld);
        this.object.remove(child);
        this.$store.state.scene.add(child);

        if (child.userData.type == 'LED') {
          elements = this.$store.state.LEDs;
        } else {
          elements = this.$store.state.objects;
        }

        elements.push({ uuid: child.uuid });
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
