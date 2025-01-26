import { useState, useEffect } from "react"
import { useThree } from "@react-three/fiber"
import {
  Mesh,
  IcosahedronGeometry,
  MeshBasicMaterial,
  Object3DEventMap,
  Vector3,
  Raycaster,
  Object3D,
} from "three"

import { COLOR_HEXES } from "../data/constants"
import { makeNewLaserSceneObjects } from "../util/WormholeHelper"

const useLaserCannon = () => {
  const { camera, scene } = useThree()

  const crosshairs = scene?.children
    ?.find((o) => o.type === "PerspectiveCamera")
    ?.children.find((o) => o.type === "Group" && o.children.length === 4)

  const raycaster = new Raycaster()
  const direction = new Vector3()
  const collisionPosition = new Vector3()
  const collisionColor = COLOR_HEXES.RED

  const [lasers, setLasers] = useState<
    Mesh<IcosahedronGeometry, MeshBasicMaterial, Object3DEventMap>[]
  >([])

  const makeLaserObject = (): Mesh<
    IcosahedronGeometry,
    MeshBasicMaterial,
    Object3DEventMap
  > => {
    const aimedPosition = camera.position
      .clone()
      .setFromMatrixPosition(crosshairs!.matrixWorld)

    const { laserMesh, laserDirection } = makeNewLaserSceneObjects()
    laserMesh.position.copy(camera.position)

    let active = true
    let speed = 0.5

    laserDirection
      .subVectors(laserMesh.position, aimedPosition)
      .normalize()
      .multiplyScalar(speed)

    direction.subVectors(aimedPosition, camera.position)
    raycaster.set(camera.position, direction)

    const boxesInScene = scene.children.filter(
      (obj: Object3D<Object3DEventMap>) =>
        (obj as Mesh)?.geometry?.type === "BoxGeometry"
    )

    let intersects = raycaster.intersectObjects([...boxesInScene], true)

    if (intersects.length > 0) {
      collisionPosition.copy(intersects[0].point)
      scene.remove(intersects[0].object)
    }

    let scale = 1.0
    let opacity = 1.0
    let isExploding = false

    const animateCollision = () => {
      if (active === true) {
        if (isExploding === false) {
          laserMesh.position.sub(laserDirection)

          if (laserMesh.position.distanceTo(collisionPosition) < 0.5) {
            laserMesh.position.copy(collisionPosition)
            laserMesh.material.color.set(collisionColor)
            isExploding = true
          }
        } else {
          if (opacity > 0.01) {
            scale += 0.2
            opacity *= 0.85
          } else {
            opacity = 0.0
            scale = 0.01
            active = false
          }
          laserMesh.scale.setScalar(scale)
          laserMesh.material.opacity = opacity
          laserMesh.userData.active = active
        }
      }
    }
    laserMesh.userData = { animateCollision, active }
    return laserMesh
  }

  const fireLaser = () => {
    const laser = makeLaserObject()
    setLasers((prevLasers) => [...prevLasers, laser])
    scene.add(laser)

    setTimeout(() => {
      scene.remove(laser)
    }, 1000)
  }

  useEffect(() => {
    window.addEventListener("click", fireLaser)

    return () => {
      window.removeEventListener("click", fireLaser)
      scene.remove(...lasers)
    }
  }, [crosshairs?.children?.length])

  return lasers
}

export default useLaserCannon
