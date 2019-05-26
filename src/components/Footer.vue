<template>
  <div>
    <div class="output-link" v-on:click="$dialog({ type: 'output', store: $store });">
      Output:
      <span class="device">{{ deviceName }}</span>
    </div>
    <div>{{ this.$store.state.fps.toFixed(2) }} FPS</div>
  </div>
</template>

<script>
import { watch } from 'fs';
export default {
  name: "Footer",
  computed: {
    deviceName: function() {
      return this.$store.state.activePort ? this.$store.state.activePort.path : 'Nothing connected';
    }
  },
};
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #333333;
  padding: 0 6px;
}

.output-link {
  cursor: pointer;
}

.device {
  text-decoration: underline;

  &:hover {
    color: #cccccc;
  }
}
</style>
