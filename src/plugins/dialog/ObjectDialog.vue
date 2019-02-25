<template>
  <div>Load .obj File:
    <br>====
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
const THREE = require("three");
const OBJLoader = require("three-obj-loader");
OBJLoader(THREE);

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
      var self = this;
      var loader = new THREE.OBJLoader();

      loader.load(
        "file://" + this.file.path,
        function(object) {
          self.$store.commit("addObject", {
            mesh: object,
            position: [0, 0, 0],
            name:  self.file.name
          });

          self.$parent.continue();
        },
        null,
        function(error) {
          console.log(error);
          this.$parent.close();
        }
      );
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