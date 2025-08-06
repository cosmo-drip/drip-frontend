import React from 'react';
import Header from "../components/layouts/Header";
import FileUploader from "../components/FileUploader";
import {useForm, FormProvider} from "react-hook-form";
import TextInput from "../components/formComponents/TextInput";
import AmountInput from "../components/formComponents/AmountInput";
import Select from "../components/formComponents/Select";
// import Checkbox from "../components/formComponents/Checkbox";
import Button from "../components/formComponents/Button";
import SaltBlock from "../components/SaltBlock";
import BorderBox from "../components/layouts/BorderBox";
import PageLayout from "../components/layouts/PageLayout";
import {useNetwork} from "../context/NetworkContext";
import {denoms} from "../constants/denomsList";
import {downloadJsonFile} from "../utils/downloadJson";
import {useKeplrSendCommunitySpend} from "../hooks/useCommunitySpendProposal";

const ProposalPage = () => {
    const { selectedNetwork } = useNetwork();
    const {denom, contracts } = selectedNetwork
    const { sendCommunitySpend } = useKeplrSendCommunitySpend()

    const methods = useForm({
        defaultValues:
            {
                salt: {string: "", base64: "", hex: ""},
            }}); //todo: add default values
    const { handleSubmit} = methods;

    const downloadJson = (data: any) => {
        const jsonData = {
            messages: [
                {
                    "@type": "/cosmos.distribution.v1beta1.MsgCommunityPoolSpend",
                    authority: data.sender,
                    recipient: data.contractRecipient,
                    amount: [{denom: data.upperLimitAmount.denom, amount: data.upperLimitAmount.amount}],
                },
                {
                    "@type": "/cosmwasm.wasm.v1.MsgInstantiateContract2",
                    sender: data.sender,
                    admin: data.sender,
                    code_id: data.contractId,
                    label: "",
                    msg: {
                        fixed_amount: { amount: data.amountUsd.amount, denom: data.amountUsd.denom },
                        owner_address: data.recipient,
                        contract_denom: data.amountUsd.denom, //todo what is contract_denom,
                        twap_request_info: {
                            pool_id: 308,
                            base_asset: "uosmo", //todo what is base_asset,
                            quote_asset: "ibc/9FF2B7A5F55038A7EE61F4FD6749D9A648B48E89830F2682B67B5DC158E2753C"
                        },
                    },
                    funds: [],
                    salt: data.salt.base64,
                    fix_msg: false
                },
            ],
            metadata: data.metadata,
            deposit: `${data.deposit.amount}${data.deposit.denom}`,
            title: data.title,
            summary: data.summary,
            expedited: data.expedited
        }
        downloadJsonFile(jsonData, "drip_proposal.json");
    }
    const sendProposal = (data: any) => {
        sendCommunitySpend({
        contractRecipient: data.contractRecipient,
        recipient: data.recipient,
        upperLimitAmount: data.upperLimitAmount.amount,
        upperLimitDenom: data.upperLimitAmount.denom,
        fixedAmount: data.amountUsd.amount,
        fixedDenom: data.amountUsd.denom,
        codeId: data.contractId,
        label: 'test label', //todo add label
        salt: data.salt.string,
        title: data.title,
        summary: data.summary,
        metadata: data.metadata,
        depositAmount: data.deposit.amount,
        depositDenom: data.deposit.denom,
        });
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
                {/*<Checkbox name={"expedited"} label={"Expedited"}/>*/}
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
                <Button name={"download"} text={"Download json file"} handler={handleSubmit(downloadJson)}/>
                <Button name={"send"} text={"Send "} handler={handleSubmit(sendProposal)}/>
            </div>
            </PageLayout>
        </FormProvider>
    );
};

export default ProposalPage;