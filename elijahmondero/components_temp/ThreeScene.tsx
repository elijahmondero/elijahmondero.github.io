import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, Text } from "@react-three/drei";
import { Group, } from "three";

function RotatingBox() {
  const mesh = useRef<Group>(null!);
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  return (
    <group ref={mesh}>
      <Box args={[2.5, 1, 1]}>
        <meshBasicMaterial attach="material" color={"white"} />
      </Box>
      <Text
        position={[0, 0, 0.51]} // Front face
        color="black"
        anchorX="center"
        anchorY="middle"
        fontSize={0.5}
      >
        Elijah
      </Text>
      <Text
        position={[0, 0, -0.51]} // Back face
        color="black"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
        fontSize={0.5}
      >
        Mondero
      </Text>
      <Text
        position={[0, 0.51, 0]} // Top face
        color="black"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
      >
        Mondero
      </Text>
      <Text
        position={[0, -0.51, 0]} // Bottom face
        color="black"
        anchorX="center"
        anchorY="middle"
        rotation={[Math.PI / 2, 0, 0]}
        fontSize={0.5}
      >
        Nino
      </Text>
    </group>
  );
}

function ThreeScene() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <RotatingBox />
      <Text
        position={[0, 2, 2]} // Position the text in the center of the scene
        color="white" // Default
        anchorX="center" // Center anchor horizontally
        anchorY="middle" // Center anchor vertically
        fontSize={0.5}
      >
        Elijah's page is coming soon...
      </Text>
      <Text
        position={[0, -2, 2]} // Adjust the y-coordinate here
        color="white" // Default
        anchorX="center" // Center anchor horizontally
        anchorY="middle" // Center anchor vertically
        fontSize={0.5}
      >
        Watch this space!
      </Text>
    </Canvas>
  );
}

export default ThreeScene;
