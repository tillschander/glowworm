<template>
  <div id="app" class="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <Header />
    <div>
      <ToolsSidebar />
      <Viewport />
      <SceneSidebar />
      <PropertiesSidebar v-if="this.$store.state.activeObject && this.$store.state.mode == 'layout'" />
      <EffectsSidebar v-if="this.$store.state.mode == 'animations'" />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import ToolsSidebar from "./components/ToolsSidebar.vue";
import Viewport from "./components/Viewport.vue";
import SceneSidebar from "./components/SceneSidebar.vue";
import PropertiesSidebar from "./components/PropertiesSidebar.vue";
import EffectsSidebar from "./components/EffectsSidebar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    ToolsSidebar,
    Viewport,
    SceneSidebar,
    PropertiesSidebar,
    EffectsSidebar,
    Footer
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
    height: 100%;
    color: #ffffff;
}

.app {
    background: radial-gradient(#cccccc, #333333);
    height: 100%;
}
</style>
