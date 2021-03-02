uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

varying float vElevation;

void main() {
  vec3 mixedColor = mix(uDepthColor, uSurfaceColor * 3.0, vElevation);

  gl_FragColor = vec4(mixedColor, vElevation);
}