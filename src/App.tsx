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
import {KeplrProvider} from "./context/KeplrContext";

function App() {
  return (
      <CopyTooltipProvider>
          <ModalsProvider>
              <NetworkProvider>
                  <LoadingSpinner/>
                  <TxModal/>
                  <ErrorModal/>
                  <KeplrProvider>
                  <div className="App">
                      <ProposalPage/>
                      <CopyTooltip />
                  </div>
              </KeplrProvider>
              </NetworkProvider>
          </ModalsProvider>
      </CopyTooltipProvider>
  );
}

export default App;
