import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ExampleContractAbi } from "./abis/ExampleContractAbi";

export default createConfig({
  networks: {
    localhost: {
      chainId: 1337,
      transport: http(process.env.PONDER_RPC_URL),
    },
    // baseSepolia: {
    //   chainId: 84532,
    //   transport: http(process.env.PONDER_RPC_SEPOLIA_URL),
    // },
  },
  contracts: {
    ExampleContract: {
      network: "localhost",
      abi: ExampleContractAbi,
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      startBlock: 0,
    },
    // ExampleContract: {
    //   network: "baseSepolia",
    //   abi: ExampleContractAbi,
    //   address: "0xc6a83d8840e0C01A7B7071B268214e3559b3973C",
    //   startBlock: 4764391,
    // },
  },
});
