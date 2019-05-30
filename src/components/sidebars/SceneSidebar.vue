<template>
  <div class="scene-sidebar">
    <ul class="tree">
      <li class="root">Scene</li>
      <li>Masks
        <ul>
          <SceneObject
            v-for="mask in this.$store.getters.masks"
            v-bind:key="mask.uuid"
            v-bind:uuid="mask.uuid"
            v-bind:type="'Mask'"
            class="scene-object"
          ></SceneObject>
        </ul>
      </li>
      <li>Animations
        <ul>
          <SceneObject
            v-for="animation in this.$store.state.animations"
            v-bind:key="animation.uuid"
            v-bind:uuid="animation.uuid"
            v-bind:type="'Animation'"
            class="scene-object"
          ></SceneObject>
        </ul>
      </li>
      <li>LEDs
        <ul>
          <SceneObject
            v-for="LED in LEDsAndGroups"
            v-bind:key="LED.uuid"
            v-bind:uuid="LED.uuid"
            v-bind:type="'LED'"
            class="scene-object"
          ></SceneObject>
        </ul>
      </li>
      <li>Objects
        <ul>
          <SceneObject
            v-for="object in objectsAndGroups"
            v-bind:key="object.uuid"
            v-bind:uuid="object.uuid"
            v-bind:type="'Object'"
            class="scene-object"
          ></SceneObject>
        </ul>
      </li>
      <SceneObject
        v-if="this.$store.state.camera.parent"
        v-bind:uuid="this.$store.state.camera.uuid"
        v-bind:type="'Camera'"
        class="scene-object"
      ></SceneObject>
    </ul>
  </div>
</template>

<script>
import SceneObject from "./sceneSidebar/SceneObject";

export default {
  name: "SceneSidebar",
  components: {
    SceneObject
  },
  computed: {
    LEDsAndGroups: function() {
      let LEDs = [];
      this.$store.state.scene.traverse(function (child) {
        if ((child.userData.type === "LED" && child.parent.userData.groupType !== 'LED') || child.userData.groupType === 'LED') {
          LEDs.push(child);
        }
      });
      return LEDs.sort((a, b) => a.id - b.id);
    },
    objectsAndGroups: function() {
      let objects = [];
      this.$store.state.scene.traverse(function (child) {
        if ((child.userData.type === "Object" && child.parent.userData.groupType !== 'Object') || child.userData.groupType === 'Object') {
          objects.push(child);
        }
      });
      return objects.sort((a, b) => a.id - b.id);
    }
  }
};
</script>

<style lang="scss">
.scene-sidebar {
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #424242;

  ul {
    list-style: none;
    margin: 0 0 0 1em;
    line-height: 1.2em;

    li {
      position: relative;
      padding: 0.4em 0 0;

      &:before {
        position: absolute;
        left: -0.75em;
        top: 0;
        content: "";
        display: block;
        border-left: 1px solid #ddd;
        height: 1em;
        border-bottom: 1px solid #ddd;
        width: 0.5em;
      }

      &:after {
        position: absolute;
        left: -0.75em;
        bottom: -0.25em;
        content: "";
        display: block;
        border-left: 1px solid #ddd;
        height: 100%;
      }

      &.root {
        margin: 0 0 0 -1em;
        padding: 0;

        &:before {
          display: none;
        }

        &:after {
          display: none;
        }
      }

      &:last-child {
        &:after {
          display: none;
        }
      }
    }
  }
}
</style>
