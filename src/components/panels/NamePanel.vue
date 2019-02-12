<template>
  <div>
    Name:
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
        let name = this.$store.state.activeObject.userData.name
        return name ? name : this.type;
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          name: value
        });
      }
    },
  }
};
</script>
