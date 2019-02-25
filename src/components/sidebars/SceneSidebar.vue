<template>
  <div class="scene-sidebar">
    <ul class="tree">
      <li class="root">Scene</li>
      <li>Animations
        <ul>
          <SceneObject
            v-for="animation in this.$store.state.animations"
            v-bind:key="animation.uuid"
            v-bind:uuid="animation.uuid"
            v-bind:name="animation.name ? animation.name : 'Animation'"
            class="scene-object"
          ></SceneObject>
        </ul>
      </li>
      <li>LEDs
        <ul>
          <SceneObject
            v-for="(LED, uuid) in this.$store.state.LEDs"
            v-bind:key="uuid"
            v-bind:uuid="uuid"
            v-bind:name="LED.name ? LED.name : 'LED'"
            class="scene-object"
          ></SceneObject>
        </ul>
      </li>
      <li>Objects
        <ul>
          <SceneObject
            v-for="object in this.$store.state.objects"
            v-bind:key="object.uuid"
            v-bind:uuid="object.uuid"
            v-bind:name="object.name ? object.name : 'Object'"
            class="scene-object"
          ></SceneObject>
        </ul>
      </li>
      <SceneObject
        v-bind:uuid="this.$store.state.camera.uuid"
        v-bind:name="'Camera'"
        class="scene-object"
      ></SceneObject>
    </ul>
    <div class="buttons">
      <button disabled class="small">Group</button>
      <button disabled class="small">Ungroup</button>
    </div>
  </div>
</template>

<script>
import SceneObject from "./sceneSidebar/SceneObject";

export default {
  name: "SceneSidebar",
  components: {
    SceneObject
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
  justify-content: space-between;

  .buttons {
    display: flex;
    background: #333333;
    padding: 10px;
    position: relative;
    left: -10px;
    bottom: -10px;
    width: calc(100% + 20px);
  }

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
