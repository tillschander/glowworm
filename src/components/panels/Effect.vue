<template>
  <div class="effect">
    <div class="title">
      <span>{{name}}</span>
      <span v-on:click="deleteEffect" class="delete">❌</span>
    </div>
    <component
      class="properties"
      v-bind:is="component"
      v-bind:properties="properties"
      v-bind:uuid="uuid"
    />
  </div>
</template>

<script>
export default {
  name: "Effect",
  props: ["type", "name", "properties", "uuid"],
  data() {
    return {
      component: () => import(`./effects/${this.type}.vue`)
    };
  },
  methods: {
    deleteEffect: function() {
      let index = this.$parent.animation.effects.findIndex(effect => effect.uuid == this.uuid);
      
      this.$parent.animation.effects.splice(index, 1);
      this.$store.commit("applyLEDMaterial");
    }
  }
};
</script>

<style scoped lang="scss">
.effect {
  margin-bottom: 1em;
  background: #333333;
  padding: 0 10px 0.5em 10px;
  left: -10px;
  position: relative;
  width: calc(100% + 20px);

  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 7px 10px;
    left: -10px;
    position: relative;
    width: calc(100% + 20px);
    background: rgba(0, 0, 0, 0.5);
    line-height: 1em;
  }

  .delete {
    cursor: pointer;
  }
}
</style>
