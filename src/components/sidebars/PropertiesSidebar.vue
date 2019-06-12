<template>
  <div class="properties-sidebar">
    <b>Properties</b>
    <br>
    <br>
    <template v-if="this.activeCount == 1">
      <template v-if="this.type == 'Mask'">
        <NamePanel/>
        <MaskPanel/>
        <button class="secondary" v-on:click="$store.dispatch('deleteActiveElements')">Delete</button>
      </template>
      <template v-if="this.type == 'Animation'">
        <NamePanel/>
        <AnimationPanel v-bind:key="$store.getters.activeElementUuid"/>
        <br>
        <button class="secondary" v-on:click="$store.dispatch('deleteActiveElements')">Delete</button>
      </template>
      <template v-if="this.type == 'LED'">
        <NamePanel/>
        <PositionPanel/>
        <br>
        <button class="secondary" v-on:click="$store.dispatch('deleteActiveElements')">Delete</button>
      </template>
      <template v-if="this.type == 'Object'">
        <NamePanel/>
        <PositionPanel/>
        <RotationPanel/>
        <ScalePanel/>
        <br>
        <button class="secondary" v-on:click="$store.dispatch('deleteActiveElements')">Delete</button>
        <!--<TexturePanel v-if="this.objectType == 'Plane'"/>-->
      </template>
      <template v-if="this.type == 'Camera'">
        <CameraPanel/>
      </template>
      <template v-if="this.type == 'Origin'">
        <PositionPanel/>
        <div>Connect the origin to your first LED.</div>
      </template>
      <template v-if="this.type == 'Group'">
        <NamePanel/>
        <PositionPanel/>
        <RotationPanel/>
        <ScalePanel/>
        <br>
        <button v-on:click="mask">Create mask from group</button>
        <button v-on:click="ungroup">Ungroup</button>
        <button class="secondary" v-on:click="$store.dispatch('deleteActiveElements')">Delete</button>
      </template>
    </template>
    <template v-else-if="this.activeCount > 1">
      <PositionPanel/>
      <div v-if="this.activeLEDs.length > 0">{{ this.activeLEDs.length }} LEDs selected</div>
      <div v-if="this.activeObjects.length > 0">{{ this.activeObjects.length }} Objects selected</div>
      <div v-if="this.activeGroups.length > 0">{{ this.activeGroups.length }} Groups selected</div>
      <br>
      <template v-if="this.activeLEDs.length == 0 || this.activeObjects.length == 0 ">
        <button v-on:click="mask" v-if="this.activeLEDs.length > 0">Create mask from selection</button>
        <button v-on:click="group" v-if="this.activeGroups.length == 0">Group selection</button>
      </template>
      <template v-else>
        <div>Select just LEDs or just objects to group them.</div>
        <br>
      </template>
      <button class="secondary" v-on:click="$store.dispatch('deleteActiveElements')">Delete</button>
    </template>
    <template v-else>Nothing selected</template>
  </div>
</template>

<script>
import Vue from "vue";
import NamePanel from "../panels/NamePanel";
import PositionPanel from "../panels/PositionPanel";
import RotationPanel from "../panels/RotationPanel";
import ScalePanel from "../panels/ScalePanel";
import MaskPanel from "../panels/MaskPanel";
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
    MaskPanel,
    AnimationPanel,
    CameraPanel,
    TexturePanel
  },
  computed: {
    type: function() {
      return this.$store.getters.activeElement.userData.type;
    },
    objectType: function() {
      return this.$store.getters.activeElement.userData.objectType;
    },
    activeCount: function() {
      return this.$store.getters.activeElementsUuids.length;
    },
    activeLEDs: function() {
      let LEDs = [];

      this.$store.state.selection.selectionGroup.forEach(element => {
        if (element.userData.type == 'LED') LEDs.push(element);
        if (element.userData.groupType == 'LED') {
          element.children.forEach(child => LEDs.push(child));
        }
      });

      return LEDs;
    },
    activeObjects: function() {
      return this.$store.state.selection.selectionGroup.filter(
        child => child.userData.type == "Object"
      );
    },
    activeGroups: function() {
      return this.$store.state.selection.selectionGroup.filter(
        child => child.userData.type == "Group"
      );
    }
  },
  methods: {
    group: function() {
      this.$store.dispatch("addGroup", {
        name: "Group",
        groupType: this.activeLEDs.length === 0 ? "Object" : "LED",
        children: this.$store.state.selection.selectionGroup
      });
    },
    ungroup: function() {
      let children = this.$store.getters.activeElement.children;

      for (var i = children.length - 1; i >= 0; i--) {
        let elements;
        let child = children[i];

        child.applyMatrix(this.$store.getters.activeElement.matrixWorld);
        this.$store.getters.activeElement.remove(child);
        this.$store.state.scene.add(child);
      }

      this.$store.dispatch("deleteElement", this.$store.getters.activeElement);
      this.$store.commit("clearActiveElements");
    },
    mask: function() {
      this.$store.dispatch("addMask", {LEDs: this.activeLEDs.map(LED => LED.uuid)});
    }
  }
};
</script>

<style lang="scss">
.properties-sidebar {
  padding: 10px;
  background: #424242;
  overflow-y: auto;

  button {
    width: 100%;
    margin-bottom: 1em;
  }
}

.form-element {
  display: grid;
  grid-template-columns: 80px auto;
  grid-column-gap: 10px;
  margin-bottom: 10px;

  &.full {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;

    label {
      text-align: left;
    }
  }

  &.thirds {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    label {
      grid-area: 1 / 1 / 2 / 4;
      text-align: left;
    }
  }

  label {
    align-self: center;
    text-align: right;
  }

  input {
    width: 100%;

    &::-webkit-inner-spin-button, 
    &::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
  }
}
</style>
