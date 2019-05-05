<template>
  <div class="dialog">
    Effects:
    <br>====
    <br>
    <br>
    <div class="effects">
      <div
        class="effect"
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
import SimpleColor from "../../components/panels/effects/SimpleColor";
import Pulse from "../../components/panels/effects/Pulse";
import RandomPulses from "../../components/panels/effects/RandomPulses";

export default {
  name: "EffectsDialog",
  data() {
    return {
      effects: [new SimpleColor(), new Pulse(), new RandomPulses()],
      chosenEffect: undefined
    };
  }
};
</script>

<style scoped lang="scss">
.dialog {
  width: 350px;
}

.effects {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.effect {
  width: 100px;
  height: 60px;
  background: #585858;
  border: 3px solid #585858;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  display: inline-block;

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