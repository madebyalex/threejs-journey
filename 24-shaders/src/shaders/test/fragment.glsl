precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 1.6 + 0.6;

    // gl_FragColor = vec4(1.0, 0.5, 0.0, 1);
    // gl_FragColor = vec4(uColor, 1);
    gl_FragColor = textureColor;
}