<script>
export default {
  name: "Default",
  props: ["properties", "uuid"],
  computed: {
    activeAnimation: function() {
      return this.$store.state.animations.find(
        animation =>
          animation.uuid == Object.keys(this.$store.state.activeObjects)[0]
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
      this.$store.state.activeLEDMaterial.uniforms[
        name + this.uuid
      ].value = converter(value);
      this.$store.state.bufferMaterial.uniforms[
        name + this.uuid
      ].value = converter(value);
    }
  }
};
</script>