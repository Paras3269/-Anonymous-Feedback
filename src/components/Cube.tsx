'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function CubeMesh() {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    mesh.current.rotation.x += 0.003
    mesh.current.rotation.y += 0.005
  })

  return (
    <mesh ref={mesh} scale={1.5}>
      <boxGeometry />
      <MeshDistortMaterial
        color="#ffffff"
        distort={0.3}
        speed={2}
        roughness={0.2}
      />
    </mesh>
  )
}

export default function Cube() {
  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} />
      <CubeMesh />
    </Canvas>
  )
}
