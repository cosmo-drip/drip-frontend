import React from 'react';
import ProposalPage from "./pages/ProposalPage";
import './App.css';
import {NetworkProvider} from "./context/NetworkContext";
import {ModalsProvider} from "./context/ModalsContext";
import LoadingSpinner from "./components/modals/LoadingSpinner";
import TxModal from "./components/modals/TxModal";
import ErrorModal from "./components/modals/ErrorModal";
import {CopyTooltipProvider} from "./context/CopyTooltipContext";
import CopyTooltip from "./components/CopyTooltip";

function App() {
  return (
      <CopyTooltipProvider>
          <NetworkProvider>
              <ModalsProvider>
                  <LoadingSpinner/>
                  <TxModal/>
                  <ErrorModal/>
                  <div className="App">
                      <ProposalPage/>
                      <CopyTooltip />
                  </div>
              </ModalsProvider>
          </NetworkProvider>
      </CopyTooltipProvider>
  );
}

export default App;
