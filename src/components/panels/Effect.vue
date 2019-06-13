<template>
  <div class="effect">
    <div class="title">
      <span>{{name}}</span>
      <span v-on:click="deleteEffect" class="delete">❌</span>
    </div>
    <div class="form-element">
      <label>Blend mode:</label>
      <select v-model="blendMode">
        <option
          v-for="blendMode in blendModes"
          v-bind:key="blendMode.value"
          v-bind:value="blendMode.value"
        >{{blendMode.text}}</option>
      </select>
    </div>
    <div class="form-element">
      <label>Opacity:</label>
      <input
        type="range"
        v-on:input="$refs.component.apply('opacity', $event.target.value)"
        min="0"
        max="1"
        step="0.01"
        v-bind:value="properties.opacity.value"
      >
    </div>
    <div class="form-element">
      <label>Mask:</label>
      <select v-model="mask">
        <option value="undefined">No Mask</option>
        <option
          v-for="mask in $store.getters.masks"
          v-bind:key="mask.uuid"
          v-bind:value="mask.uuid"
        >{{mask.name}}</option>
      </select>
    </div>
    <component
      class="properties"
      v-bind:is="component"
      v-bind:properties="properties"
      v-bind:uuid="uuid"
      ref="component"
    />
  </div>
</template>

<script>
export default {
  name: "Effect",
  props: ["type", "name", "properties", "uuid"],
  data() {
    return {
      component: () => import(`./effects/${this.type}.vue`),
      blendModes: [
        { text: "Normal", value: 0 },
        { text: "Darken", value: 1 },
        { text: "Multiply", value: 2 },
        { text: "Lighten", value: 3 },
        { text: "Screen", value: 4 }
      ]
    };
  },
  computed: {
    blendMode: {
      get() {
        return this.properties.blendMode.value;
      },
      set(value) {
        this.$refs.component.apply('blendMode', value);
      }
    },
    mask: {
      get() {
        return this.$parent.animation.effects.find(effect => effect.uuid === this.uuid).mask;
      },
      set(value) {
        let threeObject = this.$store.state.scene.getObjectByProperty('uuid', value);

        this.$parent.animation.effects.find(effect => effect.uuid === this.uuid).mask = value;
        this.$parent.animation.effects.find(effect => effect.uuid === this.uuid).maskObject = threeObject;
        this.$store.dispatch("applyLEDMaterial");
      }
    }
  },
  methods: {
    deleteEffect: function() {
      let index = this.$parent.animation.effects.findIndex(
        effect => effect.uuid == this.uuid
      );

      this.$parent.animation.effects.splice(index, 1);
      this.$store.dispatch("applyLEDMaterial");
    }
  }
};
</script>

<style lang="scss">
.effect {
  margin-bottom: 1em;
  background: #292929;
  padding: 0 10px 0.5em 10px;
  left: -10px;
  position: relative;
  width: calc(100% + 20px);

  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 7px 10px;
    left: -10px;
    position: relative;
    width: calc(100% + 20px);
    background: rgba(0, 0, 0, 0.5);
    line-height: 1em;
  }

  .delete {
    cursor: pointer;
  }

  select {
    width: 100%;
  }

  .properties {
    border-top: 1px solid #000;
    margin-bottom: -5px;
    padding-top: 10px;
  }
}
</style>
