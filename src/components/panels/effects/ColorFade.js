import Default from "./Default.js";

class ColorFade extends Default {
    constructor() {
        super({
            variables: [],
            properties: {
                color1: new THREE.Uniform(new THREE.Vector3(Math.random(), Math.random(), Math.random())),
                color2: new THREE.Uniform(new THREE.Vector3(Math.random(), Math.random(), Math.random())),
                speed: new THREE.Uniform(1.0)
            },
            shaderParameters: [
                "uniform vec3 color1;",
                "uniform vec3 color2;",
                "uniform float speed;"
            ].join("\n"),
            shader:
                `
                vec3 effectColor = mix(color1, color2, (sin(time / 1000.0 * speed) + 1.0) / 2.0);
                `
        });

        this.type = "ColorFade";
        this.name = "Color Fade";
    }
}

export default ColorFade;