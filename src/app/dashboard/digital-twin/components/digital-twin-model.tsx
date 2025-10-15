
'use client'

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Edges } from '@react-three/drei';
import { Transformer } from '@/lib/data';

function RotatingBox({ status }: { status: Transformer['status'] }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.1;
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    const color = useMemo(() => {
        switch (status) {
            case 'Needs Attention':
                return '#ef4444'; // red-500
            case 'Under Maintenance':
                return '#f59e0b'; // amber-500
            case 'Operational':
            default:
                return '#22c55e'; // green-500
        }
    }, [status]);

    return (
        <Box ref={meshRef} args={[2, 2.5, 2]}>
            <meshStandardMaterial color={color} transparent opacity={0.6} />
            <Edges color={color} />
        </Box>
    );
}

export function DigitalTwinModel({ status }: { status: Transformer['status'] }) {
    return (
        <div className="h-64 w-full rounded-lg bg-muted/50">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <RotatingBox status={status} />
            </Canvas>
        </div>
    );
}
