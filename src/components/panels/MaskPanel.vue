<template>
  <div>
    LEDs:
    <br>
    <label v-for="LED in $store.getters.LEDs" v-bind:key="LED.uuid">
      <input type="checkbox" v-bind:value="LED.uuid" v-model="maskLEDs">
      {{ getName(LED) }}
    </label>
    <br>
  </div>
</template>

<script>
export default {
  name: "MaskPanel",
  computed: {
    uuid: function() {
      return Object.keys(this.$store.state.activeObjects)[0];
    },
    mask: function() {
      return this.$store.getters.masks.find(mask => mask.uuid == this.uuid);
    },
    maskLEDs: {
      get() {
        return this.mask.userData.LEDs;
      },
      set(value) {
        this.$store.dispatch("updateMaskLEDs", {
          uuid: this.uuid,
          LEDs: value
        });
      }
    }
  },
  methods: {
    getName(LED) {
      return LED.name ? LED.name : LED.userData.type;
    }
  }
};
</script>

<style scoped lang="scss">
label {
  display: block;
}
</style>
