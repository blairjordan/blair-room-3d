import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

const AUDIO_FILE = 'guitar.mp3'

export function Guitar({ scene }) {
  const audioLoader = useRef(new THREE.AudioLoader())
  const listener = useRef(new THREE.AudioListener())
  const sound = useRef(new THREE.Audio(listener.current))
  const audioBuffer = useRef(null)

  useEffect(() => {
    audioLoader.current.load(
      AUDIO_FILE,
      (buffer) => {
        audioBuffer.current = buffer
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the audio:', error)
      },
    )
  }, [])

  const handleKeyDown = (event) => {
    event.stopPropagation()
    playSound()
  }

  const playSound = () => {
    if (sound.current.isPlaying) {
      sound.current.stop()
    }

    console.log('🎸 playing', AUDIO_FILE)
    if (audioBuffer.current) {
      sound.current.setBuffer(audioBuffer.current)
      sound.current.setLoop(false)
      sound.current.setVolume(0.5)
      sound.current.play()
    } else {
      console.error('Audio buffer not found for:', AUDIO_FILE)
    }
  }

  const guitarMesh = scene.children.find((child) => child.name === 'guitar')

  return (
    <mesh
      key={`${guitarMesh.name}_event`}
      onPointerDown={(event) => handleKeyDown(event)}
      geometry={guitarMesh.geometry}
      position={guitarMesh.position}
      rotation={guitarMesh.rotation}
      scale={guitarMesh.scale}
      visible={false}
    />
  )
}
