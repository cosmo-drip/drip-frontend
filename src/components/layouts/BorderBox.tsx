import React, { ReactNode } from 'react';

type BorderBoxProps = {
    children: ReactNode;
    title?: string;
};

const BorderBox: React.FC<BorderBoxProps> = ({ children, title }) => {
    return (
        <div style={{
            border: '1px solid #333',
            padding: '20px 4%',
            borderRadius: '10px',
            margin: '10px 0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90%',
        }}>
            {title && <h3>{title}</h3>}
            {children}
        </div>
    );
};

export default BorderBox;
