import React, { useState } from "react";
import keplrIcon from "../assets/icons/Keplr_icon_ver.1.3_2.svg";
import Button from "./formComponents/Button";
import {useCopyTooltip} from "../context/CopyTooltipContext";
import {useKeplrContext} from "../context/KeplrContext";

const KeplrWalletButton: React.FC = () => {
    const { connected, address, connect, disconnect } = useKeplrContext();
    const [isHovered, setIsHovered] = useState(false);
    const { showTooltip } = useCopyTooltip()

    const shortenAddress = (addr: string) => {
        if (!addr) return "";
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const copyAddress = (e: React.MouseEvent) => {
        e.preventDefault();
        if (address) {
            navigator.clipboard.writeText(address).then(r => showTooltip('Address copied!', e.clientX, e.clientY));
        }
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: "relative" }}
        >
            <div style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                backgroundColor: "#4b6cb7",
                backgroundImage: "linear-gradient(315deg, #4b6cb7 0%, #182848 74%)",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                gap: "10px",
                fontWeight: 500,
                fontSize: "16px",
                border: "none",
            }}>
                <img
                    src={keplrIcon}
                    alt="Keplr icon"
                    width="24"
                    height="24"
                    style={{flexShrink: 0}}
                />
                {connected && address ? shortenAddress(address) : "Connect Keplr"}
            </div>


            {isHovered && (
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        border: "1px solid black",
                        borderRadius: "10px",
                        background: "white",
                        padding: "20px",
                        zIndex: 10,
                        minWidth: "400px",
                        minHeight: "100px",
                    }}
                >
                    {connected ? (
                        <>
                            <p style={{color: "green"}}>Keplr is connected:</p>
                            <p
                                onClick={copyAddress}
                                style={{ cursor: "pointer"}}
                                title="Click to copy address"
                            >
                                {address}
                            </p>
                            <Button name={"disconnectKeplr"} text={"Disconnect"} handler={disconnect}/>
                        </>
                    ) : (
                        <>
                            <p style={{color: "red"}}>Keplr is not connected</p>
                            <p>&nbsp;</p>
                            <Button name={"connectKeplr"} text={"Connect"} handler={connect}/>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default KeplrWalletButton;
