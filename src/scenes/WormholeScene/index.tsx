import { Suspense, useMemo, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Vector2 } from "three"

import WormholeTube from "./WormholeTube"
import WormholeLights from "./WormholeLights"
import WormholeCrosshairs from "./WormholeCrosshairs"

import { createLogoBoxesArray } from "../../util/WormholeHelper"
import { COLOR_HEXES } from "../../data/constants"

import "./Wormhole.scss"

const WormholeScene = () => {
  const [mousePosition, setMousePosition] = useState<Vector2>(new Vector2(0, 0))

  const logoBoxes = useMemo<React.ReactElement[]>(
    () => createLogoBoxesArray(120),
    []
  )

  const handleMouseMove = ($e: React.PointerEvent<HTMLDivElement>) => {
    const { innerHeight, innerWidth } = window
    const aspect = innerWidth / innerHeight
    const fudge = { x: aspect * 0.75, y: 0.75 }
    const x = (($e.clientX / innerWidth) * 2 - 1) * fudge.x
    const y = (-1 * ($e.clientY / innerHeight) * 2 + 1) * fudge.y

    setMousePosition(new Vector2(x, y))
  }

  return (
    <Canvas
      camera={{ position: [0, 0, -2], fov: 65 }}
      onPointerMove={(evt) => handleMouseMove(evt)}
    >
      <fogExp2 attach='fog' color={COLOR_HEXES.BLACK} density={0.3} />
      <color attach='background' args={[COLOR_HEXES.BLACK]} />
      <WormholeLights />
      <Suspense fallback={null}>
        <WormholeTube />
        {logoBoxes}
        <WormholeCrosshairs groupPosition={mousePosition} />
      </Suspense>
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} />
      </EffectComposer>
    </Canvas>
  )
}

export default WormholeScene
