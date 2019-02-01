<template>
  <div class="header">
    <div
      class="tab"
      v-on:click="setMode('layout')"
      v-bind:class="{ active: this.$store.state.mode == 'layout' }"
    >Layout</div>
    <div
      class="tab"
      v-on:click="setMode('animations')"
      v-bind:class="{ active: this.$store.state.mode == 'animations' }"
    >Animations</div>
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
