import React, { createContext, useContext, useState, useCallback } from 'react';

interface TooltipState {
    visible: boolean;
    text: string;
    x: number;
    y: number;
}

interface CopyTooltipContextType {
    showTooltip: (text: string, x: number, y: number) => void;
    hideTooltip: () => void;
    tooltipState: TooltipState;
}

const CopyTooltipContext = createContext<CopyTooltipContextType | undefined>(undefined);

export const CopyTooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tooltipState, setTooltipState] = useState<TooltipState>({
        visible: false,
        text: '',
        x: 0,
        y: 0,
    });
    const showTooltip = useCallback((text: string, x: number, y: number) => {
        setTooltipState({ visible: true, text, x, y });

        setTimeout(() => {
            setTooltipState((prev) => ({ ...prev, visible: false }));
        }, 1500);
    }, []);

    const hideTooltip = useCallback(() => {
        setTooltipState((prev) => ({ ...prev, visible: false }));
    }, []);

    return (
        <CopyTooltipContext.Provider value={{ showTooltip, hideTooltip, tooltipState }}>
            {children}
        </CopyTooltipContext.Provider>
    );
};

export const useCopyTooltip = () => {
    const context = useContext(CopyTooltipContext);
    if (!context) {
        throw new Error('useCopyTooltip must be used within a CopyTooltipProvider');
    }
    return context;
};
