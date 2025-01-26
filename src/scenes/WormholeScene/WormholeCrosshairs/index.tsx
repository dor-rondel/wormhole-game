import { Line } from "@react-three/drei"
import { Euler, Group, Vector2, Vector3 } from "three"
import { useThree } from "@react-three/fiber"

import { COLOR_HEXES } from "../../../data/constants"
import { useEffect, useState, useRef } from "react"

type WormholeCrosshairsProps = {
  groupPosition: Vector2
}

const WormholeCrosshairs = ({ groupPosition }: WormholeCrosshairsProps) => {
  const { camera, scene } = useThree()
  const groupRef = useRef<Group | null>(null)
  const [finalPosition, setFinalPosition] = useState<Vector3>(
    new Vector3(groupPosition.x, groupPosition.y, -1)
  )

  useEffect(() => {
    const newPosition = new Vector3(groupPosition.x, groupPosition.y, -1)
    setFinalPosition(newPosition)

    if (groupRef.current) {
      camera.add(groupRef.current)
      scene.add(camera)
    }
  }, [groupPosition.x, groupPosition.y])

  return (
    <group position={finalPosition} ref={groupRef}>
      {[0, 1, 2, 3].map((idx) => (
        <Line
          key={idx}
          points={[
            [0, 0.05, 0],
            [0, 0.02, 0],
          ]}
          color={COLOR_HEXES.WHITE}
          lineWidth={3}
          rotation={new Euler(0, 0, idx * 0.5 * Math.PI)}
        />
      ))}
    </group>
  )
}

export default WormholeCrosshairs
