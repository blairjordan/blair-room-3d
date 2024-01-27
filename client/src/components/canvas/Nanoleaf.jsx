import React, { useEffect, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
export function Nanoleaf({ scene }) {
  const nanoleafCount = 9
  const [activeIndex, setActiveIndex] = useState(-1)

  const nanoleafScene = [
    '#2B0051',
    '#1A023A',
    '#220040',
    '#000000',
    '#16003A',
    '#1A072E',
    '#4D00B2',
    '#000000',
    '#8600B2',
    '#2B0051',
    '#E28AFF',
  ]

  const randomColor = () => nanoleafScene[Math.floor(Math.random() * nanoleafScene.length)]

  useEffect(() => {
    for (let i = 1; i <= nanoleafCount; i++) {
      const nanoleafName = `light_nanoleaf_${i.toString().padStart(2, '0')}`
      const nanoleaf = scene.getObjectByName(nanoleafName)

      if (nanoleaf) {
        nanoleaf.material = nanoleaf.material.clone()
      }
    }
  }, [scene])

  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * nanoleafCount)
      setActiveIndex(newIndex)
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (activeIndex === -1) return

    const nanoleafName = `light_nanoleaf_${(activeIndex + 1).toString().padStart(2, '0')}`
    const currentNanoLeaf = scene.getObjectByName(nanoleafName)
    if (currentNanoLeaf) {
      const currentColor = new THREE.Color(currentNanoLeaf.material.emissive.getHex())
      const targetColor = new THREE.Color(randomColor())

      currentNanoLeaf.material.emissiveIntensity = 5

      // Color transition using GSAP
      gsap.to(currentColor, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 1,
        onUpdate: () => {
          currentNanoLeaf.material.emissive = currentColor
        },
      })
    }
  }, [activeIndex, scene])

  return null
}
