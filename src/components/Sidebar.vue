<template>
  <div class="sidebar">
    <slot name="top" ref="top"></slot>
    <slot name="bottom" ref="bottom"></slot>
  </div>
</template>

<script>
import Vue from "vue";
import Split from "split.js";

export default {
  name: "Sidebar",
  mounted: function() {
    let self = this;
    Vue.nextTick(function() {
      Split([self.$children[0].$el, self.$children[1].$el], {
        direction: "vertical",
        sizes: [50, 50],
        snapOffset: 0
      });
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar > :not(.gutter) {
  /*
  height: calc(50% - 4.5px);
  */
}
</style>
