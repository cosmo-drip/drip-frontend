import { coins, SigningStargateClient } from "@cosmjs/stargate"
import { Registry, GeneratedType } from "@cosmjs/proto-signing"
import { MsgCommunityPoolSpend } from "cosmjs-types/cosmos/distribution/v1beta1/tx"
import { MsgSubmitProposal } from "cosmjs-types/cosmos/gov/v1/tx"
import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx"
import { Any } from "cosmjs-types/google/protobuf/any"
import { toUtf8 } from "@cosmjs/encoding"
import { useNetwork } from "../context/NetworkContext";
import { useModals } from "../context/ModalsContext";
import {useKeplrContext} from "../context/KeplrContext";
import { ajv } from "../validation/SchemaValidators";
import instantiateMsgSchema from "../schemas/InstantiateMsg.schema.json"

interface SendProposal {
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
    const { address, connected } = useKeplrContext();
    const { selectedNetwork } = useNetwork();
    const { governanceAddress, chainId } = selectedNetwork
    const { showLoading, hideLoading, showError, showTxInfo } = useModals();

    const validateInstantiateMsg = ajv.compile(instantiateMsgSchema);

    const sendProposal = async (input: SendProposal) => {
        showLoading()
        try {
            if (!window.keplr)
                throw new Error("Keplr is not found. Make sure the extension is installed")
            if (!connected || !address)
                throw new Error("Keplr is not connected")

            await window.keplr.enable(chainId)
            const offlineSigner = window.getOfflineSigner!(chainId)

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

            const msgPayload = {
                admin: address,
                funding_expiration: {
                    at_height: 1754800000
                },
                payment_initiator_addrs: [
                    address,
                ],
                price_feeder_addr: address,
                quote_asset_limit: {
                    amount: "1000",
                    denom: "uatom"
                },
                recipient_addr: address,
                settlement_asset_limit: {
                    amount: "10000",
                    denom: "uatom"
                },
                withdrawal_ttl: {
                    default_sec: 32629444,
                    max_sec: 81188572
                }
            }

            if (!validateInstantiateMsg(msgPayload)) {
                console.error("Validation error", validateInstantiateMsg.errors);
                showError("Wrong msg format");
                hideLoading();
                return;
            }

            const instantiateMsg = MsgInstantiateContract2.fromPartial({
                sender: governanceAddress,
                admin: governanceAddress,
                codeId: BigInt(input.codeId),
                label: input.label,
                msg: toUtf8(JSON.stringify(msgPayload)),
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
                initialDeposit: [{
                    denom: input.depositDenom.trim(),
                    amount: String(input.depositAmount).trim(),
                }],
                title: input.title,
                summary: input.summary,
                proposer: address,
            })

            const fee = {
                amount: coins(5000, "uatom"),
                gas: "300000",
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
            showTxInfo(result)
            if (result.code !== 0) {
                console.warn("Transaction failed on chain:", result.rawLog);
                return
            }
        } catch (err: any) {
            console.error("Error sending:", err.message)
            showError(err.message)
        } finally {
            hideLoading();
        }
    }

    return {
        sendProposal,
    }
}
