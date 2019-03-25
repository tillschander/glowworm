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
  computed: {
    uuid: function() {
      return Object.keys(this.$store.state.activeObjects)[0];
    },
    object: function() {
      return this.$store.state.scene.getObjectByProperty("uuid", this.uuid);
    }
  },
  methods: {
    processFile(event) {
      var self = this;
      self.file = event.target.files[0].path;
      new THREE.TextureLoader().load(
        "file://" + self.file,
        function(texture) {
          self.object.material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
          });
        }
      );
    }
  }
};
</script>
