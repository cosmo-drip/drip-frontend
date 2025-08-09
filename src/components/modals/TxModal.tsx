import React from "react";
import { useModals } from "../../context/ModalsContext";
import Button from "../formComponents/Button";
import { useCopyTooltip } from "../../context/CopyTooltipContext";

const TxModal: React.FC = () => {
    const { hideTxInfo, txInfoModal } = useModals();
    const { showTooltip } = useCopyTooltip();

    const copyHash = (e: React.MouseEvent) => {
        e.preventDefault();
        if (txInfoModal) {
            navigator.clipboard
                .writeText(txInfoModal.transactionHash)
                .then(() => showTooltip("Hash copied!", e.clientX, e.clientY));
        }
    };

    if (!txInfoModal) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                padding: "10px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    maxWidth: "90vw",
                    minWidth: 320,
                    boxSizing: "border-box",
                }}
            >
                {txInfoModal.code !== 0 ? (
                    <h2 style={{ color: "red", textAlign: "center" }}>
                        Transaction Failed
                    </h2>
                ) : (
                    <h2 style={{ color: "green", textAlign: "center" }}>
                        Proposal has been sent
                    </h2>
                )}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        gap: "12px 16px",
                        margin: "20px 0",
                        alignItems: "start",
                    }}
                >
                    {txInfoModal.code !== 0 && (
                        <>
                            <div style={{ fontWeight: "bold"}}>
                                Error Description:
                            </div>
                            <div>{txInfoModal.rawLog}</div>
                        </>
                    )}

                    <div style={{ fontWeight: "bold"}}>
                        Transaction Hash:
                    </div>
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={copyHash}
                        title="Click to copy hash"
                    >
                        {txInfoModal.transactionHash}
                    </div>

                    <div style={{ fontWeight: "bold"}}>
                        Gas Used:
                    </div>
                    <div>{txInfoModal.gasUsed}</div>

                    <div style={{ fontWeight: "bold"}}>
                        Gas Wanted:
                    </div>
                    <div>{txInfoModal.gasWanted}</div>
                </div>

                <div style={{ textAlign: "center" }}>
                    <Button name="closeTxInfo" text="Close" handler={hideTxInfo} />
                </div>
            </div>
        </div>
    );
};

export default TxModal;
