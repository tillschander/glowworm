<template>
  <div>
    Line Options:
    <br>====
    <br>
    <br>LED Count:
    <br>
    <input v-model.number="count" type="number">
    <br>
    <br>Start Position:
    <br>
    <input v-model.number="startX" type="number" class="third">
    <input v-model.number="startY" type="number" class="third">
    <input v-model.number="startZ" type="number" class="third">
    <br>
    <br>End Position:
    <br>
    <input v-model.number="endX" type="number" class="third">
    <input v-model.number="endY" type="number" class="third">
    <input v-model.number="endZ" type="number" class="third">
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
  name: "LedLineDialog",
  props: ["$store"],
  data() {
    return {
      count: 0,
      startX: 0,
      startY: 0,
      startZ: 0,
      endX: 0,
      endY: 0,
      endZ: 0
    };
  },
  methods: {
    cancel() {
      this.$parent.close();
    },
    add() {
      let line = new THREE.LineCurve3(
        new THREE.Vector3(this.startX, this.startY, this.startZ),
        new THREE.Vector3(this.endX,this.endY,this.endZ)
      );

      for (let i = 0; i < this.count; i++) {
        let point = line.getPoint(i/this.count);

        if (this.$store.state.snapToGrid) {
          point.round();
        }

        this.$store.commit("addLED", {
          position: [point.x, point.y, point.z]
        });
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