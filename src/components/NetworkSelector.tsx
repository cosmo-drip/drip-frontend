import React, { useEffect } from "react";
import { networks } from "../constants/Networks";
import { useNetwork } from "../context/NetworkContext";
import { useFormContext } from "react-hook-form";

const NetworkSelector = () => {
    const { selectedNetwork, setSelectedNetwork } = useNetwork();
    const { setValue } = useFormContext();
    const { denom, governanceAddress, rpc } = selectedNetwork;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const net = networks.find((n) => n.name === e.target.value);
        if (net) setSelectedNetwork(net);
    };

    useEffect(() => {
        if (!denom || !governanceAddress) return;
        setValue("contractRecipient", "");
        setValue("deposit.denom", denom);
        setValue("upperLimitAmount.denom", denom);
        setValue("amountUsd.denom", "usd");
        setValue("sender", governanceAddress);
    }, [denom, governanceAddress, setValue]);

    return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", margin: "20px 0", fontSize: "20px" }}>
            <label>Select network</label>
            <select
                style={{
                    maxWidth: "100%",
                    minWidth: "300px",
                    borderRadius: "5px",
                    height: "30px",
                    fontSize: "18px",
                }}
                onChange={handleChange}
                value={selectedNetwork.name}
            >
                {networks.map((net) => (
                    <option key={net.name} value={net.name}>
                        {net.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default NetworkSelector;
