import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Screens } from './Screens'
import { Nanoleaf } from './Nanoleaf'
import { Piano } from './Piano'
import { Guitar } from './Guitar'
import { MicrophoneLightGradient } from './MicrophoneLightGradient'
import { BillboardText } from './BillboardText'

export function Office(props) {
  const { scene } = useGLTF('/office.glb')

  return (
    <>
      <primitive object={scene} {...props}>
        <Screens scene={scene} />
        <BillboardText position={[-1.7, 1.35, 0.95]} text='Play me' width={0.4} height={0.17} />
        <Piano scene={scene} />
        <BillboardText position={[-1.7, 1.35, 2.4]} text='Play me' width={0.4} height={0.17} />
        <Guitar scene={scene} />
        <>
          <Nanoleaf scene={scene} />
          <MicrophoneLightGradient scene={scene} />
        </>
      </primitive>
    </>
  )
}
