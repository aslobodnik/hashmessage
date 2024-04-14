import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ExampleContractAbi } from "./abis/ExampleContractAbi";
import { base } from "viem/chains";

export default createConfig({
  networks: {
    // localhost: {
    //   chainId: 1337,
    //   transport: http(process.env.PONDER_RPC_URL),
    // },
    base: {
      chainId: base.id,
      transport: http(process.env.PONDER_RPC_BASE_URL),
      maxRequestsPerSecond: 5,
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
      network: "base",
      abi: ExampleContractAbi,
      address: "0xA63cf205dF9D8E84c5611fe0A244211f9c00bf2d",
      startBlock: 11451188,
    },
  },
});
