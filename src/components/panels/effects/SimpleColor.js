const THREE = require("three");

export default function () {
    this.uuid = THREE.Math.generateUUID().replace(/-/g, "");
    this.type = "SimpleColor";
    this.name = "Simple Color";
    this.properties = {
        color: new THREE.Uniform(new THREE.Color(0x00ffff)),
        opacity: new THREE.Uniform(1.0)
    };
    this.shaderParameters = [
        "uniform vec3 color;",
        "uniform float opacity;"
    ].join("\n");
    this.shader = [
        "vColor *= (1.0 - opacity) + vec4(color, 1.0) * opacity;"
    ].join("\n");
}