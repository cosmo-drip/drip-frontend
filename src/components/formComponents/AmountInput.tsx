import React from 'react';
import { useFormContext } from "react-hook-form";



const AmountInput = ({name, label, placeholder, denoms}: {name: string, label: string, placeholder: string, denoms: string[]}) => {
    const { register, formState: {errors} } = useFormContext();
    const amountError = (errors[name] as any)?.amount?.message;

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px', width: '100%'}}>
            <label>
                <b>
                    {label}
                    {amountError && (
                        <span style={{color: "red", fontSize: "12px", marginLeft: '8px'}}>
                            {amountError}
                        </span>
                    )}
                </b>
            </label>
            <div style={{display: 'flex', width: '100%'}}>
                <input
                    type={"number"}
                    {...register(`${name}.amount`, {
                        required: "required field",
                        min: {
                            value: 1,
                            message: "must be more then 0"
                        }
                    })}
                    placeholder={placeholder}
                    style={{flex: 4, height: '28px',borderRadius: '4px', borderWidth: '1px', paddingLeft: '8px', width: '100%'}}
                />
                <select
                    {...register(`${name}.denom`)}
                    style={{flex: 1, borderRadius: '4px', borderWidth: '1px'}}
                >
                    {denoms.map((denom) => (
                        <option key={denom} value={denom}
                                style={{height: '28px', textAlign: "center"}}
                        >
                            {denom}
                        </option>
                    ))}
                </select>
            </div>

        </div>
    );
};

export default AmountInput;