import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text } from '@react-three/drei';
import { workers } from '@/data/workers';
import * as THREE from 'three';

function FactoryFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[30, 20]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}

function FactoryWalls() {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 2, -10]} receiveShadow>
        <boxGeometry args={[30, 6, 0.5]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* Left wall */}
      <mesh position={[-15, 2, 0]} receiveShadow>
        <boxGeometry args={[0.5, 6, 20]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* Right wall */}
      <mesh position={[15, 2, 0]} receiveShadow>
        <boxGeometry args={[0.5, 6, 20]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
    </group>
  );
}

function Worker({ position, name, ppeStatus }: { position: [number, number, number]; name: string; ppeStatus: string }) {
  const color = ppeStatus === 'Wearing' ? '#22c55e' : '#ef4444';
  
  return (
    <group position={position}>
      {/* Worker body */}
      <Sphere args={[0.4, 16, 16]} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial color={color} />
      </Sphere>
      {/* Worker base */}
      <Box args={[0.6, 1.2, 0.4]} position={[0, -0.2, 0]} castShadow>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Worker name label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name.split(' ')[0]}
      </Text>
      {/* PPE indicator */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {ppeStatus === 'Wearing' ? '✓ PPE' : '✗ NO PPE'}
      </Text>
    </group>
  );
}

function Machinery() {
  return (
    <group>
      {/* Machine 1 */}
      <Box args={[2, 1.5, 1.5]} position={[-8, 0.25, -6]} castShadow>
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Machine 2 */}
      <Box args={[2.5, 1.8, 1.8]} position={[8, 0.4, -6]} castShadow>
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Machine 3 */}
      <Box args={[3, 2, 2]} position={[0, 0.5, 6]} castShadow>
        <meshStandardMaterial color="#777777" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Workbench */}
      <Box args={[4, 0.2, 2]} position={[-10, 0.6, 4]} castShadow>
        <meshStandardMaterial color="#8b4513" />
      </Box>
    </group>
  );
}

export default function Factory3D() {
  const activeWorkers = workers.filter((w) => w.attendance === 'Present');
  
  // Position workers in a realistic factory layout
  const workerPositions: [number, number, number][] = [
    [-8, 0, -5],
    [-5, 0, -5],
    [6, 0, -5],
    [9, 0, -5],
    [-10, 0, 3],
    [-6, 0, 2],
    [0, 0, 5],
    [3, 0, 6],
    [-2, 0, 0],
    [5, 0, 0],
    [-8, 0, 6],
    [10, 0, 2],
  ];

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border bg-background">
      <Canvas
        shadows
        camera={{ position: [0, 15, 20], fov: 50 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.5} />
        <pointLight position={[10, 5, 10]} intensity={0.5} />

        {/* Factory components */}
        <FactoryFloor />
        <FactoryWalls />
        <Machinery />

        {/* Workers */}
        {activeWorkers.map((worker, index) => (
          <Worker
            key={worker.id}
            position={workerPositions[index % workerPositions.length]}
            name={worker.name}
            ppeStatus={worker.ppeStatus}
          />
        ))}

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
