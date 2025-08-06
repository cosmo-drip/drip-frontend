import React from 'react';
import ProposalPage from "./pages/ProposalPage";
import './App.css';
import {NetworkProvider} from "./context/NetworkContext";

function App() {
  return (
      <NetworkProvider>
        <div className="App">
          <ProposalPage/>
        </div>
      </NetworkProvider>
  );
}

export default App;
