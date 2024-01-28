import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export function Piano({ scene }) {
  // Audio setup
  const audioLoader = useRef(new THREE.AudioLoader())
  const listener = useRef(new THREE.AudioListener())
  const sound = useRef(new THREE.Audio(listener.current))

  const playSound = (keyName) => {
    const audioFileName = `piano/${keyName}.mp3`

    if (sound.current.isPlaying) {
      sound.current.stop()
    }

    console.log('🎵 playing', audioFileName)
    audioLoader.current.load(
      audioFileName,
      (buffer) => {
        sound.current.setBuffer(buffer)
        sound.current.setLoop(false)
        sound.current.setVolume(0.5)
        sound.current.play()
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the audio:', error)
      },
    )
  }

  const keyMeshes = scene.children.filter(
    (child) => child.name.startsWith('piano_key_') || child.name.includes('_black_key'),
  )

  return (
    <>
      {keyMeshes.map((keyMesh, i) => {
        const keyName = `key_${21 + i}` // Calculate the keyName for each keyMesh
        return (
          <mesh
            key={keyMesh.name}
            onPointerDown={() => playSound(keyName)} // Use keyName here
            geometry={keyMesh.geometry}
            material={keyMesh.material}
            position={keyMesh.position}
            rotation={keyMesh.rotation}
            scale={keyMesh.scale}
          />
        )
      })}
    </>
  )
}
