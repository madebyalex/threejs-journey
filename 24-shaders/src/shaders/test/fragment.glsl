precision mediump float;

varying float vRandom;

void main() {
    gl_FragColor = vec4(vRandom * 0.5, vRandom, 1.0, 1);
}