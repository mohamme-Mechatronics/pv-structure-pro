import { Grid, Environment, Lightformer, Instances, Instance } from "@react-three/drei";
import type { Box3, SceneModel } from "./sceneModel";
import type { LayerState } from "./layers";

// Material colours for the technical viewer (not UI theme tokens — WebGL scene).
const COLORS = {
  panel: "#1d3f66",
  panelEdge: "#9fc2ea",
  steel: "#8a94a3",
  purlin: "#b3bcc9",
  concrete: "#b9b0a2",
};

function BoxSet({ items, color, metalness = 0.4, roughness = 0.6 }: { items: Box3[]; color: string; metalness?: number; roughness?: number }) {
  if (items.length === 0) return null;
  return (
    <Instances limit={Math.max(items.length, 1)} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      {items.map((b, i) => (
        <Instance key={i} position={b.pos} scale={b.size} rotation={b.rot ?? [0, 0, 0]} />
      ))}
    </Instances>
  );
}

export function StructureScene({ model, layers }: { model: SceneModel; layers: LayerState }) {
  return (
    <>
      <color attach="background" args={["#0f141b"]} />
      <hemisphereLight intensity={0.6} color="#dfe8f5" groundColor="#3a3f48" />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-model.extent}
        shadow-camera-right={model.extent}
        shadow-camera-top={model.extent}
        shadow-camera-bottom={-model.extent}
      />
      <Environment>
        <Lightformer intensity={1.5} position={[0, 8, 0]} scale={[12, 12, 1]} />
        <Lightformer intensity={0.8} color="#9bb8d8" position={[-6, 2, -2]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>

      {/* ground plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[model.extent * 4, model.extent * 4]} />
        <meshStandardMaterial color="#1a222c" roughness={1} />
      </mesh>
      <Grid
        args={[model.extent * 4, model.extent * 4]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#2b3542"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3f6a99"
        fadeDistance={model.extent * 4}
        infiniteGrid
        position={[0, 0.002, 0]}
      />

      {layers.panels && <BoxSet items={model.panels} color={COLORS.panel} metalness={0.2} roughness={0.35} />}
      {layers.steel && (
        <>
          <BoxSet items={model.columns} color={COLORS.steel} />
          <BoxSet items={model.rafters} color={COLORS.steel} />
          <BoxSet items={model.purlins} color={COLORS.purlin} />
        </>
      )}
      {layers.foundations && <BoxSet items={model.footings} color={COLORS.concrete} metalness={0} roughness={0.95} />}
      {/* reinforcement / anchorBolts / basePlates: geometry supplied by the 3D Engine later */}
    </>
  );
}
