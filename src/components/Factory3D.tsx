import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text, Cylinder, Environment } from '@react-three/drei';
import { workers } from '@/data/workers';
import * as THREE from 'three';

function FactoryFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[40, 30]} />
      <meshStandardMaterial 
        color="#1a1a1a" 
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

function FactoryWalls() {
  return (
    <group>
      {/* Back wall with windows */}
      <mesh position={[0, 3, -15]} receiveShadow>
        <boxGeometry args={[40, 8, 0.5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
      {/* Window cutouts */}
      {[-8, 0, 8].map((x, i) => (
        <mesh key={i} position={[x, 4, -14.8]}>
          <boxGeometry args={[2.5, 2, 0.2]} />
          <meshStandardMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
      {/* Left wall */}
      <mesh position={[-20, 3, 0]} receiveShadow>
        <boxGeometry args={[0.5, 8, 30]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh position={[20, 3, 0]} receiveShadow>
        <boxGeometry args={[0.5, 8, 30]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
      {/* Ceiling beams */}
      {[-10, 0, 10].map((x, i) => (
        <mesh key={`beam-${i}`} position={[x, 6.5, 0]}>
          <boxGeometry args={[0.4, 0.6, 30]} />
          <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function RealisticWorker({ position, name, ppeStatus }: { position: [number, number, number]; name: string; ppeStatus: string }) {
  const bodyColor = ppeStatus === 'Wearing' ? '#1e40af' : '#991b1b';
  const helmetColor = ppeStatus === 'Wearing' ? '#fbbf24' : '#7f1d1d';
  
  return (
    <group position={position}>
      {/* Legs */}
      <Cylinder args={[0.15, 0.15, 1, 8]} position={[-0.2, 0, 0]} castShadow>
        <meshStandardMaterial color={bodyColor} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 1, 8]} position={[0.2, 0, 0]} castShadow>
        <meshStandardMaterial color={bodyColor} />
      </Cylinder>
      
      {/* Body/Torso */}
      <Box args={[0.6, 0.8, 0.35]} position={[0, 1.4, 0]} castShadow>
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </Box>
      
      {/* Arms */}
      <Cylinder args={[0.1, 0.1, 0.7, 8]} position={[-0.45, 1.3, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <meshStandardMaterial color={bodyColor} />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.7, 8]} position={[0.45, 1.3, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <meshStandardMaterial color={bodyColor} />
      </Cylinder>
      
      {/* Head */}
      <Sphere args={[0.25, 16, 16]} position={[0, 2.1, 0]} castShadow>
        <meshStandardMaterial color="#ffd7b5" />
      </Sphere>
      
      {/* Safety Helmet */}
      <Sphere args={[0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 2.25, 0]} castShadow>
        <meshStandardMaterial 
          color={helmetColor}
          metalness={0.4}
          roughness={0.6}
        />
      </Sphere>
      
      {/* Vest indicator for PPE */}
      {ppeStatus === 'Wearing' && (
        <Box args={[0.65, 0.85, 0.36]} position={[0, 1.4, 0]}>
          <meshStandardMaterial 
            color="#ff6600"
            transparent
            opacity={0.6}
            emissive="#ff6600"
            emissiveIntensity={0.2}
          />
        </Box>
      )}
      
      {/* Worker name label */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name.split(' ')[0]}
      </Text>
      
      {/* PPE Status badge */}
      <group position={[0, 2.5, 0]}>
        <mesh>
          <planeGeometry args={[0.8, 0.25]} />
          <meshBasicMaterial 
            color={ppeStatus === 'Wearing' ? '#22c55e' : '#ef4444'}
            transparent
            opacity={0.9}
          />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {ppeStatus === 'Wearing' ? '✓ PPE OK' : '✗ NO PPE'}
        </Text>
      </group>
    </group>
  );
}

function AdvancedMachinery() {
  return (
    <group>
      {/* CNC Machine */}
      <group position={[-12, 0, -8]}>
        <Box args={[3, 1.8, 2]} position={[0, 0.9, 0]} castShadow>
          <meshStandardMaterial color="#2c5f8d" metalness={0.8} roughness={0.3} />
        </Box>
        <Box args={[2.5, 0.3, 1.5]} position={[0, 1.95, 0]} castShadow>
          <meshStandardMaterial color="#1a3a52" metalness={0.7} roughness={0.4} />
        </Box>
        {/* Control panel */}
        <Box args={[0.8, 0.6, 0.1]} position={[1.2, 1.2, 0]} castShadow>
          <meshStandardMaterial color="#111111" emissive="#00ff00" emissiveIntensity={0.2} />
        </Box>
      </group>
      
      {/* Welding Station */}
      <group position={[12, 0, -8]}>
        <Box args={[2.5, 1.5, 2]} position={[0, 0.75, 0]} castShadow>
          <meshStandardMaterial color="#5a5a5a" metalness={0.9} roughness={0.2} />
        </Box>
        <Cylinder args={[0.15, 0.15, 1.2, 16]} position={[0.8, 1.6, 0]} castShadow>
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </Cylinder>
      </group>
      
      {/* Assembly Line Conveyor */}
      <group position={[0, 0, 8]}>
        <Box args={[8, 0.3, 1.5]} position={[0, 0.65, 0]} castShadow>
          <meshStandardMaterial color="#4a4a4a" metalness={0.5} roughness={0.6} />
        </Box>
        {/* Conveyor rollers */}
        {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
          <Cylinder key={i} args={[0.1, 0.1, 1.6, 12]} position={[x, 0.65, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <meshStandardMaterial color="#666666" metalness={0.7} />
          </Cylinder>
        ))}
      </group>
      
      {/* Large Industrial Press */}
      <group position={[-15, 0, 5]}>
        <Box args={[2, 3, 1.8]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color="#3d5a80" metalness={0.8} roughness={0.3} />
        </Box>
        <Cylinder args={[0.2, 0.2, 2, 16]} position={[0, 3.5, 0]} castShadow>
          <meshStandardMaterial color="#293241" metalness={0.9} roughness={0.2} />
        </Cylinder>
      </group>
      
      {/* Work Tables */}
      {[[-8, 0, 5], [8, 0, 5]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <Box args={[3, 0.15, 1.5]} position={[0, 0.85, 0]} castShadow>
            <meshStandardMaterial color="#8b6f47" roughness={0.8} />
          </Box>
          {/* Table legs */}
          {[[-1.3, 0, -0.6], [1.3, 0, -0.6], [-1.3, 0, 0.6], [1.3, 0, 0.6]].map((legPos, j) => (
            <Cylinder key={j} args={[0.08, 0.08, 0.85, 8]} position={legPos as [number, number, number]} castShadow>
              <meshStandardMaterial color="#5a4a2a" />
            </Cylinder>
          ))}
        </group>
      ))}
      
      {/* Storage Racks */}
      <group position={[16, 0, 10]}>
        <Box args={[2, 3, 0.5]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color="#6b6b6b" metalness={0.3} roughness={0.8} />
        </Box>
      </group>
      
      {/* Warning Signs */}
      {[[-10, 3, -14.5], [10, 3, -14.5]].map((pos, i) => (
        <mesh key={`sign-${i}`} position={pos as [number, number, number]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial 
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function FactoryLighting() {
  return (
    <>
      {/* Main overhead lights */}
      {[-8, 0, 8].map((x, i) => 
        [-8, 0, 8].map((z, j) => (
          <group key={`light-${i}-${j}`} position={[x, 6, z]}>
            <pointLight intensity={0.8} distance={12} castShadow />
            <mesh>
              <boxGeometry args={[0.6, 0.1, 0.6]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
            </mesh>
          </group>
        ))
      )}
      
      {/* Accent lights */}
      <spotLight position={[-15, 8, -10]} angle={0.3} penumbra={0.5} intensity={0.5} castShadow />
      <spotLight position={[15, 8, -10]} angle={0.3} penumbra={0.5} intensity={0.5} castShadow />
      
      {/* Window ambient light */}
      <rectAreaLight
        intensity={0.3}
        position={[0, 4, -14.5]}
        width={20}
        height={6}
        color="#87ceeb"
      />
    </>
  );
}

export default function Factory3D() {
  const activeWorkers = workers.filter((w) => w.attendance === 'Present');
  
  // Realistic worker positions around work areas
  const workerPositions: [number, number, number][] = [
    [-12, 0, -7],    // Near CNC machine
    [-10, 0, -9],    // Near CNC machine
    [12, 0, -7],     // Near welding station
    [11, 0, -9],     // Near welding station
    [-8, 0, 4],      // At work table
    [-7, 0, 6],      // At work table
    [8, 0, 4],       // At work table
    [7, 0, 6],       // At work table
    [-2, 0, 8],      // Near conveyor
    [2, 0, 8],       // Near conveyor
    [-15, 0, 4],     // Near press
    [0, 0, 0],       // Center floor
  ];

  return (
    <div className="w-full h-[700px] rounded-lg overflow-hidden border bg-background shadow-lg">
      <Canvas
        shadows
        camera={{ position: [0, 20, 25], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <FactoryLighting />
        <directionalLight
          position={[20, 20, 20]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Environment for reflections */}
        <Environment preset="warehouse" />
        
        {/* Factory fog for depth */}
        <fog attach="fog" args={['#0a0a0a', 20, 60]} />

        {/* Factory components */}
        <FactoryFloor />
        <FactoryWalls />
        <AdvancedMachinery />

        {/* Realistic Workers */}
        {activeWorkers.map((worker, index) => (
          <RealisticWorker
            key={worker.id}
            position={workerPositions[index % workerPositions.length]}
            name={worker.name}
            ppeStatus={worker.ppeStatus}
          />
        ))}

        {/* Enhanced Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={12}
          maxDistance={60}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
}
