uniform float uTime;
uniform float uSize;

attribute float aScale;

varying vec3 vColor;

void main() {
    /**
    * Position
    */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.y += uTime;

    // Spin
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
    * Size (for size attenuation)
    */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    /**
    * Color
    */
    vColor = color;
}