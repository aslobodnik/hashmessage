import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ExampleContractAbi } from "./abis/ExampleContractAbi";

export default createConfig({
  networks: {
    localhost: {
      chainId: 1337,
      transport: http(process.env.PONDER_RPC_URL),
    },
  },
  contracts: {
    ExampleContract: {
      network: "localhost",
      abi: ExampleContractAbi,
      address: "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
      startBlock: 1,
    },
  },
});
