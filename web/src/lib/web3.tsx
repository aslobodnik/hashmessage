import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { base, localhost } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const chains = [base, localhost];

export const { publicClient, webSocketPublicClient } = configureChains(chains, [
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "Hash Name",
  projectId: "d6c989fb5e87a19a4c3c14412d5a7672",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
