<template>
  <div class="export">
    <h2>Export to File</h2>
    <br>
    <input type="file">
    <br>
    <br>
    <br>
    <br>
    <h2>Copy/Paste Arduino Code</h2>
    <br>
    <textarea rows="15" cols="70">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit error animi illo porro veniam accusantium necessitatibus cupiditate aliquam minus atque, hic recusandae eaque mollitia qui excepturi, accusamus quasi voluptate quas?</textarea>
  </div>
</template>

<script>
export default {
  name: "Export",
  data() {
    return {};
  }
};
</script>

<style scoped>
.export {
  padding: 10px;
  background: #424242;
  width: 100%;
  height: 100%;
}
</style>
