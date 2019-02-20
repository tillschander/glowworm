<script>
export default {
  name: "Default",
  props: ["properties", "uuid"],
  computed: {
    activeAnimation: function() {
      return this.$store.state.animations.find(
        animation => animation.uuid == this.$store.state.activeObject.uuid
      );
    },
    activeEffect: function() {
      let self = this;
      return this.activeAnimation.effects.find(
        effect => effect.uuid == self.uuid
      );
    }
  },
  methods: {
    apply: function(name, value, converter = v => v) {
      this[name] = value;
      this.$store.state.activeLEDMaterial.uniforms[
        name + this.uuid
      ].value = converter(value);
      this.activeEffect.properties[name + this.uuid].value = converter(value);
    }
  }
};
</script>