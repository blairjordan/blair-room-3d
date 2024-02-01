import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function Avatar(props) {
  const { scene, animations } = useGLTF('/avatar.glb')
  const mixer = useRef()

  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(scene)

    const action = mixer.current.clipAction(animations.pop())
    action.play()

    return () => {
      mixer.current.stopAllAction()
    }
  }, [scene, animations])

  useFrame((state, delta) => {
    mixer.current.update(delta)
  })

  return <primitive object={scene} {...props} />
}
