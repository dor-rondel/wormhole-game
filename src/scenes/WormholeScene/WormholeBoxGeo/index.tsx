import { Euler, Vector3 } from "three"
import { useTexture } from "@react-three/drei"
import { COLOR_HEXES } from "../../../data/constants"

type WormholeBoxGeoProps = {
  position: Vector3
  rotation: Euler
  size: number
  logo: string
}

const WormholeBoxGeo = ({
  position,
  rotation,
  size,
  logo,
}: WormholeBoxGeoProps) => {
  const texture = useTexture(logo)
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry attach='geometry' args={[size, size, size]} />
      <meshMatcapMaterial map={texture} color={COLOR_HEXES.WHITE} />
    </mesh>
  )
}

export default WormholeBoxGeo
