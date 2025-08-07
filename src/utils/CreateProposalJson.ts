interface ProposalFormData {
    sender: string;
    contractRecipient: string;
    recipient: string;
    upperLimitAmount: { amount: string, denom: string };
    amountUsd: { amount: string, denom: string };
    contractId: string;
    salt: { string: string, base64: string, hex: string };
    title: string;
    summary: string;
    metadata: string;
    deposit: { amount: string, denom: string };
}

export const createProposalJson = (data: ProposalFormData) => {
    return {
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
                label: "DripTest",
                msg: {
                    fixed_amount: { amount: data.amountUsd.amount, denom: data.amountUsd.denom },
                    owner_address: data.recipient,
                    contract_denom: data.amountUsd.denom,
                    twap_request_info: {
                        pool_id: 308,
                        base_asset: "uosmo",
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
    }
};
