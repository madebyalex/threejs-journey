import React, { Suspense, useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, extend, useThree, useUpdate, useLoader } from "react-three-fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import * as dat from 'dat.gui'

import './style.css'
extend({ OrbitControls })

const Sphere = ({material}) => {
  const meshRef = useUpdate((mesh) => {
    mesh.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2)
    )
  }, [])

  useFrame(({clock}) => meshRef.current?.rotation.set(0.15 * clock.elapsedTime, 0.15 * clock.elapsedTime, 0))

  return (
    <mesh ref={meshRef} position={[-1.5, 0, 0]} material={material}>
      <sphereGeometry args={[0.5, 64, 64]} />
    </mesh>
  )
}

const Plane = ({material}) => {
  const meshRef = useUpdate((mesh) => {
    mesh.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2)
    )
  }, [])

  useFrame(({clock}) => meshRef.current?.rotation.set(0.15 * clock.elapsedTime, 0.15 * clock.elapsedTime, 0))

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} material={material}>
      <planeGeometry args={[1, 1, 100, 100]} />
    </mesh>
  )
}

const Torus = ({material}) => {
  const meshRef = useUpdate((mesh) => {
    mesh.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2)
    )
    console.log(mesh.geometry.attributes)
  }, [])

  useFrame(({clock}) => meshRef.current?.rotation.set(0.15 * clock.elapsedTime, 0.15 * clock.elapsedTime, 0))

  return (
    <mesh ref={meshRef} position={[1.5, 0, 0]} material={material}>
      <torusGeometry args={[0.5, 0.2, 64, 128]} />
    </mesh>
  )
}

const LocalScene = () => {
  const controlsRef = useRef();

  // Get the orbitControls constructo arguments, camera and dom element
  const {
    camera,
    gl: { domElement }
  } = useThree();

  // Comment this useFrame code if using MOUSE MOVE CONTROL
  // Update the orbitControl REF to add the damping
  useFrame(() => {
    controlsRef?.current.update()
  })


  const doorAlphaTexture = useLoader(THREE.TextureLoader, '/textures/door/alpha.jpg')
  const doorAmbientOcclusionTexture = useLoader(THREE.TextureLoader, '/textures/door/ambientOcclusion.jpg')
  const doorColorTexure = useLoader(THREE.TextureLoader, '/textures/door/color.jpg')
  const doorHeightTexture = useLoader(THREE.TextureLoader, '/textures/door/height.jpg')
  const doorMetalnessTexure = useLoader(THREE.TextureLoader, '/textures/door/metalness.jpg')
  const doorNormalTexure = useLoader(THREE.TextureLoader, '/textures/door/normal.jpg')
  const doorRoughnessTexure = useLoader(THREE.TextureLoader, '/textures/door/roughness.jpg')

  const gradient3Texture = useLoader(THREE.TextureLoader, '/textures/gradients/3.jpg')

  const matcaps8Texture = useLoader(THREE.TextureLoader, '/textures/matcaps/8.png')

  gradient3Texture.minFilter = THREE.NearestFilter
  gradient3Texture.magFilter = THREE.NearestFilter
  gradient3Texture.generateMipmaps = false

// useLoader will create a promise for every file in the array so we wrap it in an array and then destructure https://github.com/pmndrs/react-three-fiber/issues/602
  const [environmentMapTexture] = useLoader(THREE.CubeTextureLoader, [[
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
]])

// const material = useMemo(() => new THREE.MeshBasicMaterial())
//   useMemo(() => {
//   material.map = doorColorTexure
//   material.color.set('green')
//   material.wireframe = true
//   material.opacity = 0.5
//   material.transparent = true
//   material.alphaMap = doorAlphaTexture
//   material.side = THREE.DoubleSide
//   }, [material])

  // const material = useMemo(() => new THREE.MeshNormalMaterial())
  // useMemo(() => {
  //   material.flatShading = true
  // },[material])

  // const material = useMemo(() => new THREE.MeshMatcapMaterial())
  // useMemo(() => {
  //   material.matcap = matcaps8Texture
  // },[material])

  // const material = useMemo(() => new THREE.MeshDepthMaterial())

  // const material = useMemo(() => new THREE.MeshLambertMaterial())

  // const material = useMemo(() => new THREE.MeshPhongMaterial())
  // useMemo(() => {
  //   material.shininess = 1000
  //   material.specular = new THREE.Color(0x0000ff)
  // },[material])

  // const material = useMemo(() => new THREE.MeshToonMaterial(), [])
  // useMemo(() => {
  //   material.gradientMap = gradient3Texture
  // },[material])

  // make the material once
  const material = useMemo(() => new THREE.MeshStandardMaterial(), [])
  // update if material changes
  useMemo(() => {
    material.metalness = 0.7
    material.roughness = 0.2
    material.map = doorColorTexure
    material.aoMap = doorAmbientOcclusionTexture
    material.aoMapIntensity = 1
    material.displacementMap = doorHeightTexture
    material.displacementScale = 0.05
    // material.metalnessMap = doorMetalnessTexure
    // material.roughnessMap = doorRoughnessTexure
    material.normalMap = doorNormalTexure
    material.normalScale.set(0.5, 0.5)
    material.alphaMap = doorAlphaTexture
    material.transparent = true

    material.envMap = environmentMapTexture
  },[material])

   useMemo(() => {
    const gui = new dat.GUI()
    gui.add(material, 'metalness').min(0).max(1).step(0.01).name('metalness')
    gui.add(material, 'roughness').min(0).max(1).step(0.01).name('roughness')
    gui.add(material, 'aoMapIntensity').min(0).max(100).step(0.1).name('aoMapIntensity')
    gui.add(material, 'displacementScale').min(0).max(1).step(0.001).name('displacementScale')
   }, [material])

  return (
    <>
      <Sphere material={material}/>
      <Plane material={material}/>
      <Torus material={material}/>
      <ambientLight color={0xffffff} intensity={0.2}/>
      <pointLight color={0xffffff} intensity={0.5} position={[2, 3, 4]} />
      <orbitControls ref={controlsRef} args={[camera, domElement]} enableDamping />
    </>
  )
}

export default () => {
  // Create the canvas see API for all defaults that are added by React Three Fiber
  // https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md
  return (
    <Canvas
      shadowMap={false}
      gl={{ alpha: false, antialias: false }}
      pixelRatio={Math.min(window.devicePixelRatio, 2)}
    >
      <Suspense fallback={null}>
        <LocalScene />
      </Suspense>
    </Canvas>
  )
}
