<template>
  <div>Grid Options:
    <br>====
    <br>
    <br>X Count:
    <br>
    <input v-model.number="countX" type="number">
    <br>
    <br>Y Count:
    <br>
    <input v-model.number="countY" type="number">
    <br>
    <br>X Gap:
    <br>
    <input v-model.number="gapX" type="number">
    <br>
    <br>Y Gap:
    <br>
    <input v-model.number="gapY" type="number">
    <br>
    <br>Order:
    <br>
    <select v-model="order">
      <option>ZigZag</option>
      <option disabled>Snake</option>
    </select>
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

export default {
  name: "LedGridDialog",
  props: ["$store"],
  data() {
    return {
      countX: 5,
      countY: 5,
      gapX: 10,
      gapY: 10,
      order: "ZigZag"
    };
  },
  methods: {
    cancel() {
      this.$parent.close();
    },
    add() {
      for (let x = 0; x < this.countX; x++) {
        let line = new THREE.LineCurve3(
          new THREE.Vector3(x*this.gapX, 0, 0),
          new THREE.Vector3(x*this.gapX, 0, this.countY*this.gapY)
        );
          
        for (let y = 0; y < this.countY; y++) {
          let point = line.getPoint(y / this.countY);

          if (this.$store.state.snapToGrid) {
            point.round();
          }

          this.$store.commit("addLED", {
            position: [point.x, point.y, point.z]
          });
        }
      }

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