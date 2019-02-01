<template>
  <div class="effects-sidebar">
      Effects List:<br>====
    <label>
      Choose Effect:
      <select v-model="chosenEffect">
        <option value></option>
        <option value="random">Random</option>
        <option value="wave">Wave</option>
      </select>
    </label>
    <div v-if="chosenEffect == 'random'">
      <label>
        Intensity:
        <input type="range" min="0" max="1" step="0.01">
      </label>
      <label>
        Frequency:
        <input type="range" min="0" max="1" step="0.01">
      </label>
      <label>
        Shape:
        <select>
          <option value="random">Square</option>
        </select>
      </label>
    </div>
    <button>Apply Effect</button>
    <button>Remove Effect</button>
  </div>
</template>

<script>
export default {
  name: "EffectsSidebar",
  data: function() {
    return {
      chosenEffect: ""
    };
  }
};
</script>

<style scoped lang="scss">
.effects-sidebar {
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: #424242;
}

label {
  display: block;
  margin-bottom: 10px;
}
</style>
