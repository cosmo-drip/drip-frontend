import React from 'react';
import {useFormContext} from "react-hook-form";

const TextInput = ({name, label, placeholder, required = true, disabled}: {name: string, label: string, placeholder: string, required?: boolean, disabled?: boolean}) => {
    const {register, formState: {errors}} = useFormContext();
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px', width:'100%'}}>
            <label><b>{label} {errors[name] && <span style={{color: "red", fontSize: "12px"}}>required field</span>}</b></label>
            <input
                {...register(name, {required: required})}
                placeholder={placeholder}
                disabled={disabled}
                style={{height:'28px', borderRadius: '4px', borderWidth: '1px', paddingLeft: '8px', width: '100%'}}
            />
        </div>
    );
};

export default TextInput;