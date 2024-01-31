import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'

const BLACK_KEYS = [
  22, 25, 27, 30, 32, 34, 37, 39, 42, 44, 46, 49, 51, 54, 56, 58, 61, 63, 66, 68, 70, 73, 75, 78, 80, 82, 85, 87, 90,
  92, 94, 97, 99, 102, 104, 106,
]

const AUDIO_FILES = new Array(88).fill().map((_, i) => `piano/key_${i + 21}.mp3`)

console.log(AUDIO_FILES)
export function Piano({ scene }) {
  const audioLoader = useRef(new THREE.AudioLoader())
  const listener = useRef(new THREE.AudioListener())
  const sound = useRef(new THREE.Audio(listener.current))
  const audioBuffers = useRef(new Map())

  const originalPositions = useRef(new Map())
  const [pressedKey, setPressedKey] = useState(null)
  const [isDebouncing, setIsDebouncing] = useState(false)

  const handleKeyDown = (event, keyMesh) => {
    event.stopPropagation()
    if (isDebouncing) {
      return
    }
    setIsDebouncing(true)

    if (!originalPositions.current.has(keyMesh)) {
      originalPositions.current.set(keyMesh, keyMesh.position.clone())
    }
    setPressedKey(keyMesh)
    playSound(keyMesh.name)

    setTimeout(() => {
      setIsDebouncing(false)
    }, 100)
  }

  const handleKeyUp = () => {
    setPressedKey(null)
  }

  useEffect(() => {
    AUDIO_FILES.forEach((fileName) => {
      audioLoader.current.load(
        fileName,
        (buffer) => {
          audioBuffers.current.set(fileName, buffer)
        },
        undefined,
        (error) => {
          console.error('An error occurred while preloading the audio:', error)
        },
      )
    })
  }, [])

  useFrame(() => {
    keyMeshes.forEach((keyMesh) => {
      const originalPosition = originalPositions.current.get(keyMesh)
      if (keyMesh === pressedKey) {
        const downLength = BLACK_KEYS.includes(Number(keyMesh.name.replace('piano_key_', ''))) ? 0.01 : 0.02

        const downPosition = originalPosition.y - downLength
        keyMesh.position.y = Math.max(keyMesh.position.y - 0.005, downPosition)
      } else if (originalPosition) {
        keyMesh.position.y = Math.min(keyMesh.position.y + 0.01, originalPosition.y)
      }
    })
  })

  const playSound = (keyName) => {
    const audioFileName = `piano/${keyName.replace('piano_', '')}.mp3`

    if (sound.current.isPlaying) {
      sound.current.stop()
    }

    console.log('🎵 playing', audioFileName)
    const buffer = audioBuffers.current.get(audioFileName)
    if (buffer) {
      sound.current.setBuffer(buffer)
      sound.current.setLoop(false)
      sound.current.setVolume(0.5)
      sound.current.play()
    } else {
      console.error('Audio buffer not found for:', audioFileName)
    }
  }

  const keyMeshes = scene.children.filter((child) => child.name.startsWith('piano_key_'))

  return (
    <>
      {keyMeshes.map((keyMesh, i) => {
        return (
          <mesh
            key={`${keyMesh.name}_event`}
            onPointerDown={(event) => handleKeyDown(event, keyMesh)}
            onPointerUp={handleKeyUp}
            geometry={keyMesh.geometry}
            position={keyMesh.position}
            rotation={keyMesh.rotation}
            scale={keyMesh.scale}
            visible={false}
          />
        )
      })}
    </>
  )
}
