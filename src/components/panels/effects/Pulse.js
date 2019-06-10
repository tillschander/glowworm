import Default from "./Default.js";

class Pulse extends Default {
    constructor() {
        super({
            properties: {
                color: new THREE.Uniform(new THREE.Vector3(Math.random(), Math.random(), Math.random())),
                frequency: new THREE.Uniform(500.0)
            },
            shaderParameters: [
                "uniform float frequency;",
                "uniform vec3 color;",
            ].join("\n"),
            shader: "vec3 effectColor = color * abs(sin(time/(1050.0-frequency)));",
        });

        this.type = "Pulse";
        this.name = "Pulse";
    }
}

export default Pulse;