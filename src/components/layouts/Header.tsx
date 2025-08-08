import React from 'react';
import NetworkSelector from "../NetworkSelector";
import KeplrWalletButton from "../WalletButton";

const Header = () => {
    return (
        <div style={{width:'100%'}}>
            <div style={{position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <h2 style={{color: "#1971c2", textAlign: "center"}}>Drip Proposal</h2>
                <KeplrWalletButton />
            </div>
            <NetworkSelector/>
        </div>
    );
};

export default Header;