
'use client'

import React, { useMemo } from 'react';
import { Transformer } from '@/lib/data';
import { cn } from '@/lib/utils';
import './digital-twin-model.css';

export function DigitalTwinModel({ status }: { status: Transformer['status'] }) {
    const color = useMemo(() => {
        switch (status) {
            case 'Needs Attention':
                return 'var(--status-critical)';
            case 'Under Maintenance':
                return 'var(--status-warning)';
            case 'Operational':
            default:
                return 'var(--status-healthy)';
        }
    }, [status]);

    return (
        <div className="h-64 w-full rounded-lg bg-muted/50 flex items-center justify-center perspective-800">
             <div 
                className="scene"
                style={{
                    '--status-color': color,
                } as React.CSSProperties}
            >
                <div className="cube">
                    <div className="cube__face cube__face--front"></div>
                    <div className="cube__face cube__face--back"></div>
                    <div className="cube__face cube__face--right"></div>
                    <div className="cube__face cube__face--left"></div>
                    <div className="cube__face cube__face--top"></div>
                    <div className="cube__face cube__face--bottom"></div>
                </div>
            </div>
        </div>
    );
}

