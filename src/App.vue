<template>
  <div id="app" class="app">
    <Header class="header"/>
    <div class="main">
      <Sidebar key="sidebar0" ref="sidebar0" v-if="this.mode == 'live'">
        <AnimationsSidebar/>
      </Sidebar>
      <Sidebar ref="viewport" v-show="this.mode !== 'io'">
        <Viewport/>
        <FaderSidebar v-if="this.mode == 'live'"/>
      </Sidebar>
      <Sidebar key="sidebar1" ref="sidebar1" v-if="this.mode == 'design'">
        <PropertiesSidebar/>
      </Sidebar>
      <Sidebar key="sidebar2" ref="sidebar2" v-if="this.mode == 'design'">
        <SceneSidebar/>
      </Sidebar>
      <Sidebar key="sidebar3" ref="sidebar3" v-if="this.mode == 'live'">
        <AnimationsSidebar/>
      </Sidebar>
      <IO ref="io" v-if="this.mode == 'io'"/>
    </div>
    <Footer class="footer"/>
  </div>
</template>

<script>
import Vue from "vue";
import Split from "split.js";
import Header from "./components/Header";
import Viewport from "./components/Viewport";
import SceneSidebar from "./components/sidebars/SceneSidebar";
import PropertiesSidebar from "./components/sidebars/PropertiesSidebar";
import AnimationsSidebar from "./components/sidebars/AnimationsSidebar";
import FaderSidebar from "./components/sidebars/FaderSidebar";
import IO from "./components/IO";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

export default {
  name: "app",
  components: {
    Header,
    Viewport,
    SceneSidebar,
    PropertiesSidebar,
    AnimationsSidebar,
    FaderSidebar,
    IO,
    Footer,
    Sidebar
  },
  data: function() {
    return {
      split: null
    };
  },
  computed: {
    mode: function() {
      return this.$store.state.mode;
    }
  },
  watch: {
    mode: function(newMode, oldMode) {
      let self = this;
      Vue.nextTick(function() {
        self.$refs.viewport.refreshContent();
      });
      this.setView(newMode);
    }
  },
  mounted: function() {
    this.setView(this.mode);
  },
  methods: {
    setView: function(mode) {
      let self = this;

      if (self.split) self.split.destroy();

      Vue.nextTick(function() {
        if (mode == "design") {
          self.split = Split(
            [
              self.$refs.viewport.$el,
              self.$refs.sidebar1.$el,
              self.$refs.sidebar2.$el
            ],
            {
              direction: "horizontal",
              sizes: [60, 20, 20]
            }
          );
        } else if (mode == "live") {
          self.split = Split(
            [
              self.$refs.sidebar0.$el,
              self.$refs.viewport.$el,
              self.$refs.sidebar3.$el
            ],
            {
              direction: "horizontal",
              sizes: [30, 40, 30]
            }
          );
        } else if (mode == "io") {
          self.split = Split(
            [
              self.$refs.io.$el
            ],
            {
              direction: "horizontal",
              sizes: [100]
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  --header-height: 50px;
  --footer-height: 30px;

  height: 100%;
  font-family: sans-serif;
  font-size: 14px;
  overflow: hidden;
}

button {
  padding: 5px;
  background: #cccccc;
  border: none;
  cursor: pointer;
  border: 2px solid #cccccc;

  &:hover {
    background: #aaaaaa;
  }

  &.active {
    border: 2px solid cyan;
    background: #aaaaaa;
  }

  &.small {
    font-size: 0.75em;
    padding: 2.5px 5px;
  }

  &[disabled]:hover {
    background: #cccccc;
    cursor: default;
  }
}

.app {
  height: 100%;
  background: radial-gradient(#cccccc, #333333);
  color: #ffffff;
}

.header {
  width: 100%;
  height: var(--header-height);
}

.main {
  width: 100%;
  overflow: hidden;
  height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--footer-height);
}

.sidebar {
  height: calc(100vh - var(--header-height) - var(--footer-height));
}

.gutter-horizontal {
  background: no-repeat center center
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
  cursor: col-resize;
}

.gutter-vertical {
  background: no-repeat center center
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
  cursor: row-resize;
}

body > canvas {
  position: absolute;
  bottom: var(--footer-height);
  display: none;
}
</style>
