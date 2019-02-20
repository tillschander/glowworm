<template>
  <div class="effects">Effects:
    <br>====
    <br>
    <br>
    <div
      class="effect"
      v-for="effect in effects"
      v-bind:key="effect.type"
      v-bind:class="{ active: chosenEffect && chosenEffect.type == effect.type }"
      v-on:click="chosenEffect = effect"
    >
      <span>{{ effect.name }}</span>
    </div>
    <br>
    <br>
    <br>
    <br>
    <div class="buttons">
      <button v-on:click="cancel()">Cancel</button>
      <button v-on:click="add()">Add</button>
    </div>
  </div>
</template>

<script>
import SimpleColor from '../../components/panels/effects/SimpleColor';
import Pulse from '../../components/panels/effects/Pulse';
import RandomPulses from '../../components/panels/effects/RandomPulses';

export default {
  name: "EffectsDialog",
  data() {
    return {
      effects: [new SimpleColor(), new Pulse(), new RandomPulses()],
      chosenEffect: undefined
    };
  },
  methods: {
    cancel() {
      this.$parent.close();
    },
    add() {
      this.$parent.continue({
        effect: this.makeUniformsUnique(this.chosenEffect)
      });
    },
    makeUniformsUnique(effect) {
      for (const key in effect.properties) {
        let uniqueKey = key + effect.uuid;
        let regex = new RegExp(key, "g");

        effect.shaderParameters = effect.shaderParameters.replace(
          regex,
          uniqueKey
        );
        effect.shader = effect.shader.replace(regex, uniqueKey);
        effect.properties[uniqueKey] = effect.properties[key];
        delete effect.properties[key];
      }

      return effect;
    }
  }
};
</script>

<style scoped lang="scss">
.effects {
  width: 350px;
}

.effect {
  width: 100px;
  height: 60px;
  background: #585858;
  border: 3px solid #585858;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  position: relative;
  display: inline-block;
  margin-right: 20px;

  span {
    width: 100%;
    text-align: center;
    padding-top: 3px;
    font-weight: bold;
  }

  &.active,
  &:hover {
    border: 3px solid cyan;
    color: #585858;

    span {
      background: cyan;
    }
  }
}
.buttons {
  display: flex;
  justify-content: space-between;
}
</style>