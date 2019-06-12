<script>
export default {
  name: "Default",
  props: ["properties", "uuid"],
  computed: {
    activeAnimation: function() {
      return this.$store.state.animations.animations.find(
        animation => animation.uuid == this.$store.getters.activeElementUuid
      );
    },
    activeEffect: function() {
      return this.activeAnimation.effects.find(
        effect => effect.uuid == this.uuid
      );
    }
  },
  methods: {
    apply: function(name, value, converter = v => v) {
      this[name] = value;
      this.activeEffect.properties[name].value = converter(value);
      this.$store.state.leds.activeMaterial.uniforms[
        name + this.uuid
      ].value = converter(value);
      this.$store.state.buffer.material.uniforms[
        name + this.uuid
      ].value = converter(value);
    }
  }
};
</script>