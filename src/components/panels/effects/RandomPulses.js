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
        "vec4 worldCoord = modelMatrix * vec4( LEDPosition, 1.0 );",

        "vec2 resolution = vec2(30.0, 30.0);",
        "vec2 st = worldCoord.xz/resolution.xy;",
        "st.x *= resolution.x/resolution.y;",

        "vec2 blocks_st = floor(st*6.);",
        "float t = (time/1000.0)*speed + random(blocks_st);",
        "float time_i = floor(t);",
        "float time_f = fract(t);",
        "vColor = vec4(vec3(random(blocks_st+time_i)*(1.0-time_f)), 1.0);",
    ].join("\n");
}