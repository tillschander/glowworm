const THREE = require("three");

export default function () {
    this.uuid = THREE.Math.generateUUID().replace(/-/g, "");
    this.type = "Pulse";
    this.name = "Pulse";
    this.properties = {
        frequency: new THREE.Uniform(500.0)
    };
    this.shaderParameters = ["uniform float frequency;"].join("\n");
    this.shader = ["vColor *= vec4(sin(time/frequency));"].join("\n");
}