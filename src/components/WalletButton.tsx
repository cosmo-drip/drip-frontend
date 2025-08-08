import React, { useState } from "react";
import { useKeplr } from "../hooks/UseKeplr";
import keplrIcon from "../assets/icons/Keplr_icon_ver.1.3_2.svg";

const KeplrWalletButton: React.FC = () => {
    const { connected, address, connect, disconnect, error } = useKeplr();
    const [isHovered, setIsHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
        }
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: "relative" }}
        >
            <img
                src={keplrIcon}
                alt="Keplr icon"
                width="30"
                height="30"
                style={{ cursor: "pointer" }}
            />

            {isHovered && (
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        border: "1px solid black",
                        borderRadius: "10px",
                        background: "white",
                        padding: "20px",
                        zIndex: 2,
                        minWidth: "400px",
                        minHeight: "100px",
                    }}
                >
                    {connected ? (
                        <>
                            <p>Keplr is connected:</p>
                            <p
                                onClick={copyAddress}
                                style={{ cursor: "pointer"}}
                                // title="Click to copy address"
                            >
                                {address}
                            </p>
                            <button onClick={disconnect}>Disconnect</button>
                        </>
                    ) : (
                        <>
                            <p>Keplr is not connected</p>
                            <p>&nbsp;</p>
                            <button onClick={connect}>Connect Keplr</button>
                        </>
                    )}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            )}
        </div>
    );
};

export default KeplrWalletButton;
