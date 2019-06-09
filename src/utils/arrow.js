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
        let length = direction.length() + this.headLength;
        let arrow = new THREE.ArrowHelper(direction.normalize(), fromPosition, length, 0x00ffff, this.headLength, this.headWidth);

        // show arrowhead only if enough space
        arrow.visible = (length - this.headLength > 0) ? true : false;
        arrow.children[1].visible = false;
        if (length >= this.headLength*3) {
            arrow.setLength(length -= this.headLength*1.5, this.headLength, this.headWidth);
            arrow.children[1].visible = true;
        }

        arrow.userData.type = 'Arrow';
        arrow.userData.from = from;
        arrow.userData.to = to;

        return arrow;
    },
    updateArrow: function (from, to) {
        let fromPosition = from.getWorldPosition(new THREE.Vector3());
        let toPosition = to.getWorldPosition(new THREE.Vector3());
        let direction = toPosition.clone().sub(fromPosition);
        let length = direction.length() + this.headLength;

        // show arrowhead only if enough space
        from.userData.nextLEDArrow.visible = (length - this.headLength > 0) ? true : false;
        from.userData.nextLEDArrow.children[1].visible = false;
        if (length >= this.headLength*3) {
            length -= this.headLength*1.5;
            from.userData.nextLEDArrow.children[1].visible = true;
        }

        from.userData.nextLEDArrow.setDirection(direction.normalize());
        from.userData.nextLEDArrow.setLength(length, this.headLength, this.headWidth);
        from.userData.nextLEDArrow.position.copy(fromPosition);
    }
};