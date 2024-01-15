import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ExampleContractAbi } from "./abis/ExampleContractAbi";

export default createConfig({
  networks: {
    localhost: {
      chainId: 1337,
      transport: http(process.env.PONDER_RPC_URL),
    },
    baseSepolia: {
      chainId: 84532,
      transport: http(process.env.PONDER_RPC_SEPOLIA_URL),
    },
  },
  contracts: {
    ExampleContract: {
      network: "localhost",
      abi: ExampleContractAbi,
      address: "0x09635F643e140090A9A8Dcd712eD6285858ceBef",
      startBlock: 1,
    },
    // SepoliaContract: {
    //   network: "baseSepolia",
    //   abi: ExampleContractAbi,
    //   address: "0xA63cf205dF9D8E84c5611fe0A244211f9c00bf2d",
    //   startBlock: 1,
    // },
  },
});
