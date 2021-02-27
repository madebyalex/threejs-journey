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
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength); // Black & white stripes, with wider black stripes, left to right

    // Pattern 10-2
    // float strengthX = mod(vUv.x * 10.0, 1.0);
    // strengthX = step(0.8, strengthX);

    // float strengthY = mod(vUv.y * 10.0, 1.0);
    // strengthY = step(0.8, strengthY); // Green / purple grid

    // Pattern 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0)); // White grid

    // Pattern 12
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); // Dotted grid, white dots on black

    // Pattern 13
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); // White dashes grid

    // Pattern 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barX + barY; // White angles

    // Pattern 14-2
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.8, mod(vUv.x * 5.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 5.0, 1.0));

    // float strength = barX + barY; // S-like patterns

    // Pattern 15
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));

    // float strength = barX + barY; // White plus signs

    // Pattern 15-2
    // float strength = vUv.x - 0.5;
    // strength *= vUv.y - 0.5; // Highlighted corners with radial white gradients

    // Pattern 16
    // float strength = abs(vUv.x - 0.5);

    // Pattern 16-2
    // float strength = abs(vUv.x - 0.5);
    // strength += abs(vUv.y - 0.5); // Black star

    // Pattern 17
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5)); // Double angle gradients

    // Pattern 18
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)); // Diagonal dark star

    // Pattern 18-2
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) / max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)); // Bright double angle gradients

    // Pattern 19
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))); // Black square in the center

    // Pattern 19-2
    // float strength = step(0.05, min(abs(vUv.x - 0.5), abs(vUv.y - 0.5))); // Window-like cross

    // Pattern 19-3
    // float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))); // Wide white frame

    // Pattern 20
    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = square1 * square2; // White frame inside a black square

    // Pattern 21
    // float strength = floor(vUv.x * 10.0) / 10.0; // Stepped gradient

    // Pattern 21-2
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // strength *= floor(vUv.y * 10.0) / 10.0; // Stepped gradient with a grid

    // Pattern 21-3
    float strength = floor(vUv.x * 10.0) / 10.0;
    strength += floor(vUv.y * 10.0) / 10.0; // Angled stepped gradient with a grid

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}