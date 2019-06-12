import arrowUtil from '../../utils/arrow.js';

export default {
  state: {
    origin: new THREE.Mesh(new THREE.OctahedronBufferGeometry(3), new THREE.MeshBasicMaterial({ color: 0x00ffff })),
    toConnect: [],
    showConnections: true,
    arrows: [],
    connectArrow: new THREE.ArrowHelper(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), 0, 0x00ffff, arrowUtil.headLength, arrowUtil.headWidth)
  },
  mutations: {
    setShowConnections: function (state, bool) {
      state.showConnections = bool;
      state.arrows.forEach(arrow => {
        arrow.line.material.visible = state.showConnections;
        arrow.cone.material.visible = state.showConnections;
      });
      state.origin.visible = state.showConnections;
    },
    handleConnectClick: function (state, { intersects, pointer }) {
      let leds = intersects.filter(e => ["LED", "Origin"].indexOf(e.object.userData.type) > -1);

      if (leds.length) {
        let led = leds[0].object;

        if (led.userData.type == "LED" || state.toConnect.length == 0) {
          state.toConnect.push(led);
          state.connectArrow.visible = true;
          this.dispatch("updateConnectArrow", { led, pointer: pointer });
        }
      } else {
        state.toConnect = [];
        state.connectArrow.visible = false;
      }

      if (state.toConnect.length > 1) {
        this.dispatch("connectFromTo", { from: state.toConnect[0], to: state.toConnect[1] });
        state.toConnect = [];
        state.connectArrow.visible = false;
      }
    },
    handleDisconnectClick: function (state, intersects) {
      let arrows = intersects.filter(
        entry => entry.object.parent.userData.type == "Arrow"
      );

      if (arrows.length) this.dispatch("removeConnection", arrows[0].object.parent);
    },
  },
  actions: {
    updateSingleLEDConnections: function ({ state, rootState }, currentLED) {
      const previousLED = currentLED.userData.previousLED;
      const nextLED = currentLED.userData.nextLED;

      if (previousLED) arrowUtil.updateArrow(previousLED, currentLED);
      if (nextLED) arrowUtil.updateArrow(currentLED, nextLED);
    },
    updateLEDConnections: function ({ state, rootState }, objects) {
      objects.forEach(object => {
        if (object.userData.type == 'LED' || object.userData.type == 'Origin') {
          this.dispatch("updateSingleLEDConnections", object);
        } else if (object.userData.type == 'Group' && object.userData.groupType == 'LED') {
          object.children.forEach(led => this.dispatch("updateSingleLEDConnections", led));
        }
      });
    },
    connectFromTo: function ({ state, rootState }, { from, to }) {
      if (from.uuid == to.uuid) return;

      this.dispatch("disconnectNext", from);
      this.dispatch("disconnectPrev", to);

      if (from.userData.previousLED == to.uuid) {
        this.dispatch("disconnectNext", to);
        this.dispatch("disconnectPrev", from);
      }

      if (arrowUtil.wouldBeCircularConnection(from, to)) {
        this.dispatch("disconnectNext", to);
      }

      let arrow = arrowUtil.drawArrow(from, to);
      to.userData.previousLED = from;
      to.userData.previousLEDArrow = arrow;
      from.userData.nextLED = to;
      from.userData.nextLEDArrow = arrow;
      arrow.line.material.visible = state.showConnections;
      arrow.cone.material.visible = state.showConnections;

      rootState.scene.add(arrow);
      state.arrows.push(arrow);
    },
    connectMaybe: function ({ state, rootState, rootGetters }, led) {
      if (rootGetters.LEDs.length > 1) {
        if (rootGetters.activeElement && rootGetters.activeElement.userData.type == 'LED') {
          this.dispatch("connectFromTo", { from: rootGetters.activeElement, to: led });
        } else {
          let previousLED = rootState.scene.getObjectByProperty('uuid', rootGetters.LEDs[rootGetters.LEDs.length - 2].uuid);

          if (previousLED.userData.type !== 'Group') {
            this.dispatch("connectFromTo", { from: previousLED, to: led });
          }
        }
      } else {
        this.dispatch("connectFromTo", { from: state.origin, to: led });
      }
    },
    disconnectBoth: function ({ state, rootState }, led) {
      this.dispatch("disconnectNext", led);
      this.dispatch("disconnectPrev", led);
    },
    disconnectNext: function ({ state, rootState }, led) {
      const nextLED = led.userData.nextLED;

      rootState.scene.remove(led.userData.nextLEDArrow);
      state.arrows = state.arrows.filter(arrow => arrow !== led.userData.nextLEDArrow);

      if (nextLED) {
        nextLED.previousLED = undefined;
        nextLED.previousLEDArrow = undefined;
      }

      led.userData.nextLED = undefined;
      led.userData.nextLEDArrow = undefined;
    },
    disconnectPrev: function ({ state, rootState }, led) {
      const previousLED = led.userData.previousLED;

      rootState.scene.remove(led.userData.previousLEDArrow);
      state.arrows = state.arrows.filter(arrow => arrow !== led.userData.previousLEDArrow);

      if (previousLED) {
        previousLED.nextLED = undefined;
        previousLED.nextLEDArrow = undefined;
      }

      led.userData.previousLED = undefined;
      led.userData.previousLEDArrow = undefined;
    },
    updateConnectArrow: function ({ state, rootState }, { led, pointer }) {
      // https://stackoverflow.com/questions/36033879/three-js-object-follows-mouse-position
      let LEDPosition = led.getWorldPosition(new THREE.Vector3());
      let vector = new THREE.Vector3(pointer.x, pointer.y, 1);
      vector.unproject(rootState.camera);
      let dir = vector.sub(rootState.camera.position).normalize();
      let distance = -rootState.camera.position.z / dir.z;
      let pointerPosition = rootState.camera.position
        .clone()
        .add(dir.multiplyScalar(distance));
      let direction = pointerPosition.clone().sub(LEDPosition);
      let length = direction.length();

      state.connectArrow.setDirection(direction.normalize());
      state.connectArrow.setLength(length, arrowUtil.headLength, arrowUtil.headWidth);
      state.connectArrow.position.copy(LEDPosition);

      // state.connectArrow.line.material.depthTest = false;
      // state.connectArrow.line.renderOrder = 10;
      // state.connectArrow.cone.material.depthTest = false;
      // state.connectArrow.cone.renderOrder = 10;
    },
    removeConnection: function ({ state, rootState }, arrow) {
      this.dispatch("disconnectNext", arrow.userData.from);
      this.dispatch("disconnectPrev", arrow.userData.to);
    },
    initConnection: function ({ state, rootState }) {
      state.origin.position.set(0, -20, 0);
      state.origin.userData.type = 'Origin';
      state.connectArrow.visible = false;
      rootState.scene.add(state.origin);
      rootState.scene.add(state.connectArrow);
    }
  }
}
