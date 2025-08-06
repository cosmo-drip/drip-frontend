import React from 'react';
import NetworkSelector from "../NetworkSelector";

const Header = () => {
    return (
        <div>
            <h2 style={{color: "#1971c2", textAlign: "center"}}>Drip Proposal</h2>
            <NetworkSelector/>
        </div>
    );
};

export default Header;