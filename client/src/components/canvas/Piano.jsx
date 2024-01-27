import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useCamera } from '@react-three/drei'

export function Piano({ scene }) {
  const { camera } = useThree()

  useEffect(() => {
    const originalKeyMeshes = scene.children.filter(
      (child) => child.name.startsWith('piano_key_') || child.name.includes('_black_key'),
    )

    originalKeyMeshes.forEach((originalKeyMesh) => {
      scene.remove(originalKeyMesh)
    })
  }, [scene])

  const clonedKeyMeshes = scene.children
    .filter((child) => child.name.startsWith('piano_key_') || child.name.includes('_black_key'))
    .map((keyMesh, i) => {
      console.log('Position:', keyMesh.position)
      console.log('Rotation:', keyMesh.rotation)
      console.log('Scale:', keyMesh.scale)

      const keyName = `key_${21 + i}`
      const isBlackKey = keyMesh.name.includes('black')
      const newMaterial = new THREE.MeshBasicMaterial({ color: isBlackKey ? 0x000000 : 0xffffff })
      const geometry = keyMesh.geometry.clone()
      const position = keyMesh.position.clone()
      const scale = keyMesh.scale.clone()
      const rotation = keyMesh.rotation.clone()
      const mesh = new THREE.Mesh(geometry, newMaterial)
      const quaternion = keyMesh.quaternion.clone()

      mesh.applyMatrix4(keyMesh.matrixWorld)
      mesh.scale.copy(scale)
      mesh.position.copy(position)
      mesh.rotation.copy(rotation)
      mesh.quaternion.copy(quaternion)

      return {
        keyName,
        isPressed: false,
        newMaterial,
        geometry,
        position,
        scale,
        rotation,
        mesh,
        quaternion,
      }
    })

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

  return (
    <>
      {clonedKeyMeshes.map(({ keyName, geometry, scale, position, rotation, mesh, quaternion }) => {
        return (
          <mesh
            key={keyName}
            raycast={useCamera(camera)}
            onPointerDown={() => playSound(keyName)}
            geometry={geometry}
            scale={scale}
            rotation={rotation}
            position={position}
            material={mesh.material}
            quaternion={quaternion}
          ></mesh>
        )
      })}
    </>
  )
}
