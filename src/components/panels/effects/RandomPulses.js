import Default from "./Default.js";

class RandomPulses extends Default {
    constructor() {
        super({
            variables: ["ledTime", "timeInt", "timeFract"],
            properties: {
                frequency: new THREE.Uniform(0.8),
                amount: new THREE.Uniform(0.5),
                color: new THREE.Uniform(new THREE.Vector3(Math.random(), Math.random(), Math.random()))
            },
            shaderParameters: [
                "uniform float frequency;",
                "uniform float amount;",
                "uniform vec3 color;"
            ].join("\n"),
            shader:
                // based on https://thebookofshaders.com/edit.php#10/ikeda-simple-grid.frag
                `
                float ledTime = (time/1000.0)*frequency + random(LEDIndex);
                float timeInt = floor(ledTime);
                float timeFract = fract(ledTime);
                vec3 effectColor = color * step(1.0-amount, random(LEDIndex+timeInt)) * (1.0-timeFract);
                `
        });

        this.type = "RandomPulses";
        this.name = "Random Pulses";
    }
}

export default RandomPulses;