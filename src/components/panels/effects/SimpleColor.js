const THREE = require("three");

export default function () {
    this.uuid = THREE.Math.generateUUID().replace(/-/g, "");
    this.type = "SimpleColor";
    this.name = "Simple Color";
    this.properties = {
        color: new THREE.Uniform(new THREE.Vector3(0,1,1)),
        opacity: new THREE.Uniform(1.0)
    };
    this.shaderParameters = [
        "uniform vec3 color;",
        "uniform float opacity;"
    ].join("\n");
    this.shader = [
        "vColor.rgb = vColor.rgb * (1.0 - opacity) + color * opacity;"
    ].join("\n");
}