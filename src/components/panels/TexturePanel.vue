<template>
  <div class="form-element full">
    <label>Texture:</label>
    <input type="file" @change="processFile($event)">
  </div>
</template>

<script>
export default {
  name: "TexturePanel",
  data() {
    return {
      file: null
    };
  },
  methods: {
    processFile(event) {
      var self = this;
      self.file = event.target.files[0].path;
      new THREE.TextureLoader().load(
        "file://" + self.file,
        function(texture) {
          self.$store.getters.activeElement.material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
          });
        }
      );
    }
  }
};
</script>
