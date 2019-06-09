<template>
  <div>
    <b>Grid Options</b>
    <br>
    <br>X Count:
    <br>
    <input v-model.number="countX" type="number">
    <br>
    <br>Y Count:
    <br>
    <input v-model.number="countY" type="number">
    <br>
    <br>X Spacing:
    <br>
    <input v-model.number="spacingX" type="number">
    <br>
    <br>Y Spacing:
    <br>
    <input v-model.number="spacingY" type="number">
    <br>
    <br>Order:
    <br>
    <select v-model="order">
      <option>ZigZag</option>
      <option disabled>Snake</option>
    </select>
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
  name: "LedGridDialog",
  props: ["$store"],
  data() {
    return {
      countX: 5,
      countY: 5,
      spacingX: 8,
      spacingY: 8,
      order: "ZigZag"
    };
  },
  methods: {
    cancel() {
      this.$parent.close();
    },
    add() {
      let group = [];

      for (let x = 0; x < this.countX; x++) {
        let line = new THREE.LineCurve3(
          new THREE.Vector3(x * this.spacingX, 0, 0),
          new THREE.Vector3(x * this.spacingX, 0, this.countY * this.spacingY)
        );

        for (let y = 0; y < this.countY; y++) {
          let uuid = THREE.Math.generateUUID();
          let point = line.getPoint(y / this.countY);

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
      }

      this.$store.commit("addGroup", {
        children: group,
        name: "Grid",
        groupType: "LED"
      });
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

.third {
  width: 33.3333%;
}
</style>