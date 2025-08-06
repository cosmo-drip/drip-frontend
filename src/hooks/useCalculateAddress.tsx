import { useEffect, useState } from 'react';
import { instantiate2Address } from "@cosmjs/cosmwasm-stargate";
import { useFormContext, useWatch } from "react-hook-form";
import { Buffer } from "buffer";
import axios from "axios";
import { useNetwork } from "../context/NetworkContext";
import useDebounce from "./useDebounce";

const UseCalculateAddress = () => {
    const { control, setValue } = useFormContext();
    const { selectedNetwork } = useNetwork();
    const { api, governanceAddress: sender, prefix } = selectedNetwork;
    const contractId = useWatch({ control, name: "contractId" });
    const base64Salt = useWatch({ control, name: "salt.base64" });
    const [checksumHex, setChecksumHex] = useState<string | null>(null);

    const debouncedBase64Salt = useDebounce(base64Salt, 1000);

    useEffect(() => {
        if (!contractId || !api) {
            setChecksumHex(null);
            setValue("contractRecipient", "");
            setValue("contractExists", false);
            return;
        }

        const loadChecksum = async () => {
            try {
                const response = await axios.get(
                    `${api}/cosmwasm/wasm/v1/code/${contractId}`
                );
                const hex = response.data.code_info.data_hash;
                setChecksumHex(hex);
            } catch (e) {
                console.error("Checksum error:", e);
                setChecksumHex(null);
                setValue("contractRecipient", "");
                setValue("contractExists", false)
            }
        };

        loadChecksum();
    }, [contractId, api, setValue]);

    useEffect(() => {

        if (!debouncedBase64Salt || !checksumHex) {
            setValue("contractRecipient", "");
            setValue("contractExists", false);
            return;
        }

        if (!sender || !prefix) return;

        try {
            const saltBytes = Uint8Array.from(Buffer.from(debouncedBase64Salt, "base64"));
            const checksum = Uint8Array.from(Buffer.from(checksumHex, "hex"));

            const address = instantiate2Address(checksum, sender, saltBytes, prefix);

            setValue("contractRecipient", address);

            const checkIfExists = async () => {
                setValue("contractExists", false);
                try {
                    const res = await axios.get(`${api}/cosmwasm/wasm/v1/contract/${address}`);
                    if (res.status === 200 && res.data.contract_info) {
                        setValue("contractExists", true);
                    } else {
                        setValue("contractExists", false);
                    }
                } catch (err: any) {
                    if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
                        setValue("contractExists", false);
                    } else {
                        console.error("Error checking contract existence:", err);
                    }
                }
            };

            checkIfExists();

        } catch (e) {
            console.error("Prediction error", e);
            setValue("contractRecipient", "");
            setValue("contractExists", false);
        }
    }, [debouncedBase64Salt, checksumHex, sender, prefix, setValue, api]);

    return null;
};

export default UseCalculateAddress;