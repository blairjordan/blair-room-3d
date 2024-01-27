import * as THREE from 'three'
import { useContext } from 'react'
import { useGLTF } from '@react-three/drei'
import { Screens } from './Screens'
import { Nanoleaf } from './Nanoleaf'
import { Piano } from './Piano'

export function Office(props) {
  const { scene } = useGLTF('/office.glb')

  return (
    <>
      <primitive object={scene} {...props} />
      <Screens scene={scene} />
      <Nanoleaf scene={scene} />
      <Piano scene={scene} />
    </>
  )
}
