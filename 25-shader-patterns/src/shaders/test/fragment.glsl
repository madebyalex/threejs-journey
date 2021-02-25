varying vec2 vUv;

void main()
{
    // gl_FragColor = vec4(vUv, 1.0, 1.0); // Blue - Cyan - Purple
    // gl_FragColor = vec4(1.0, vUv, 1.0); // Nice warm, reddish palette
    // gl_FragColor = vec4(vUv, 0.0, 1.0); // Dirty green-to-red
    // gl_FragColor = vec4(vUv, 0.5, 1.0); // Blue - Light green - Pink
    // gl_FragColor = vec4(1.0, vUv.x, vUv.x, 1.0); // Red-to-white linear gradient
    // gl_FragColor = vec4(vUv.y, 1.0, vUv.x, 1.0); // Lime-green to Cyan
    // gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0); // Black to white, left to right

    // Pattern 3
    // float strength = vUv.x; // Black to white, left to right
    
    // Pattern 4
    // float strength = vUv.y; // Black to white, bottom to top, gradient

    // Pattern 5
    // float strength = 1.0 - vUv.y; // Black to white, top to bottom, gradient

    // Pattern 6
    // float strength = vUv.y * 10.0; // Black to white, 10% to top, gradient

    // Pattern 7
    // float strength = mod(vUv.y * 10.0, 1.0); // Black to white, 10% to top, repeated gradient

    // Pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.5, strength); // Black & white stripes

    // Pattern 9
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength); // Black & white stripes, with wider black stripes

    // Pattern 10
    float strength = mod(vUv.x * 10.0, 1.0);
    strength = step(0.8, strength); // Black & white stripes, with wider black stripes, left to right

    // Pattern 10-2
    float strengthX = mod(vUv.x * 10.0, 1.0);
    strengthX = step(0.8, strengthX);

    float strengthY = mod(vUv.y * 10.0, 1.0);
    strengthY = step(0.8, strengthY); // Green / purple grid

    gl_FragColor = vec4(strengthX, strengthY, strengthX, 1.0);
}