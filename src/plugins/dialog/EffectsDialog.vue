<template>
  <div class="dialog">
    <b>Effects</b>
    <br>
    <br>
    <div class="effect-buttons">
      <div
        class="effect-button"
        v-for="effect in effects"
        v-bind:key="effect.type"
        v-bind:class="{ active: chosenEffect && chosenEffect.type == effect.type }"
        v-on:click="chosenEffect = effect"
      >
        <span>{{ effect.name }}</span>
      </div>
    </div>
    <div class="buttons">
      <button v-on:click="$parent.close()">Cancel</button>
      <button v-on:click="$parent.continue({ effect: chosenEffect })">Add</button>
    </div>
  </div>
</template>

<script>
import SimpleColor from "../../components/panels/effects/SimpleColor.js";
import Pulse from "../../components/panels/effects/Pulse.js";
import RandomPulses from "../../components/panels/effects/RandomPulses.js";
import Wave from "../../components/panels/effects/Wave.js";
import RampUp from "../../components/panels/effects/RampUp.js";
import Alternating from "../../components/panels/effects/Alternating.js";
import ColorFade from "../../components/panels/effects/ColorFade.js";
import CustomCode from "../../components/panels/effects/CustomCode.js";

export default {
  name: "EffectsDialog",
  data() {
    return {
      effects: [
        new SimpleColor(),
        new Pulse(),
        new RandomPulses(),
        new Wave(),
        new RampUp(),
        new Alternating(),
        new ColorFade(),
        new CustomCode()
      ],
      chosenEffect: undefined
    };
  }
};
</script>

<style scoped lang="scss">
.dialog {
  width: 320px;
}

.effect-buttons {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 2em;
}

.effect-button {
  height: 70px;
  background: #585858;
  border: 0.5em solid #585858;
  cursor: pointer;

  span {
    font-weight: bold;
    display: inline;
    position: relative;
    left: 0.5em;
    top: 0.2em;
    padding: 0.7em 0;
    line-height: 1.7em;
  }

  &.active,
  &:hover {
    border-color: cyan;
    color: #585858;

    span {
      background: cyan;
      box-shadow: 0.5em 0 0 cyan, -0.5em 0 0 cyan;
    }
  }
}
.buttons {
  display: flex;
  justify-content: space-between;
}
</style>