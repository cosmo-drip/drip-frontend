import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { NetworkConfig, networks } from "../constants/Networks";
import { useModals } from "./ModalsContext";

type NetworkContextType = {
    selectedNetwork: NetworkConfig;
    setSelectedNetwork: (network: NetworkConfig) => void;
    loading: boolean;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig>(networks[0]);
    const [loading, setLoading] = useState(false);
    const { showLoading, hideLoading, showError } = useModals();

    useEffect(() => {
        const fetchNetworkData = async () => {
            if (!selectedNetwork.api) return;
            showLoading()
            try {
                const stakingRes = await axios.get(
                    `${selectedNetwork.api}/cosmos/staking/v1beta1/params`
                );
                const denom = stakingRes.data?.params?.bond_denom;
                const accountsRes = await axios.get(
                    `${selectedNetwork.api}/cosmos/auth/v1beta1/module_accounts`
                );
                const govAccount = accountsRes.data?.accounts?.find(
                    (acc: any) => acc.name === "gov"
                );
                const governanceAddress =
                    govAccount?.base_account?.address;
                const updatedNetwork: NetworkConfig = {
                    ...selectedNetwork,
                    denom,
                    governanceAddress
                };
                setSelectedNetwork(updatedNetwork);
            } catch (err) {
                showError("Error loading network data")
                console.error("Error loading network data", err);
            } finally {
                hideLoading()
            }
        };
        fetchNetworkData();
    }, [selectedNetwork.api]);

    return (
        <NetworkContext.Provider value={{ selectedNetwork, setSelectedNetwork, loading }}>
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