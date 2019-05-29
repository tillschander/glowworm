const THREE = require("three");

class Default {
    constructor({ variables = [], properties = {}, shaderParameters = "", shader = "" } = {}) {
        this.uuid = THREE.Math.generateUUID().replace(/-/g, "");
        this.type = "Default";
        this.name = "Default";
        this.variables = ["effectColor"].concat(variables);
        this.properties = Object.assign({
            blendMode: new THREE.Uniform(0),
            opacity: new THREE.Uniform(1.0)
        }, properties);
        this.shaderParameters = shaderParameters + "uniform int blendMode; uniform float opacity;";
        this.shader = shader + "vColor.rgb = blendByMode(blendMode, opacity, vColor.rgb, effectColor);";
    }
}

export default Default;