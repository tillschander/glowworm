<template>
  <div>
    LEDs:
    <br>
    <label
      v-for="LED in $store.getters.LEDs"
      v-bind:key="LED.uuid"
      @change="highlight(LED, 'change')"
      @mouseenter="highlight(LED, 'enter')"
      @mouseleave="highlight(LED, 'leave')"
    >
      <input type="checkbox" v-bind:value="LED.uuid" v-model="maskLEDs">
      {{ getName(LED) }}
    </label>
    <br>
  </div>
</template>

<script>
import ledMaterialUtil from "../../utils/ledMaterial.js";

export default {
  name: "MaskPanel",
  data() {
    return {
      highlightMaterial: null,
    }
  },
  computed: {
    uuid: function() {
      return this.$store.getters.activeElementUuid;
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
    },
    highlight(LED, eventType) {
      if (eventType == 'enter') {
        this.$store.dispatch("addToSelectionGroup", LED.uuid);
      } else if (eventType == 'leave') {
        this.$store.dispatch("emptySelectionGroup");
      } else {
        if (this.maskLEDs.indexOf(LED.uuid) > -1) {
          LED.material = this.$store.state.leds.activeMaterial;
        } else {
          LED.material = this.highlightMaterial;
        }
      }
    }
  },
  mounted: function() {
    let shader = "vColor = vec4(0.0, 0.5, 0.5, 1.0);";
    let uniforms = {
      ledTexture: new THREE.Uniform(new THREE.TextureLoader().load(location.origin + '/led.png')),
      shineTexture: new THREE.Uniform(new THREE.TextureLoader().load(location.origin + '/shine.png')),
    };

    this.highlightMaterial = ledMaterialUtil.getLEDMaterial(uniforms, {}, "", shader);
    this.$store.getters.LEDs.forEach(LED => {
      this.highlight(LED, 'update');
    });
  },
  beforeDestroy: function() {
    this.$store.dispatch('applyLEDMaterial');
  }
};
</script>

<style scoped lang="scss">
label {
  display: block;
}
</style>
