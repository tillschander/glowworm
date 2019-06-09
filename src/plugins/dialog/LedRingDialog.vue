<template>
  <div>
    <b>Ring Options</b>
    <br>
    <br>Count:
    <br>
    <input v-model.number="count" type="number">
    <br>
    <br>Radius:
    <br>
    <input v-model.number="radius" type="number">
    <br>
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
  name: "LedRingDialog",
  props: ["$store"],
  data() {
    return {
      count: 16,
      radius: 20
    };
  },
  methods: {
    cancel() {
      this.$parent.close();
    },
    add() {
      let group = [];

      for (let i = 0; i < this.count; i++) {
        let uuid = THREE.Math.generateUUID();
        let x = this.radius * Math.cos((2 * i * Math.PI) / this.count);
        let z = this.radius * Math.sin((2 * i * Math.PI) / this.count);

        if (this.$store.state.snapToGrid) {
          x = Math.round(x);
          z = Math.round(z);
        }

        this.$store.dispatch("addLED", {
          position: [x, 0, z],
          uuid: uuid
        });

        let led = this.$store.state.scene.getObjectByProperty("uuid", uuid);
        group.push(led);
      }
      
      this.$store.commit("addGroup", {children: group, name: 'Ring', groupType: 'LED'});
      this.$parent.continue();
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