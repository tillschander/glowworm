<template>
  <div class="sidebar">
    <slot></slot>
  </div>
</template>

<script>
import Vue from "vue";
import Split from "split.js";

export default {
  name: "Sidebar",
  data() {
    return {
      elements: [],
      instance: null
    };
  },
  mounted: function() {
    this.elements = [];

    this.$slots.default.forEach(vnode => {
      this.elements.push(vnode.elm);
    });

    if (this.$slots.default.length > 1) {
      this.instance = Split(this.elements, {
        direction: "vertical",
        sizes: [50, 50],
        snapOffset: 0
      });
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar > * {
  height: 100%;
}
</style>
