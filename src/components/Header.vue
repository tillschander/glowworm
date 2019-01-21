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
  width: 100%;
  height: 60px;
  display: flex;
}

.tab {
  padding: 10px 20px;
  margin: 20px 0 5px 0;
  border-bottom: 1px solid #cccccc;

  &.active {
    border: 1px solid #cccccc;
    border-bottom: 0;
  }
}
</style>
