import Default from "./Default.js";

class CustomCode extends Default {
    constructor() {
        super({
            properties: {},
            shaderParameters: "",
            shader: "vec3 effectColor = vec3(0.0, 0.0, 0.0); if (masked < 0.5) { vColor.rgb = blendByMode(blendMode, opacity, vColor.rgb, effectColor); }",
        });

        this.type = "CustomCode";
        this.name = "Custom Code";
    }
}

export default CustomCode;