import { useFrame, useThree } from "@react-three/fiber"
import { animateCamera, tubeGeoInstance } from "../../../util/WormholeHelper"
import useLaserCannon from "../../../hooks/useLaserCannon"
import { COLOR_HEXES } from "../../../data/constants"

const WormholeTube = () => {
  const { camera } = useThree()
  const lasers = useLaserCannon()

  useFrame(() => {
    animateCamera(tubeGeoInstance, camera)
    lasers.forEach((laser) => laser.userData.animateCollision())
  })

  return (
    <mesh>
      <lineSegments>
        <edgesGeometry args={[tubeGeoInstance]} />
        <lineBasicMaterial color={COLOR_HEXES.NEON_BLUE} />
      </lineSegments>
    </mesh>
  )
}

export default WormholeTube
