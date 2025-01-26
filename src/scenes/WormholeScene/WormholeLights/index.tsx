import { COLOR_HEXES } from "../../../data/constants"

const WormholeLights = () => (
  <group>
    <pointLight intensity={1} distance={100} color={COLOR_HEXES.WHITE} />
    <ambientLight color={COLOR_HEXES.WHITE} intensity={1} />
  </group>
)

export default WormholeLights
