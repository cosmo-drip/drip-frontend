import { coins, SigningStargateClient } from "@cosmjs/stargate"
import { Registry, GeneratedType } from "@cosmjs/proto-signing"
import { MsgCommunityPoolSpend } from "cosmjs-types/cosmos/distribution/v1beta1/tx"
import { MsgSubmitProposal } from "cosmjs-types/cosmos/gov/v1/tx"
import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx"
import { Any } from "cosmjs-types/google/protobuf/any"
import { useKeplr } from './UseKeplr'
import { toUtf8 } from "@cosmjs/encoding"
import {useNetwork} from "../context/NetworkContext";

interface CommunitySpendProposalInput {
    contractRecipient: string,
    recipient: string,
    upperLimitAmount: string,
    upperLimitDenom: string,
    fixedAmount: string,
    fixedDenom: string,
    codeId: string,
    label: string,
    salt: string,
    title: string,
    summary: string,
    metadata: string,
    depositAmount: string,
    depositDenom: string,
}

export const useSendProposal = () => {
    const { address, connect } = useKeplr()
    const { selectedNetwork } = useNetwork();
    const { governanceAddress } = selectedNetwork

    const sendProposal = async (input: CommunitySpendProposalInput) => {

        try {
            await connect()

            if (!window.keplr || !address)
                throw new Error("Keplr is not found")

            await window.keplr.enable("testdrip-1")
            const offlineSigner = window.getOfflineSigner!("testdrip-1")

            const registryTypes: [string, GeneratedType][] = [
                ["/cosmos.gov.v1.MsgSubmitProposal", MsgSubmitProposal as GeneratedType],
                ["/cosmos.distribution.v1beta1.MsgCommunityPoolSpend", MsgCommunityPoolSpend as GeneratedType],
                ["/cosmwasm.wasm.v1.MsgInstantiateContract2", MsgInstantiateContract2 as GeneratedType],
            ]

            const registry = new Registry(registryTypes)

            const client = await SigningStargateClient.connectWithSigner(
                process.env.REACT_APP_RPC_URL!,
                offlineSigner,
                { registry }
            )

            const spendMsg = MsgCommunityPoolSpend.fromPartial({
                authority: governanceAddress,
                recipient: input.contractRecipient,
                amount: [
                    {
                        denom: input.upperLimitDenom,
                        amount: input.upperLimitAmount,
                    },
                ],
            })

            const instantiateMsg = MsgInstantiateContract2.fromPartial({
                sender: governanceAddress,
                admin: governanceAddress,
                codeId: BigInt(input.codeId),
                label: input.label,
                msg: toUtf8(JSON.stringify({
                    "fixed_amount": {
                        "amount": input.fixedAmount,
                        "denom": input.fixedDenom,
                    },
                    "owner_address": input.recipient,
                    "contract_denom": "uatom",
                    "twap_request_info": {
                        "pool_id": 308,
                        "base_asset": "uosmo",
                        "quote_asset": "ibc/9FF2B7A5F55038A7EE61F4FD6749D9A648B48E89830F2682B67B5DC158E2753C",
                    }
                },)),
                funds: [],
                salt: toUtf8(input.salt),
                fixMsg: false,
            })

            const spendMsgAny: Any = {
                typeUrl: "/cosmos.distribution.v1beta1.MsgCommunityPoolSpend",
                value: MsgCommunityPoolSpend.encode(spendMsg).finish(),
            }
            const instantiateMsgAny: Any = {
                typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
                value: MsgInstantiateContract2.encode(instantiateMsg).finish(),
            }

            const proposalMsg = MsgSubmitProposal.fromPartial({
                messages: [instantiateMsgAny, spendMsgAny],
                metadata: input.metadata,
                initialDeposit: [{denom: input.depositDenom, amount: input.depositAmount}],
                title: input.title,
                summary: input.summary,
                proposer: address,
            })

            const fee = {
                amount: coins(5000, "uatom"),
                gas: "250000",
            }

            const result = await client.signAndBroadcast(
                address,
                [
                    {
                        typeUrl: "/cosmos.gov.v1.MsgSubmitProposal",
                        value: proposalMsg,
                    },
                ],
                fee,
                "Submit proposal with MsgCommunityPoolSpend amd Istantiate2"
            )

            console.log("Proposal has been sent:", result)
            if (result.code !== 0) {
                throw new Error(result.rawLog || "Execution error")
            }
        } catch (err: any) {
            console.error("Error sending:", err.message)
        }
    }

    return {
        sendProposal,
    }
}
