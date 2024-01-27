import React, { useEffect, useContext, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export function Piano({ scene }) {
  const { camera } = useThree()

  const audioLoader = useRef(new THREE.AudioLoader())
  const listener = useRef(new THREE.AudioListener())
  const sound = useRef(new THREE.Audio(listener.current))

  const playSound = (keyName) => {
    // Assuming the naming convention "piano_key_XX.mp3" for audio files
    const audioFileName = `piano_key_${keyName}.mp3`

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

  // Mouse click event handler
  const onMouseClick = (event) => {
    event.preventDefault()

    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    )

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object
      if (clickedObject.name.startsWith('piano_key_')) {
        playSound(clickedObject.name.split('_').pop())
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', onMouseClick)

    return () => {
      document.removeEventListener('click', onMouseClick)
    }
  }, [])

  return null
}
