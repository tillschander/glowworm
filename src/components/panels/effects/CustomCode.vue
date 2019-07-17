<template>
  <div>
    <div class="form-element">
      <label>Code:</label>
      <div>
        <textarea v-model="code" class="shader-code"></textarea>
        <button v-on:click="apply()">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
import Default from "./Default.vue";

export default {
  name: "CustomCode",
  mixins: [Default],
  data() {
    return {
      code: "vec3 effectColor = vec3(0.0, 1.0, 1.0);"
    };
  },
  methods: {
    apply: function() {
      this.activeEffect.shader = this.code;
      this.activeEffect.shader =
        this.code +
        "if (masked < 0.5) { vColor.rgb = blendByMode(blendMode, opacity, vColor.rgb, effectColor); }";
      this.$store.dispatch("applyLEDMaterial");
    }
  },
  mounted() {
    this.apply();
  }
};
</script>

<style>
.shader-code {
  width: 100%;
  height: 5em;
}
</style>

