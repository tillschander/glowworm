export default {
    getCenter: function(objects) {
      let center = new THREE.Vector3();

      objects.forEach(child => {
        center.add(child.position);
      });
      center.divideScalar(objects.length);

      return center;
    }
};