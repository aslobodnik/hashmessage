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
      address: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
      startBlock: 1,
    },
  },
});
