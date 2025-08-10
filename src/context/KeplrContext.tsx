import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useModals } from "./ModalsContext";

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

const CHAIN_ID = "testdrip-1";
const CHAIN_INFO = {
    "chainId": "testdrip-1",
    "chainName": "drip",
    "rpc": process.env.REACT_APP_RPC_URL!,
    "rest": process.env.REACT_APP_API_URL!,
    "bip44": {
        "coinType": 118
    },
    // "coinType": 118,
    "bech32Config": {
        "bech32PrefixAccAddr": "cosmos",
        "bech32PrefixAccPub": "cosmospub",
        "bech32PrefixValAddr": "cosmosvaloper",
        "bech32PrefixValPub": "cosmosvaloperpub",
        "bech32PrefixConsAddr": "cosmosvalcons",
        "bech32PrefixConsPub": "cosmosvalconspub"
    },
    "currencies": [
        {
            "coinDenom": "ATOM",
            "coinMinimalDenom": "uatom",
            "coinDecimals": 6,
            "coinGeckoId": "cosmos"
        }
    ],
    "feeCurrencies": [
        {
            "coinDenom": "ATOM",
            "coinMinimalDenom": "uatom",
            "coinDecimals": 6,
            "coinGeckoId": "cosmos",
            "gasPriceStep": {
                "low": 0.01,
                "average": 0.025,
                "high": 0.03
            }
        }
    ],
    // "gasPriceStep": {
    //     "low": 0.01,
    //     "average": 0.025,
    //     "high": 0.03
    // },
    "stakeCurrency": {
        "coinDenom": "ATOM",
        "coinMinimalDenom": "uatom",
        "coinDecimals": 6,
        "coinGeckoId": "cosmos"
    },
    "features": []
}

const KeplrContext = createContext<KeplrContextValue | undefined>(undefined);

export const KeplrProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isKeplrAvailable, setIsKeplrAvailable] = useState(false);
    const { showError, hideError } = useModals();

    useEffect(() => {
        const init = async () => {
            if (!window.keplr) {
                setError("Keplr is not found. Make sure the extension is installed.");
                return;
            }
            setIsKeplrAvailable(true);

            const savedAddress = localStorage.getItem("keplr_address");
            if (savedAddress) {
                try {
                    await window.keplr.enable(CHAIN_ID);
                    const key = await window.keplr.getKey(CHAIN_ID);
                    setAddress(key.bech32Address);
                    setConnected(true);
                    setError(null);
                } catch (err: any) {
                    console.warn("Auto-connect failed:", err.message);
                    disconnect();
                }
            }
        };

        init();
    }, []);

    const connect = async () => {
        try {
            if (!window.keplr)
                throw new Error("Keplr is not found. Make sure the extension is installed.");

            if (window.keplr.experimentalSuggestChain) {
                try {
                    await window.keplr.experimentalSuggestChain(CHAIN_INFO);
                } catch (suggestErr: any) {
                    console.warn("Failed to suggest custom network:", suggestErr.message);
                }
            }

            await window.keplr.enable(CHAIN_ID);
            const key = await window.keplr.getKey(CHAIN_ID);

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
