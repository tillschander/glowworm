export default {
    getCenter: function(objects) {
      let center = new THREE.Vector3();

      objects.forEach(child => {
        center.add(child.position);
      });
      center.divideScalar(objects.length);

      return center;
    },
    canActiveObjectTraslate: function(state, translation) {
      let activeUuids = Object.keys(state.elements.activeElements);
      let cantMove = ['Animation', 'Mask', 'Camera'];
      let cantRotate = ['LED', 'Animation', 'Mask', 'Camera', 'Origin'];
      let cantScale = ['LED', 'Animation', 'Mask', 'Camera', 'Origin'];

      if (activeUuids.length == 1) {
        let object = state.scene.getObjectByProperty("uuid", activeUuids[0]);
        let type = object.userData.type;
        
        if (translation == 'move' && cantMove.indexOf(type) > -1) return false;
        if (translation == 'rotate' && cantRotate.indexOf(type) > -1) return false;
        if (translation == 'scale' && cantScale.indexOf(type) > -1) return false;
      } else if (activeUuids.length > 1 && translation !== 'move') {
        return false;
      }
      return true;
    }
};