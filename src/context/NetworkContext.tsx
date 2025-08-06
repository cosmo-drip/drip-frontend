import React, { createContext, useContext, useState } from 'react';
import { NetworkConfig, networks } from "../constants/networks"

type NetworkContextType = {
    selectedNetwork: NetworkConfig;
    setSelectedNetwork: (network: NetworkConfig) => void;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig>(networks[0]);
    return (
        <NetworkContext.Provider value={{ selectedNetwork, setSelectedNetwork }}>
            {children}
        </NetworkContext.Provider>
);
};

export const useNetwork = () => {
    const context = useContext(NetworkContext);
    if (!context) {
        throw new Error("useNetwork must be used within a NetworkProvider");
    }
    return context;
};