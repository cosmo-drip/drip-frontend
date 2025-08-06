import React, {useEffect, useState} from "react";
import { useFormContext, useWatch } from "react-hook-form";
import useCalculateAddress from "../hooks/useCalculateAddress";

type EncodingType = "string" | "hex" | "base64";

const SaltBlock = ({required = true}: {required? :boolean}) => {
    const { register, setValue, control, setError, clearErrors, formState: {errors} } = useFormContext();
    const stringValue = useWatch({ control, name: "salt.string" });
    const hexValue = useWatch({ control, name: "salt.hex" });
    const base64Value = useWatch({ control, name: "salt.base64" });
    const contractExists = useWatch({ control, name: "contractExists" });
    const [activeType, setActiveType] = useState<EncodingType>("string");

    useEffect(() => {
        if (contractExists) {
            setError("contractExists", {
                message: "contract already exists — please use a different salt.",
            });
        } else {
            clearErrors("contractExists");
        }
    }, [contractExists, setError, clearErrors, stringValue]);

    const inputs = [
        { type: "string", label: "string", value: stringValue },
        { type: "hex", label: "hex", value: hexValue },
        { type: "base64", label: "base64", value: base64Value },
    ];

    useCalculateAddress()

    const handleInputChange = (value: string) => {
        if (activeType === "string") {
            const buf = Buffer.from(value, "utf8");
            setValue("salt.string", value);
            setValue("salt.hex", buf.toString("hex"));
            setValue("salt.base64", buf.toString("base64"));
        } else if (activeType === "hex") {
            const buf = Buffer.from(value, "hex");
            setValue("salt.hex", value);
            setValue("salt.string", buf.toString("utf8"));
            setValue("salt.base64", buf.toString("base64"));
        } else if (activeType === "base64") {
            const buf = Buffer.from(value, "base64");
            setValue("salt.base64", value);
            setValue("salt.string", buf.toString("utf8"));
            setValue("salt.hex", buf.toString("hex"));
        }
    };

    return (
        <div style={{width: "100%", marginTop: "10px"}}>
            <label>
                <b>Salt{" "}
                {(errors?.salt || errors?.contractExists) && (
                    <span style={{color: "red", fontSize: "12px"}}>
      {typeof errors?.contractExists?.message === "string"
          ? errors.contractExists.message
          : typeof errors?.salt?.message === "string"
              ? errors.salt.message
              : "required field"}
    </span>
                )}</b>
            </label>

            {inputs.map(({type, label, value}) => (
                <div key={type}>
                    <label style={{marginLeft: "30px"}}>
                        {label}
                    </label>
                    <div style={{display: "flex", alignItems: "center", gap: "4px"}}>
                        <input
                            type="radio"
                            checked={activeType === type}
                            onChange={() => setActiveType(type as EncodingType)}
                            name="saltFormat"
                        />
                        <input
                            {...(type === "string" && {...register("salt.string", {required})})}
                            value={value || ""}
                            onChange={(e) => activeType === type && handleInputChange(e.target.value)}
                            readOnly={activeType !== type}
                            style={{
                                height: "28px",
                                borderRadius: "4px",
                                borderWidth: "1px",
                                paddingLeft: "8px",
                                width: "100%",
                                backgroundColor: activeType === type ? "white" : "#eee",
                                cursor: activeType === type ? "text" : "not-allowed",
                            }}
                        /></div>
                </div>
            ))}
        </div>
    );
};

export default SaltBlock;
