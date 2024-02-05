import React from 'react'
import { Text, Billboard, Plane } from '@react-three/drei'
import * as THREE from 'three'

export const BillboardText = ({ position, text, width, height }) => {
  const rectangleColor = 'black'
  const opacity = 0.5

  return (
    <group position={position}>
      <Billboard>
        <Plane args={[width, height]} position={[0, 0, -0.02]}>
          {' '}
          <meshBasicMaterial
            attach='material'
            color={rectangleColor}
            transparent={true}
            opacity={opacity}
            depthTest={false}
            depthWrite={false}
          />
        </Plane>
        <Text fontSize={0.085} color='white' depthTest={false}>
          {text}
        </Text>
      </Billboard>
    </group>
  )
}
