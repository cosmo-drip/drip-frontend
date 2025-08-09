import React from 'react';

const Button = ({name, text, handler}: {name: string, text: string, handler: () => void}) => {

    return (
        <>
            <button
                onClick={handler}
                style={{
                    alignSelf: "center",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#3498db",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "bold",
                    minWidth: "120px",
                }}
            >
                {text}
            </button>
        </>
    );
};

export default Button;