import React from "react";
import { useModals } from "../../context/ModalsContext";
import Button from "../formComponents/Button";

const ErrorModal: React.FC = () => {
    const { error, hideError } = useModals();

    if (!error) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                maxWidth: "80vw",
                minWidth: "320px",
                textAlign: "center",
            }}>
                <h2 style={{ color: "red" }}>Error</h2>
                <p>{error}</p>
                <Button name={"closeError"} text={"Close"} handler={hideError}/>
            </div>
        </div>
    );
};

export default ErrorModal;
