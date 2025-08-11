export type NetworkConfig = {
    name: string;
    chainId: string;
    denom: string;
    governanceAddress: string;
    rpc: string;
    prefix: string
    api: string | undefined;
    contracts: string[]
};

export const networks: NetworkConfig[] = [
    {
        name: "Drip Testnet",
        chainId: "testdrip-1",
        denom: "uatom",
        governanceAddress: "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",
        rpc: process.env.REACT_APP_RPC_URL!,
        api: process.env.REACT_APP_API_URL!,
        prefix: "cosmos",
        contracts: ["11", "12", "13", "14", "15", "22", "23"]
    },
    {
        name: "Drip Testnet2",
        chainId: "testdrip-1",
        denom: "uosmo",
        governanceAddress: "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",
        rpc: process.env.REACT_APP_RPC_URL || '',
        api: process.env.REACT_APP_API_URL,
        prefix: "cosmos",
        contracts: ["1", "2", "3", "4", "5"]
    },
];
