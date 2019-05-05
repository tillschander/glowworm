const THREE = require("three");

export default function () {
    this.uuid = THREE.Math.generateUUID().replace(/-/g, "");
    this.type = "RandomPulses";
    this.name = "Random Pulses";
    this.variables = ["ledTime", "timeInt", "timeFract"];
    this.properties = {
        speed: new THREE.Uniform(0.8)
    };
    this.shaderParameters = [
        "uniform float speed;",
    ].join("\n");
    this.shader = [
        // based on https://thebookofshaders.com/edit.php#10/ikeda-simple-grid.frag
        "float ledTime = (time/1000.0)*speed + random(LEDIndex);",
        "float timeInt = floor(ledTime);",
        "float timeFract = fract(ledTime);",
        "vColor.rgb *= random(LEDIndex+timeInt) * (1.0-timeFract);",
    ].join("\n");
}