let helperFunctions = [
    // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
    "float random(float n){ return fract(sin(n) * 43758.5453123); }",
    "float random2(vec2 st){ return fract(sin(dot(st.xy ,vec2(12.9898, 78.233))) * 43758.5453); }",

    // https://github.com/jamieowen/glsl-blend
    "vec3 blendByMode(int mode, float opacity, vec3 base, vec3 blend) {",
    "  if (mode == 0) {", // normal
    "    return mix(base, blend, opacity);",
    "  } else if(mode == 1) {", // darken
    "    return mix(base, min(blend, base), opacity);",
    "  } else if(mode == 2) {", // multiply
    "    return mix(base, base * blend, opacity);",
    "  } else if(mode == 3) {", // lighten
    "    return mix(base, max(blend, base), opacity);",
    "  } else if(mode == 4) {", // screen
    "    return mix(base, 1.0 - ((1.0 - base) * (1.0 - blend)), opacity);",
    "  }",
    "}",
].join("\n");

let baseVertexParamters = [
    "uniform float mixValue;",
    "uniform float globalOpacity;",
    "uniform float time;",
    "varying vec4 vColor;",
    "attribute vec3 LEDPosition;",
    "attribute float LEDIndex;",
].join("\n");

export default {
    getLEDMaterial: function (uniforms = {}, userData = {}, shaderParameters = '', shader = '') {
        return new THREE.ShaderMaterial({
            uniforms,
            side: THREE.DoubleSide,
            transparent: true,
            defines: { USE_MAP: true },
            userData,
            vertexShader: [
                baseVertexParamters,
                "varying vec2 vUv;",
                helperFunctions,
                shaderParameters,
                "void main() {",
                "  vUv = uv;",
                "  vColor = vec4(0.0, 0.0, 0.0, 1.0);",
                "  gl_Position = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);",
                "  gl_Position.xy += position.xy;",
                "  gl_Position = projectionMatrix * gl_Position;",
                shader,
                "}",
            ].join("\n"),
            fragmentShader: [
                "varying lowp vec4 vColor;",
                "uniform sampler2D ledTexture;",
                "uniform sampler2D shineTexture;",
                "varying vec2 vUv;",
                "void main() {",
                "  float brightness = max(max(vColor.r, vColor.g), vColor.b);",
                "  vec4 led = texture2D(ledTexture, vUv);",
                "  vec4 shine = texture2D(shineTexture, vUv);",
                "  gl_FragColor = led * vColor;",
                "  gl_FragColor.rgb += brightness * shine.a;",
                "}"
            ].join("\n")
        });
    },
    getBufferMaterial: function (uniforms = {}, shaderParameters = '', shader = '') {
        return new THREE.ShaderMaterial({
            uniforms,
            vertexShader: [
                baseVertexParamters,
                "uniform float width;",
                "uniform float height;",
                helperFunctions,
                shaderParameters,
                "void main() {",
                "  vColor = vec4(0.0, 0.0, 0.0, 1.0);",
                "  vec2 pos = vec2(mod(LEDIndex, width) / width, floor(LEDIndex / width) / height) * 2.0 - 1.0;",
                "  pos += 1.0 / width;",
                "  gl_PointSize = 1.0;",
                "  gl_Position = vec4(pos, 0.0, 1.0);",
                shader,
                "}",
            ].join("\n"),
            fragmentShader: [
                "varying vec4 vColor;",
                "void main() {",
                "  gl_FragColor = vColor;",
                "}",
            ].join("\n")
        });
    },
    applyAttributes: function (state, object, index) {
        let LEDPosition = Float32Array.from(object.geometry.attributes.position.array);
        let length = object.geometry.attributes.position.array.length / 3;
        let LEDIndex = Float32Array.from({ length: length }, () => index);
        let worldPosition = new THREE.Vector3();
        object.getWorldPosition(worldPosition);

        for (var i = 0; i < LEDPosition.length; i += 3) {
            LEDPosition[i] = worldPosition.x;
            LEDPosition[i + 1] = worldPosition.y;
            LEDPosition[i + 2] = worldPosition.z;
        }
        object.geometry.addAttribute('LEDPosition', new THREE.BufferAttribute(LEDPosition, 3));
        object.geometry.addAttribute('LEDIndex', new THREE.BufferAttribute(LEDIndex, 1));
        state.buffer.geometry.attributes.LEDPosition.array[index * 3] = worldPosition.x;
        state.buffer.geometry.attributes.LEDPosition.array[index * 3 + 1] = worldPosition.y;
        state.buffer.geometry.attributes.LEDPosition.array[index * 3 + 2] = worldPosition.z;
    },
    makeEffectUnique: function (originalEffect, suffix, side) {
        let effect = JSON.parse(JSON.stringify(originalEffect));

        for (const key in effect.properties) {
            let uniqueKey = key + suffix;
            let regex = new RegExp(key, "g");

            effect.shaderParameters = effect.shaderParameters.replace(
                regex,
                uniqueKey
            );
            effect.shader = effect.shader.replace(regex, uniqueKey);
            effect.properties[uniqueKey] = effect.properties[key];
            delete effect.properties[key];
        }

        effect.variables.forEach(key => {
            let uniqueKey = key + suffix;
            let regex = new RegExp(key, "g");

            effect.shader = effect.shader.replace(regex, uniqueKey);
        });

        if (side) {
            effect.shader = effect.shader.replace(new RegExp("vColor", "g"), side + "VColor");
        }

        return effect;
    }
};