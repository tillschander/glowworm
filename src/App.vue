<template>
  <div id="app" class="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <Header class="header"/>
    <ToolsSidebar class="tools-sidebar"/>
    <div class="main">
      <Viewport ref="viewport"/>
      <Sidebar ref="sidebar1">
        <SceneSidebar slot="top"/>
        <PropertiesSidebar slot="bottom"/>
      </Sidebar>
      <Sidebar ref="sidebar2" v-if="this.mode == 'animations'">
        <SceneSidebar slot="top"/>
        <EffectsSidebar slot="bottom"/>
      </Sidebar>
    </div>
    <Footer class="footer"/>
  </div>
</template>

<script>
import Vue from "vue";
import Header from "./components/Header.vue";
import ToolsSidebar from "./components/ToolsSidebar.vue";
import Viewport from "./components/Viewport.vue";
import SceneSidebar from "./components/SceneSidebar.vue";
import PropertiesSidebar from "./components/PropertiesSidebar.vue";
import EffectsSidebar from "./components/EffectsSidebar.vue";
import Footer from "./components/Footer.vue";
import Sidebar from "./components/Sidebar.vue";
import Split from "split.js";

export default {
  name: "app",
  components: {
    Header,
    ToolsSidebar,
    Viewport,
    SceneSidebar,
    PropertiesSidebar,
    EffectsSidebar,
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
      this.setView(newMode);
    }
  },
  mounted: function() {
    this.split = Split([this.$refs.viewport.$el, this.$refs.sidebar1.$el], {
      sizes: [75, 25]
    });
  },
  methods: {
    setView: function(mode) {
      let self = this;
      self.split.destroy();
      Vue.nextTick(function() {
        if (mode == "animations") {
          self.split = Split(
            [
              self.$refs.viewport.$el,
              self.$refs.sidebar1.$el,
              self.$refs.sidebar2.$el
            ],
            {
              sizes: [50, 25, 25]
            }
          );
        } else {
          self.split = Split(
            [self.$refs.viewport.$el, self.$refs.sidebar1.$el],
            {
              sizes: [75, 25]
            }
          );
        }
      });
    }
  }
};
</script>

<style>
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

.tools-sidebar {
  min-width: 50px;
  position: fixed;
}

.gutter-horizontal {
  background: no-repeat center center
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
  cursor: row-resize;
}

.gutter-vertical {
  background: no-repeat center center
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
  cursor: row-resize;
}
</style>
