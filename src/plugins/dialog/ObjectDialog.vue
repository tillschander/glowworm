<template>
  <div>
    <b>Load .obj file</b>
    <br>
    <br>
    <input type="file" @change="processFile($event)">
    <br>
    <br>
    <div class="buttons">
      <button v-on:click="cancel()">Cancel</button>
      <button v-on:click="add()">Add</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ObjectDialog",
  props: ["$store"],
  data() {
    return {
      file: null
    };
  },
  methods: {
    cancel() {
      this.$parent.close();
    },
    add() {
      this.$store.commit("addModel", { path: this.file.path, name: this.file.name });
      this.$parent.continue();
    },
    processFile(event) {
      this.file = event.target.files[0];
    }
  }
};
</script>

<style lang="scss">
.buttons {
  display: flex;
  justify-content: space-between;
}
</style>