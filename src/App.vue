<template>
  <div id="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <Header />
    <div>
      <ToolsSidebar/>
      <Viewport/>
      <PropertiesSidebar v-bind:objectProperties="objectProperties"/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import ToolsSidebar from "./components/ToolsSidebar.vue";
import Viewport from "./components/Viewport.vue";
import PropertiesSidebar from "./components/PropertiesSidebar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    ToolsSidebar,
    Viewport,
    PropertiesSidebar,
    Footer
  },
  computed: {
    objectProperties: function() {
      if (this.selectedObject) {
        console.log(this.selectedObject.material);
      }
      return "foobar";
    }
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
</style>
