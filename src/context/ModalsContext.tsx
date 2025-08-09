import React, { createContext, useContext, useState, ReactNode } from "react";
import { DeliverTxResponse } from "@cosmjs/stargate"

interface ModalsContextType {
    loading: boolean;
    error: string | null;
    txInfoModal: DeliverTxResponse | null;

    showLoading: () => void;
    hideLoading: () => void;

    showError: (message: string) => void;
    hideError: () => void;

    showTxInfo: (response: DeliverTxResponse) => void;
    hideTxInfo: () => void;
}

const ModalsContext = createContext<ModalsContextType | undefined>(undefined);

export const ModalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [txInfoModal, setInfoModal] = useState<DeliverTxResponse | null>(null);

    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);

    const showError = (message: string) => setError(message);
    const hideError = () => setError(null);

    const showTxInfo = (response: DeliverTxResponse) => setInfoModal(response);
    const hideTxInfo = () => setInfoModal(null);

    return (
        <ModalsContext.Provider value={{
            loading,
            error,
            txInfoModal,
            showLoading,
            hideLoading,
            showError,
            hideError,
            showTxInfo,
            hideTxInfo
        }}>
            {children}
        </ModalsContext.Provider>
    );
};

export const useModals = () => {
    const ctx = useContext(ModalsContext);
    if (!ctx) throw new Error("useModals must be used within ModalsProvider");
    return ctx;
};
