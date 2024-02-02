import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Screens } from './Screens'
import { Nanoleaf } from './Nanoleaf'
import { Piano } from './Piano'
import { MicrophoneLightGradient } from './MicrophoneLightGradient'

export function Office(props) {
  const { scene } = useGLTF('/office.glb')

  return (
    <>
      <primitive object={scene} {...props}>
        <Screens scene={scene} />
        <Piano scene={scene} />
        <>
          <Nanoleaf scene={scene} />
          <MicrophoneLightGradient scene={scene} />
        </>
      </primitive>
    </>
  )
}
