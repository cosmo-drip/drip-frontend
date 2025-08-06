import React from 'react';
import {useFormContext} from "react-hook-form";


const Select = ({name, label, values, required}: {name: string, label: string, values: string[], required?: boolean}) => {
    const {register, formState: {errors}} = useFormContext();

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px', width: '100%'}}>
            <label><b>{label} {errors[name] && <span style={{color: "red", fontSize: "12px"}}>required field</span>}</b></label>
            <select  {...register(name, {required: required})} style={{
                height: '28px',
                borderRadius: '4px',
                borderWidth: '1px',
                width: '100%',
                textAlign: 'center'
            }}>
                <option value={""}>-- Select value --</option>
                {values.map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;