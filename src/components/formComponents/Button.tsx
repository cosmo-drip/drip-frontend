import React from 'react';

const Button = ({name, text, handler}: {name: string, text: string, handler: () => void}) => {


    return (
        <>
            <button style={{height: "40px", width: "180px"}} onClick={handler}>{text}</button>
        </>
    );
};

export default Button;