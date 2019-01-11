<template>
  <div id="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <Header/>
    <div>
      <ToolsSidebar/>
      <Viewport/>
      <SceneSidebar/>
      <PropertiesSidebar/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import ToolsSidebar from "./components/ToolsSidebar.vue";
import Viewport from "./components/Viewport.vue";
import SceneSidebar from "./components/SceneSidebar.vue";
import PropertiesSidebar from "./components/PropertiesSidebar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    ToolsSidebar,
    Viewport,
    SceneSidebar,
    PropertiesSidebar,
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
</style>
