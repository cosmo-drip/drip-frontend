import React from 'react';
import {useFormContext} from "react-hook-form";


const Checkbox = ({name, label}: {name: string, label: string}) => {
    const { register } = useFormContext();

    return (
        <div style={{marginTop: "10px", width: "100%"}}>
            <label><b>{label}</b></label>
            <input type={"checkbox"}  {...register(name)}/>
        </div>
    );
};

export default Checkbox;