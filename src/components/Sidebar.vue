<template v-on:contentChanged="refreshContent">
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
      split: null
    };
  },
  mounted: function() {
    this.splitIfRequired();
  },
  methods: {
    refreshContent: function() {
      this.splitIfRequired();
    },
    splitIfRequired: function() {
      let visibleElements = this.$slots.default
        .filter(element => !element.isComment)
        .map(vnode => vnode.elm);

      if (this.split) this.split.destroy();

      if (visibleElements.length > 1) {
        this.split = Split(visibleElements, {
          direction: "vertical",
          sizes: [50, 50],
          snapOffset: 0
        });
      } else {
        this.split = null;
      }
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
