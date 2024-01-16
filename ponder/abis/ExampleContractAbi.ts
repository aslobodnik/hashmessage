export const ExampleContractAbi = [
  {
    type: "function",
    name: "addRecord",
    inputs: [
      {
        name: "_msgHashSha256",
        type: "string",
        internalType: "string",
      },
      {
        name: "_msgHashSignature",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getRecordsCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextRecordId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "records",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "message", type: "string", internalType: "string" },
      { name: "msgHashSha256", type: "string", internalType: "string" },
      { name: "msgAuthor", type: "address", internalType: "address" },
      { name: "msgRevealor", type: "address", internalType: "address" },
      {
        name: "msgHashSignature",
        type: "bytes",
        internalType: "bytes",
      },
      { name: "bounty", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "revealAndClaimBounty",
    inputs: [
      { name: "_message", type: "string", internalType: "string" },
      { name: "_recordId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "RecordAdded",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "msgHashSha256",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "msgAuthor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "msgHashSignature",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "bounty",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RevealAndClaimBounty",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "message",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "msgRevealor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "bounty",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
] as const;
