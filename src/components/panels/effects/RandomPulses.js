import Default from "./Default.js";

class RandomPulses extends Default {
    constructor() {
        super({
            variables: ["ledTime", "timeInt", "timeFract"],
            properties: {
                speed: new THREE.Uniform(0.8)
            },
            shaderParameters: "uniform float speed;",
            shader:
                // based on https://thebookofshaders.com/edit.php#10/ikeda-simple-grid.frag
                `
                float ledTime = (time/1000.0)*speed + random(LEDIndex);
                float timeInt = floor(ledTime);
                float timeFract = fract(ledTime);
                vec3 effectColor = vec3(random(LEDIndex+timeInt) * (1.0-timeFract));
                `
        });

        this.type = "RandomPulses";
        this.name = "Random Pulses";
    }
}

export default RandomPulses;