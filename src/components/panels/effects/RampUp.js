import Default from "./Default.js";

class RampUp extends Default {
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
                if ( LEDIndex < mod((time / (1000.0 / speed)), 40.0)) {
                    effectColor = color;
                }
                `
        });

        this.type = "RampUp";
        this.name = "Ramp Up";
    }
}

export default RampUp;