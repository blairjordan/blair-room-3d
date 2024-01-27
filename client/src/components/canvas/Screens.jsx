import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function Screens({ scene }) {
  const video1 = useRef(document.createElement('video'))
  const video2 = useRef(document.createElement('video'))
  const video3 = useRef(document.createElement('video'))
  const video4 = useRef(document.createElement('video'))
  const video5 = useRef(document.createElement('video'))

  // Main screen
  useEffect(() => {
    video1.current.src = '/screen1.mp4'
    video1.current.loop = true
    video1.current.muted = true
    video1.current.play()

    const videoTexture = new THREE.VideoTexture(video1.current)
    videoTexture.wrapT = THREE.RepeatWrapping
    videoTexture.repeat = new THREE.Vector2(1, -1)

    const monitor = scene.getObjectByName('monitor_04_screen')
    if (monitor) {
      monitor.material = new THREE.MeshBasicMaterial({
        map: videoTexture,
      })
    }

    return () => {
      video1.current.pause()
      monitor.material.dispose()
      videoTexture.dispose()
    }
  }, [scene])

  // Top screen
  useEffect(() => {
    video2.current.src = '/screen2.mp4'
    video2.current.loop = true
    video2.current.muted = true
    video2.current.play()

    const videoTexture = new THREE.VideoTexture(video2.current)
    videoTexture.wrapT = THREE.RepeatWrapping
    videoTexture.repeat = new THREE.Vector2(1, -1)

    const monitor = scene.getObjectByName('monitor_03_screen')
    if (monitor) {
      monitor.material = new THREE.MeshBasicMaterial({
        map: videoTexture,
      })
    }

    return () => {
      video2.current.pause()
      monitor.material.dispose()
      videoTexture.dispose()
    }
  }, [scene])

  // Left screen (vertical)
  useEffect(() => {
    video3.current.src = '/screen3.mp4'
    video3.current.loop = true
    video3.current.muted = true
    video3.current.play()

    const videoTexture = new THREE.VideoTexture(video3.current)
    videoTexture.wrapT = THREE.RepeatWrapping
    videoTexture.offset.y = -0.215
    videoTexture.offset.x = -0.1

    videoTexture.repeat = new THREE.Vector2(1.5, -0.5)

    const monitor = scene.getObjectByName('monitor_01_screen')
    if (monitor) {
      monitor.material = new THREE.MeshBasicMaterial({
        map: videoTexture,
      })
    }

    return () => {
      video3.current.pause()
      monitor.material.dispose()
      videoTexture.dispose()
    }
  }, [scene])

  // Left screen
  useEffect(() => {
    video4.current.src = '/screen4.mp4'
    video4.current.loop = true
    video4.current.muted = true
    video4.current.play()

    const videoTexture = new THREE.VideoTexture(video4.current)
    videoTexture.wrapT = THREE.RepeatWrapping
    videoTexture.repeat = new THREE.Vector2(1, -1)

    const monitor = scene.getObjectByName('monitor_02_screen')
    if (monitor) {
      monitor.material = new THREE.MeshBasicMaterial({
        map: videoTexture,
      })
    }

    return () => {
      video4.current.pause()
      monitor.material.dispose()
      videoTexture.dispose()
    }
  }, [scene])

  // Right screen (vertical)
  useEffect(() => {
    video5.current.src = '/screen5.mp4'
    video5.current.loop = true
    video5.current.muted = true
    video5.current.play()

    const videoTexture = new THREE.VideoTexture(video5.current)
    videoTexture.wrapT = THREE.RepeatWrapping
    videoTexture.offset.y = -0.2
    videoTexture.offset.x = -0.2

    videoTexture.repeat = new THREE.Vector2(1.5, -0.5)

    const monitor = scene.getObjectByName('monitor_05_screen')
    if (monitor) {
      monitor.material = new THREE.MeshBasicMaterial({
        map: videoTexture,
      })
    }

    return () => {
      video5.current.pause()
      monitor.material.dispose()
      videoTexture.dispose()
    }
  }, [scene])

  return null // This component does not render anything itself
}
