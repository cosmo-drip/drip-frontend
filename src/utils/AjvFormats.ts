import { Ajv } from "ajv";

export function addCustomFormats(ajv: Ajv) {
    ajv.addFormat("uint64", {
        type: "string",
        validate: (x: string) =>
            /^\d+$/.test(x) && BigInt(x) <= BigInt("18446744073709551615"),
    });

    ajv.addFormat("uint128", {
        type: "string",
        validate: (x: string) =>
            /^\d+$/.test(x) && BigInt(x) <= BigInt("340282366920938463463374607431768211455"),
    });

    return ajv;
}
