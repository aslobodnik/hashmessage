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
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "hashString",
    inputs: [{ name: "_message", type: "string", internalType: "string" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "pure",
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
      { name: "msgHashSignature", type: "bytes", internalType: "bytes" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "revealMsg",
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
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RevealMsg",
    inputs: [
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
        name: "isCorrect",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
] as const;
