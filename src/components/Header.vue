<template>
  <div class="header">
    <div class="menu">
      <div class="icon">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="flyout">
        <button v-on:click="reload()" title="New (Ctrl+N)">New</button>
        <button v-on:click="$store.dispatch('save')" title="Save (Ctrl+S)">Save</button>
        <button v-on:click="$store.dispatch('load')" title="Load (Ctrl+L)">Load</button>
        <button v-on:click="quit()" title="Quit (Ctrl+Q)">Quit</button>
      </div>
    </div>
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
  </div>
</template>

<script>
const remote = require("electron").remote;
import { mapMutations } from "vuex";

export default {
  name: "Header",
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["setMode"]),
    quit: function() {
      remote.getCurrentWindow().close();
    },
    reload: function() {
      remote.getCurrentWindow().reload();
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  justify-content: center;
  display: flex;
  position: relative;
}

.tab {
  padding: 10px 20px;
  margin: 10px 0 5px 0;
  cursor: pointer;
  font-size: 14px;

  &.active {
    border-bottom: 3px solid cyan;
    text-shadow: 0 0 20px #000;
  }
}

.menu {
  display: inline-block;
  cursor: pointer;
  position: absolute;
  top: 12px;
  left: 18px;
  z-index: 999;

  &:hover {
    .flyout {
      display: block;
    }
  }

  .flyout {
    display: none;
    width: 150px;
    box-shadow: 0 0 15px #000;

    > * {
      width: 100%;
      text-align: left;
    }
  }

  .icon div {
    width: 30px;
    height: 3px;
    background-color: #ccc;
    margin: 4px 0;
  }
}
</style>
