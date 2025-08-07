import React from 'react';
import Header from "../components/layouts/Header";
import FileUploader from "../components/FileUploader";
import {useForm, FormProvider} from "react-hook-form";
import TextInput from "../components/formComponents/TextInput";
import AmountInput from "../components/formComponents/AmountInput";
import Select from "../components/formComponents/Select";
import Button from "../components/formComponents/Button";
import SaltBlock from "../components/SaltBlock";
import BorderBox from "../components/layouts/BorderBox";
import PageLayout from "../components/layouts/PageLayout";
import {useNetwork} from "../context/NetworkContext";
import {denoms} from "../constants/DenomsList";
import {downloadJsonFile} from "../utils/DownloadJson";
import {useSendProposal} from "../hooks/UseSendProposal";
import { createProposalJson } from "../utils/CreateProposalJson";
import { buildProposalPayload } from "../utils/BuildProposalPayload";

const ProposalPage = () => {
    const { selectedNetwork } = useNetwork();
    const {denom, contracts } = selectedNetwork
    const { sendProposal } = useSendProposal()

    const methods = useForm({
        defaultValues:
            {
                salt: {string: "", base64: "", hex: ""},
            }}); //todo: add default values
    const { handleSubmit} = methods;

    const downloadJsonHandler = (data: any) => {
        const jsonData = createProposalJson(data)
        downloadJsonFile(jsonData, "drip_proposal.json");
    }

    const sendProposalHandler = (data: any) => {
        const payload = buildProposalPayload(data);
        sendProposal(payload);
    };

    return (
        <FormProvider {...methods}>
            <PageLayout>
            <Header/>
            <BorderBox title={"Proposal general data"}>
                <FileUploader/>
                <TextInput name={"title"} label={"Title"} placeholder={"Enter title"}/>
                <TextInput name={"summary"} label={"Summary"} placeholder={"Enter summary"}/>
                <AmountInput name={"deposit"} label={"Deposit"} placeholder={"Enter deposit"} denoms={[denom]}/>
                <TextInput name={"metadata"} label={"Metadata"} placeholder={"ipfs://CID"}/>
            </BorderBox>

            <BorderBox title={"Community Pool Spend"}>
                <TextInput name={"contractRecipient"} label={"Recipient (predicted contract address)"} placeholder={"Will be automatically filled after entering salt and choosing contract"} disabled={true} required={false}/>
                <AmountInput name={"upperLimitAmount"} label={"Amount (upper limit)"} placeholder={"Enter upper limit amount"} denoms={denoms}/>
            </BorderBox>

            <BorderBox title={"DRIP's Funding"}>
                <TextInput name={"sender"} label={"Sender (admin, governance)"} placeholder={"Sender address"} disabled={true}/>
                <TextInput name={"recipient"} label={"Recipient (owner address)"} placeholder={"Recipient address"}/>
                <AmountInput name={"amountUsd"} label={"Amount (USD)"} placeholder={"Enter amount in USD"} denoms={denoms}/>
                <SaltBlock/>
                <Select name={"contractId"} label={"Contract Id"} values={contracts} required={true}/>
            </BorderBox>

            <div style={{display: "flex", justifyContent: "space-between", margin: "20px 0px", width: "90%"}}>
                <Button name={"download"} text={"Download json file"} handler={handleSubmit(downloadJsonHandler)}/>
                <Button name={"send"} text={"Send "} handler={handleSubmit(sendProposalHandler)}/>
            </div>
            </PageLayout>
        </FormProvider>
    );
};

export default ProposalPage;