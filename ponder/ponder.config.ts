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
    //ExampleContract:{
    //   network: "localhost",
    //   abi: ExampleContractAbi,
    //   address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    //   startBlock: 3,
    // },
    ExampleContract: {
      network: "baseSepolia",
      abi: ExampleContractAbi,
      address: "0xf604051a9dB102b4F8FB2e8FEb12594d87afE3cC",
      startBlock: 6957850,
    },
  },
});
