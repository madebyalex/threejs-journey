uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

// ${THREE.ShaderChunk[ "common" ]}
// ${THREE.ShaderChunk[ "fog_pars_fragment" ]}

void main() {
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 mixedColor = mix(uDepthColor, uSurfaceColor, mixStrength);

  gl_FragColor = vec4(mixedColor, vElevation);
  // ${THREE.ShaderChunk[ "fog_fragment" ]}
}