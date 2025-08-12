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
    const msgPayload = {
        admin: data.sender,
        funding_expiration: {
            at_height: 1754800000,
        },
        payment_initiator_addrs: [data.sender],
        price_feeder_addr: data.sender,
        quote_asset_limit: {
            amount: data.upperLimitAmount.amount,
            denom: data.upperLimitAmount.denom,
        },
        recipient_addr: data.recipient,
        settlement_asset_limit: {
            amount: data.amountUsd.amount,
            denom: data.amountUsd.denom,
        },
        withdrawal_ttl: {
            default_sec: 32629444,
            max_sec: 81188572,
        },
    };
    return {
        messages: [
            {
                "@type": "/cosmwasm.wasm.v1.MsgInstantiateContract2",
                sender: data.sender,
                admin: data.sender,
                code_id: data.contractId,
                label: "DripTest",
                msg: msgPayload,
                funds: [],
                salt: data.salt.base64,
                fix_msg: false
            },
            {
                "@type": "/cosmos.distribution.v1beta1.MsgCommunityPoolSpend",
                authority: data.sender,
                recipient: data.contractRecipient,
                amount: [{denom: data.upperLimitAmount.denom, amount: data.upperLimitAmount.amount}],
            },
        ],
        metadata: data.metadata,
        deposit: `${data.deposit.amount}${data.deposit.denom}`,
        title: data.title,
        summary: data.summary,
    }
};
