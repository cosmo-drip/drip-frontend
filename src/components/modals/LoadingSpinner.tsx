import React from "react";
import { useModals } from "../../context/ModalsContext";

const LoadingSpinner: React.FC = () => {
    const { loading } = useModals();

    if (!loading) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            userSelect: "none",
            pointerEvents: "auto"
        }}>
            <div style={{
                width: 60,
                height: 60,
                border: "8px solid #f3f3f3",
                borderTop: "8px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
            }} />
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg);}
                        100% { transform: rotate(360deg);}
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingSpinner;
