import Default from "./Default.js";

class Wave extends Default {
    constructor() {
        super({
            variables: ["relativeWidth", "sinewave"],
            properties: {
                color: new THREE.Uniform(new THREE.Vector3(Math.random(), Math.random(), Math.random())),
                frequency: new THREE.Uniform(5.0),
                waveLength: new THREE.Uniform(0.5),
                length: new THREE.Uniform(50.0)
            },
            shaderParameters: [
                "uniform float frequency;",
                "uniform float waveLength;",
                "uniform float length;",
                "uniform vec3 color;",
            ].join("\n"),
            shader: `
                float relativeWidth = length / (3.141592 * (1.0 - waveLength));
                float sinewave = (sin(time / 1000.0 * frequency + LEDPosition.x / relativeWidth) + 1.0) / 2.0;
                vec3 effectColor = color * sinewave;
            `,
        });

        this.type = "Wave";
        this.name = "Wave";
    }
}

export default Wave;