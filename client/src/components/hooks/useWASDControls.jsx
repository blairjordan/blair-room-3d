'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

const useWASDControls = (camera) => {
  const [movement, setMovement] = useState({ forward: 0, side: 0 })

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      setMovement((m) => ({
        forward: key === 'w' ? 1 : key === 's' ? -1 : m.forward,
        side: key === 'a' ? -1 : key === 'd' ? 1 : m.side,
      }))
    }

    const handleKeyUp = ({ key }) => {
      setMovement((m) => ({
        forward: key === 'w' || key === 's' ? 0 : m.forward,
        side: key === 'a' || key === 'd' ? 0 : m.side,
      }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    if (camera) {
      camera.position.x += movement.side * 0.1
      camera.position.z -= movement.forward * 0.1
    }
  })
}

export default useWASDControls
