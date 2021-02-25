varying vec2 vUv;

void main()
{
    // gl_FragColor = vec4(vUv, 1.0, 1.0); // Blue - Cyan - Purple
    // gl_FragColor = vec4(1.0, vUv, 1.0); // Nice warm, reddish palette
    // gl_FragColor = vec4(vUv, 0.0, 1.0); // Dirty green-to-red
    // gl_FragColor = vec4(vUv, 0.5, 1.0); // Blue - Light green - Pink
    // gl_FragColor = vec4(1.0, vUv.x, vUv.x, 1.0); // Red-to-white linear gradient
    // gl_FragColor = vec4(vUv.y, 1.0, vUv.x, 1.0); // Lime-green to Cyan
    gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0); // Black to white, left to right
}