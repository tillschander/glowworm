const THREE = require("three");

export default function () {
    this.uuid = THREE.Math.generateUUID().replace(/-/g, "");
    this.type = "RandomPulses";
    this.name = "Random Pulses";
    this.properties = {
        speed: new THREE.Uniform(0.8)
    };
    this.shaderParameters = [
        "uniform float speed;",
    ].join("\n");
    this.shader = [
        // based on https://thebookofshaders.com/edit.php#10/ikeda-simple-grid.frag
        "float t = (time/1000.0)*speed + random(LEDIndex);",
        "float time_i = floor(t);",
        "float time_f = fract(t);",
        "vColor.rgb *= random(LEDIndex+time_i) * (1.0-time_f);",
    ].join("\n");
}