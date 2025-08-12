export type NetworkConfig = {
    name: string;
    chainId: string;
    rpc: string;
    prefix: string;
    api: string;
    contracts: string[];
    denom?: string;
    governanceAddress?: string;
};

export const networks: NetworkConfig[] = [
    {
        name: "Drip Testnet",
        chainId: "testdrip-1",
        rpc: process.env.REACT_APP_RPC_URL!,
        api: process.env.REACT_APP_API_URL!,
        prefix: "cosmos",
        contracts: ["11", "12", "13", "14", "15", "22", "23"]
    },
    {
        name: "Cosmos Hub Testnet",
        chainId: "theta-testnet-001",
        rpc: "https://rpc.provider-sentry-01.ics-testnet.polypore.xyz",
        api: "https://rest.provider-sentry-01.ics-testnet.polypore.xyz",
        prefix: "cosmos",
        contracts: ["1"]
    },
    {
        name: "Osmosis Testnet",
        chainId: "osmo-test-5",
        rpc: "https://rpc.osmotest5.osmosis.zone",
        api: "https://lcd.osmotest5.osmosis.zone",
        prefix: "osmo",
        contracts: ["1"]
    }
];
