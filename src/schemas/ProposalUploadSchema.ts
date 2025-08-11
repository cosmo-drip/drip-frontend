import { z } from "zod";

export const proposalUploadSchema = z.object({
    messages: z.array(
        z.object({
            "@type": z.string().includes("/cosmos.distribution.v1beta1.MsgCommunityPoolSpend"),
            authority: z.string(),
            recipient: z.string(),
            amount: z.array(
                z.object({
                    denom: z.string(),
                    amount: z.string().regex(/^\d+$/, "amount must be number"),
                })
            ),
        })
    ),
    metadata: z.string(),
    deposit: z.string().regex(/^\d+[a-zA-Z]+$/, "Format must be numberDenom, for example 100000uatom"),
    title: z.string(),
    summary: z.string(),
    expedited: z.boolean(),
});