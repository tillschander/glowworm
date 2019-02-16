<template>
  <div>Name:
    <br>
    <input v-model="name" type="text">
  </div>
</template>

<script>
export default {
  name: "NamePanel",
  computed: {
    uuid: function() {
      return this.$store.state.activeObject.uuid;
    },
    type: function() {
      return this.$store.state.activeObject.userData.type;
    },
    name: {
      get() {
        let name = undefined;

        if (this.type == "LED") {
          name = this.$store.state.LEDs[this.uuid].name;
        } else if (this.type == "Object") {
          name = this.$store.state.objects.find(
            object => object.uuid == this.uuid
          ).name;
        } else if (this.type == "Animation") {
          name = this.$store.state.animations.find(
            animation => animation.uuid == this.uuid
          ).name;
        }

        return name ? name : this.type;
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          name: value
        });
      }
    }
  }
};
</script>
