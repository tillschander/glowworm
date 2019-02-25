<template>
  <div>Texture:
    <br>
    <input type="file" @change="processFile($event)">
  </div>
</template>

<script>
const THREE = require("three");

export default {
  name: "TexturePanel",
  data() {
    return {
      file: null
    };
  },
  methods: {
    processFile(event) {
      let activeObject = this.$store.state.activeObject;

      this.file = event.target.files[0].path;
      new THREE.TextureLoader().load(
        "file://" + this.file,
        function(texture) {
          activeObject.material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
          });
        }
      );
    }
  }
};
</script>
