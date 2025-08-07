interface FormValues {
    contractRecipient: string;
    recipient: string;
    upperLimitAmount: { amount: string; denom: string };
    amountUsd: { amount: string; denom: string };
    contractId: string;
    salt: { string: string };
    title: string;
    summary: string;
    metadata: string;
    deposit: { amount: string; denom: string };
}


export const buildProposalPayload = (data: FormValues) => ({
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
})