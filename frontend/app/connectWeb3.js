import { configureChains, createConfig, mainnet, sepolia} from 'wagmi'
import { publicProvider, alchemyProvider } from 'wagmi/providers/public'
import { getDefaultConfig } from "connectkit";

// setup chains and providers 
const { chains, provider } = configureChains(
  [mainnet, sepolia],
  [publicProvider()],
)

export const config = createConfig(
  getDefaultConfig({
    appName: "ERC20Votes-Ballot",
    provider: provider,
    chains: chains
  })
)

/*
const { chains, provider } = configureChains(
  [mainnet, sepolia],
  [publicProvider()],
)
export const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
})
*/