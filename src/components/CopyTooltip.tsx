import React from 'react';
import { useCopyTooltip } from '../context/CopyTooltipContext';

const CopyTooltip: React.FC = () => {
    const { tooltipState } = useCopyTooltip();

    if (!tooltipState.visible) return null;

    return <div style={{
        position: 'fixed' as const,
        top: tooltipState.y + 15,
        left: tooltipState.x + 15,
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 999999,
        whiteSpace: 'nowrap' as const,
    }}>{tooltipState.text}</div>;
};

export default CopyTooltip;
