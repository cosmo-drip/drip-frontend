import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useModals } from "./ModalsContext";
import {useNetwork} from "./NetworkContext";

declare global {
    interface Window extends KeplrWindow {}
}

interface KeplrContextValue {
    connected: boolean;
    address: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    error: string | null;
    isKeplrAvailable: boolean;
}

const KeplrContext = createContext<KeplrContextValue | undefined>(undefined);

export const KeplrProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isKeplrAvailable, setIsKeplrAvailable] = useState(false);
    const { showError, hideError } = useModals();
    const { selectedNetwork } = useNetwork();


    const getChainInfo = () => ({
        chainId: selectedNetwork.chainId,
        chainName: selectedNetwork.name,
        rpc: selectedNetwork.rpc,
        rest: selectedNetwork.api,
        bip44: { coinType: 118 },
        bech32Config: {
            bech32PrefixAccAddr: selectedNetwork.prefix,
            bech32PrefixAccPub: `${selectedNetwork.prefix}pub`,
            bech32PrefixValAddr: `${selectedNetwork.prefix}valoper`,
            bech32PrefixValPub: `${selectedNetwork.prefix}valoperpub`,
            bech32PrefixConsAddr: `${selectedNetwork.prefix}valcons`,
            bech32PrefixConsPub: `${selectedNetwork.prefix}valconspub`
        },
        currencies: [
            {
                coinDenom: selectedNetwork.denom?.toUpperCase() || "UNKNOWN",
                coinMinimalDenom: selectedNetwork.denom || "",
                coinDecimals: 6
            }
        ],
        feeCurrencies: [
            {
                coinDenom: selectedNetwork.denom?.toUpperCase() || "UNKNOWN",
                coinMinimalDenom: selectedNetwork.denom || "",
                coinDecimals: 6,
                gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 }
            }
        ],
        stakeCurrency: {
            coinDenom: selectedNetwork.denom?.toUpperCase() || "UNKNOWN",
            coinMinimalDenom: selectedNetwork.denom || "",
            coinDecimals: 6
        },
        features: []
    });

    useEffect(() => {
        if (!window.keplr) {
            setError("Keplr is not found. Make sure the extension is installed.");
            return;
        }
        setIsKeplrAvailable(true);

        const autoReconnect = async () => {
            const savedAddress = localStorage.getItem("keplr_address");
            if (!savedAddress) return;

            try {
                if (!window.keplr) {
                    throw new Error("Keplr is not found. Make sure the extension is installed.");
                }
                await window.keplr.enable(selectedNetwork.chainId);
                const key = await window.keplr.getKey(selectedNetwork.chainId);
                setAddress(key.bech32Address);
                setConnected(true);
                setError(null);
            } catch {
                disconnect();
            }
        };

        autoReconnect();
    }, [selectedNetwork.chainId]);

    const connect = async () => {
        try {
            if (!window.keplr)
                throw new Error("Keplr is not found. Make sure the extension is installed.");

            const chainInfo = getChainInfo();

            if (window.keplr.experimentalSuggestChain) {
                await window.keplr.experimentalSuggestChain(chainInfo);
            }

            await window.keplr.enable(selectedNetwork.chainId);
            const key = await window.keplr.getKey(selectedNetwork.chainId);

            setAddress(key.bech32Address);
            setConnected(true);
            setError(null);
            hideError();
            localStorage.setItem("keplr_address", key.bech32Address);
        } catch (err: any) {
            setError(err.message || "Error connecting to Keplr");
            setConnected(false);
            setAddress(null);
            showError(err.message);
        }
    };

    const disconnect = () => {
        localStorage.removeItem("keplr_address");
        setConnected(false);
        setAddress(null);
        setError(null);
    };

    return (
        <KeplrContext.Provider
            value={{ connected, address, connect, disconnect, error, isKeplrAvailable }}
        >
            {children}
        </KeplrContext.Provider>
    );
};

export const useKeplrContext = () => {
    const context = useContext(KeplrContext);
    if (!context) {
        throw new Error("useKeplrContext must be used within a KeplrProvider");
    }
    return context;
};
