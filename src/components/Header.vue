<template>
  <div class="header">
    <div
      class="tab"
      v-on:click="setMode('design')"
      v-bind:class="{ active: this.$store.state.mode == 'design' }"
    >Design</div>
    <div
      class="tab"
      v-on:click="setMode('live')"
      v-bind:class="{ active: this.$store.state.mode == 'live' }"
    >Live</div>
    <div
      class="tab"
      v-on:click="setMode('export')"
      v-bind:class="{ active: this.$store.state.mode == 'export' }"
    >Export</div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "Header",
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["setMode"])
  }
};
</script>

<style scoped lang="scss">
.header {
  justify-content: center;
  display: flex;
}

.tab {
  padding: 10px 20px;
  margin: 10px 0 5px 0;
  cursor: pointer;

  &.active {
    border-bottom: 3px solid cyan;
    text-shadow: 0 0 20px #000;
  }
}
</style>
