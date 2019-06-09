<template>
  <div>
    <b>Line Options</b>
    <br>
    <br>Count:
    <br>
    <input v-model.number="count" type="number">
    <br>
    <br>Spacing:
    <br>
    <input v-model.number="spacing" type="number">
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
  name: "LedLineDialog",
  props: ["$store"],
  data() {
    return {
      count: 10,
      spacing: 10
    };
  },
  methods: {
    cancel() {
      this.$parent.close();
    },
    add() {
      let group = [];
      let length = this.count*this.spacing;
      let line = new THREE.LineCurve3(
        new THREE.Vector3(0, -length/2, 0),
        new THREE.Vector3(0, length/2, 0)
      );

      for (let i = 0; i < this.count; i++) {
        let uuid = THREE.Math.generateUUID();
        let point = line.getPoint(i/this.count);

        if (this.$store.state.snapToGrid) {
          point.round();
        }

        this.$store.dispatch("addLED", {
          position: [point.x, point.y, point.z],
          uuid: uuid
        });

        let led = this.$store.state.scene.getObjectByProperty("uuid", uuid);
        group.push(led);
      }

      this.$store.commit("addGroup", {children: group, name: 'Line', groupType: 'LED'});
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