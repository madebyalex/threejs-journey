#define PI 3.1415926535897932384626433832795

uniform float uTime;

varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

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

    // Pattern 22
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // strength *= floor(vUv.y * 10.0) / 10.0; // Stepped gradient with a grid

    // Pattern 22-2
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // strength += floor(vUv.y * 10.0) / 10.0; // Angled stepped gradient with a grid

    // Pattern 23
    // float strength = random(vUv); // Random noise

    // Pattern 24
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv); // Pixelated noise

    // Pattern 25
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0);
    // float strength = random(gridUv); // Skewed pixelated noise

    // Pattern 26
    // float strength = length(vUv); // Dark radial gradient at the bottom left corner

    // Pattern 26-2
    // float strength = 1.0 - length(vUv); // Light radial gradient at the bottom left corner

    // Pattern 27
    // float strength = length(vUv - 0.5); // Dark radial gradient at the center, v1
    // float strength = distance(vUv, vec2(0.5)); // Dark radial gradient at the center, v2

    // Pattern 28
    // float strength = 1.0 - distance(vUv, vec2(0.5)); // Ligth radial gradient at the center

    // Pattern 29
    // float strength = 0.015 /  distance(vUv, vec2(0.5)); // Bright small radial gradient at the center

    // Pattern 30
    // vec2 lightUv = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // float strength = 0.015 /  distance(lightUv, vec2(0.5)); // Stretched radial gradient at the center

    // Pattern 31
    // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float lightX = 0.015 /  distance(lightUvX, vec2(0.5));
    
    // vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
    // float lightY = 0.015 /  distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY; // Centered bright star

    // Pattern 32
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));

    // vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    // float lightX = 0.015 /  distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    // float lightY = 0.015 /  distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY; // Centered bright star

    // Pattern 33
    // float strength = step(0.25, distance(vUv, vec2(0.5))); // Sharp circle at the center

    // Pattern 34
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25); // Blurred donut

    // Pattern 34-2
    // float strength = step(0.12, abs(distance(vUv, vec2(0.5)) - 0.25)); // Sharp donut

    // Pattern 35
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25)); //  // Thin black circle on white

    // Pattern 36
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25)); // Thin white circle on black

    // Pattern 37
    // vec2 wavedUv = vec2(
    //     vUv.x, 
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25)); // Distorted, wavy circle

    // Pattern 38
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1, 
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25)); // Distorted silhouette with particles

    // Pattern 39
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1, 
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25)); // Distorted, more dense silhouette with particles

    // Pattern 40
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle; // Angle gradient, bottom left to top right

    // Pattern 41
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle; // Angle gradient with shifting to the center

    // Pattern 42
    // float angle = atan(vUv.x - 0.5, (vUv.y - 0.5));
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle; // Full-circle, angle gradient from the center

    // Pattern 43
    // float angle = atan(vUv.x - 0.5, (vUv.y - 0.5));
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.0;
    // angle = mod(angle, 1.0);
    // float strength = angle; // Light burst made with angle gradients

    // Pattern 44
    // float angle = atan(vUv.x - 0.5, (vUv.y - 0.5));
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle = sin(angle * 100.0);
    // float strength = angle; // Light burst made with soft gradients

    // Pattern 44-2
    // float angle = atan(vUv.x - 0.5, (vUv.y - 0.5));
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle = step(0.1, sin(angle * 100.0));
    // float strength = angle; // Light burst, sharp

    // Pattern 44-3
    // float angle = atan(vUv.x - 0.5, (vUv.y - 0.5));
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = step(0.1, sin(angle * 100.0));

    // float radius = 0.25 / sinusoid;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius)); // Thin dashed white circle on black

    // Pattern 44-4
    // float angle = atan(vUv.x - 0.5, (vUv.y - 0.5));
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 100.0);

    // float radius = 0.25 / sinusoid * 0.1;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius)); // Bright stars-like burst from the center

    // Pattern 45
    // float angle = atan(vUv.x - 0.5, (vUv.y - 0.5));
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 100.0);

    // float radius = 0.25 + sinusoid * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius)); // Wavy, distorted circle on black

    // Pattern 46
    // float strength = cnoise(vUv * 30.0); // Classic perlin noise, soft

    // Pattern 47
    // float strength = step(0.0, cnoise(vUv * 30.0)); // Classic perlin noise, sharp

    // Pattern 47-2
    // float strength = step(0.0, cnoise(vUv * 30.0 * sin(uTime * 0.1))); // Classic perlin noise, sharp, animated

    // Pattern 48
    // float strength = sin(cnoise(vUv * 10.0) * 20.0); // Double border perlin noise, blurry

    // Pattern 48-2
    // float strength = sin(cnoise(vUv * 10.0 + uTime) * 20.0 + sin(uTime * 10.0)); // Double border perlin noise, animated

    // Pattern 49
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0)); // Double border perlin noise, sharp


    gl_FragColor = vec4(strength, strength, strength, 1.0);
}