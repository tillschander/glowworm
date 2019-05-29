const THREE = require("three");
import Default from "./Default.js";

class SimpleColor extends Default {
    constructor() {
        super({
            properties: {
                color: new THREE.Uniform(new THREE.Vector3(Math.random(), Math.random(), Math.random()))
            },
            shaderParameters: "uniform vec3 color;",
            shader: "vec3 effectColor = color;",
        });

        this.type = "SimpleColor";
        this.name = "Simple Color";
    }
}

export default SimpleColor;