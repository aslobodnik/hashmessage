import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ExampleContractAbi } from "./abis/ExampleContractAbi";

export default createConfig({
  networks: {
    // localhost: {
    //   chainId: 1337,
    //   transport: http(process.env.PONDER_RPC_URL),
    // },
    baseSepolia: {
      chainId: 84532,
      transport: http(process.env.PONDER_RPC_SEPOLIA_URL),
    },
  },
  contracts: {
    // ExampleContract: {
    //   network: "localhost",
    //   abi: ExampleContractAbi,
    //   address: "0x09635F643e140090A9A8Dcd712eD6285858ceBef",
    //   startBlock: 1,
    // },
    ExampleContract: {
      network: "baseSepolia",
      abi: ExampleContractAbi,
      address: "0xc6a83d8840e0C01A7B7071B268214e3559b3973C",
      startBlock: 4764391,
    },
  },
});
