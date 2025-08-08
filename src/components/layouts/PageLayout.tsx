import React, {ReactNode} from 'react';

type PageLayoutProps = {
    children: ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <div style={{
            border: '1px solid #333',
            padding: '2%',
            borderRadius: '10px',
            marginTop: '20px',
            marginBottom: '20px',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '60vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
        }}>
            {children}
        </div>
    );
};

export default PageLayout;