import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export const MicrophoneLightGradient = ({ scene }) => {
  const meshRef = useRef()

  useEffect(() => {
    const microphoneLight = scene.getObjectByName('microphone_light')
    if (microphoneLight) {
      const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
      
          vec3 interpolateColor(float progress) {
            vec3 colors[6];
            colors[0] = vec3(251.0, 12.0, 69.0) / 255.0; // #FB0C45
            colors[1] = vec3(171.0, 8.0, 235.0) / 255.0; // #AB08EB
            colors[2] = vec3(24.0, 90.0, 255.0) / 255.0; // #185AFF
            colors[3] = vec3(0.0, 237.0, 252.0) / 255.0; // #00EDFC
            colors[4] = vec3(15.0, 238.0, 57.0) / 255.0; // #0FEE39
            colors[5] = vec3(206.0, 232.0, 83.0) / 255.0; // #CEE853
      
            progress = mod(progress, 1.0);
            float totalColors = 6.0;
            float colorIndex = floor(progress * totalColors);
            float fractionalPart = fract(progress * totalColors);
      
            vec3 color1 = colors[int(colorIndex)];
            vec3 color2 = colors[int(mod(colorIndex + 1.0, totalColors))];
      
            return mix(color1, color2, fractionalPart);
          }
      
          void main() {
            float progress = mod(time * 0.05, 1.0);
            float yProgress = mod(vUv.y * 0.5 + progress, 1.0);
            vec3 color = interpolateColor(yProgress);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        uniforms: {
          time: { value: 0.0 },
        },
      })

      microphoneLight.material = shaderMaterial
      meshRef.current = microphoneLight
    }
  }, [scene])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const shader = meshRef.current.material
      shader.uniforms.time.value = clock.elapsedTime * 0.25
    }
  })

  return null
}
