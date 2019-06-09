<template>
  <div class="form-element full">
    <label>Name:</label>
    <input v-model="name" type="text">
  </div>
</template>

<script>
export default {
  name: "NamePanel",
  computed: {
    uuid: function() {
      return Object.keys(this.$store.state.activeElements)[0];
    },
    element: function() {
      return this.$store.state.scene.getObjectByProperty("uuid", this.uuid);
    },
    type: function() {
      return this.element.userData.type;
    },
    name: {
      get() {
        let name = this.element.name;

        return name ? name : this.type;
      },
      set(value) {
        this.$store.commit("updateElementName", {
          uuid: this.uuid,
          name: value
        });
      }
    }
  }
};
</script>
