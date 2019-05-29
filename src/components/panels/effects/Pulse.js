const THREE = require("three");
import Default from "./Default.js";

class Pulse extends Default {
    constructor() {
        super({
            properties: {
                frequency: new THREE.Uniform(500.0)
            },
            shaderParameters: "uniform float frequency;",
            shader: "vec3 effectColor = vec3(abs(sin(time/frequency)));",
        });

        this.type = "Pulse";
        this.name = "Pulse";
    }
}

export default Pulse;