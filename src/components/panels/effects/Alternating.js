import Default from "./Default.js";

class Alternating extends Default {
    constructor() {
        super({
            variables: [],
            properties: {
                color: new THREE.Uniform(new THREE.Vector3(Math.random(), Math.random(), Math.random())),
                speed: new THREE.Uniform(1.0)
            },
            shaderParameters: [
                "uniform vec3 color;",
                "uniform float speed;"
            ].join("\n"),
            shader:
                `
                vec3 effectColor = vec3(0.0, 0.0, 0.0);
                if (mod(LEDIndex + floor(time / (1000.0 / speed)), 2.0) > 0.0) {
                    effectColor = color;
                }
                `
        });

        this.type = "Alternating";
        this.name = "Alternating";
    }
}

export default Alternating;