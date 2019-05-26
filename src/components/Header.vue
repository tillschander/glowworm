<template>
  <div class="header">
    <div class="menu">
      <div class="icon">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="flyout">
        <button v-on:click="reload()">New</button>
        <button v-on:click="save()">Save</button>
        <button v-on:click="load()">Load</button>
        <button v-on:click="quit()">Quit</button>
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
    save: function() {
      let path = remote.dialog.showSaveDialog({
        filters: [{ name: "Custom File Type", extensions: ["json"] }],
        defaultPath: "save.json"
      });

      if (path) {
        this.$store.commit("setSavePath", path);
        this.$store.dispatch("save");
      }
    },
    load: function() {
      let paths = remote.dialog.showOpenDialog({
        filters: [{ name: "Custom File Type", extensions: ["json"] }],
        properties: ["openFile"]
      });

      if (paths && paths.length) {
        this.$store.dispatch("load", paths[0]);
      }
    },
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
