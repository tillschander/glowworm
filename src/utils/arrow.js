export default {
    headLength: 5,
    headWidth: 2,
    wouldBeCircularConnection: function (from, to, scene) {
        let nextLED = scene.getObjectByProperty("uuid", to.userData.nextLED);

        while (nextLED) {
            if (nextLED.uuid == from.uuid) return true;
            nextLED = scene.getObjectByProperty("uuid", nextLED.userData.nextLED);
        }

        return false;
    },
    drawArrow: function (from, to) {
        let fromPosition = from.getWorldPosition(new THREE.Vector3());
        let toPosition = to.getWorldPosition(new THREE.Vector3());
        let direction = toPosition.clone().sub(fromPosition);
        let length = direction.length();
        let arrow = new THREE.ArrowHelper(direction.normalize(), fromPosition, length, 0x00ffff, this.headLength, this.headWidth);

        arrow.userData.type = 'Arrow';
        arrow.userData.from = from;
        arrow.userData.to = to;

        return arrow;
    },
    updateArrow: function (from, to) {
        let fromPosition = from.getWorldPosition(new THREE.Vector3());
        let toPosition = to.getWorldPosition(new THREE.Vector3());
        let direction = toPosition.clone().sub(fromPosition);
        let length = direction.length();

        from.userData.nextLEDArrow.setDirection(direction.normalize());
        from.userData.nextLEDArrow.setLength(length, this.headLength, this.headWidth);
        from.userData.nextLEDArrow.position.copy(fromPosition);
    }
};