import { useState, useEffect } from 'react'
import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
    interface Window extends KeplrWindow {}
}

interface UseKeplrResult {
    connected: boolean
    address: string | null
    connect: () => Promise<void>
    error: string | null
    isKeplrAvailable: boolean
    submitCommunitySpendProposal?: () => Promise<void>
}

const CHAIN_ID = 'testdrip-1'
const CHAIN_INFO = {
    "chainId": "testdrip-1",
    "chainName": "drip",
    "rpc": process.env.REACT_APP_RPC_URL!,
    "rest": process.env.REACT_APP_API_URL!,
    "bip44": {
        "coinType": 118
    },
    // "coinType": 118,
    "bech32Config": {
        "bech32PrefixAccAddr": "cosmos",
        "bech32PrefixAccPub": "cosmospub",
        "bech32PrefixValAddr": "cosmosvaloper",
        "bech32PrefixValPub": "cosmosvaloperpub",
        "bech32PrefixConsAddr": "cosmosvalcons",
        "bech32PrefixConsPub": "cosmosvalconspub"
    },
    "currencies": [
        {
            "coinDenom": "ATOM",
            "coinMinimalDenom": "uatom",
            "coinDecimals": 6,
            "coinGeckoId": "cosmos"
        }
    ],
    "feeCurrencies": [
        {
            "coinDenom": "ATOM",
            "coinMinimalDenom": "uatom",
            "coinDecimals": 6,
            "coinGeckoId": "cosmos",
            "gasPriceStep": {
                "low": 0.01,
                "average": 0.025,
                "high": 0.03
            }
        }
    ],
    // "gasPriceStep": {
    //     "low": 0.01,
    //     "average": 0.025,
    //     "high": 0.03
    // },
    "stakeCurrency": {
        "coinDenom": "ATOM",
        "coinMinimalDenom": "uatom",
        "coinDecimals": 6,
        "coinGeckoId": "cosmos"
    },
    "features": []
}

export const useKeplr = (): UseKeplrResult => {
    const [connected, setConnected] = useState(false)
    const [address, setAddress] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isKeplrAvailable, setIsKeplrAvailable] = useState(false)

    useEffect(() => {
        if (window.keplr) {
            setIsKeplrAvailable(true)
        } else {
            setError('Keplr is not found. Make sure the extension is installed.')
        }
    }, [])

    const connect = async () => {
        try {
            if (!window.keplr) throw new Error('Keplr is not found')

            if (window.keplr.experimentalSuggestChain) {
                try {
                    await window.keplr.experimentalSuggestChain(CHAIN_INFO)
                } catch (suggestErr: any) {
                    console.warn('Failed to suggest custom network:', suggestErr.message)
                }
            }

            await window.keplr.enable(CHAIN_ID)

            const key = await window.keplr.getKey(CHAIN_ID)
            setAddress(key.bech32Address)
            setConnected(true)
            setError(null)
        } catch (err: any) {
            setError(err.message || 'Error connecting to Keplr')
            setConnected(false)
            setAddress(null)
        }
    }

    return {
        connected,
        address,
        connect,
        error,
        isKeplrAvailable,
    }
}
