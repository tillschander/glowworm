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
    name: {
      get() {
        let name = this.$store.getters.activeElement.name;

        return name ? name : this.$store.getters.activeElement.userData.type;
      },
      set(value) {
        this.$store.getters.activeElement.name = value;
      }
    }
  }
};
</script>
