export const contractAbi = [
  {
    inputs: [],
    name: "retrieveDataSmart",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "unqId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hashcode",
            type: "uint256",
          },
        ],
        internalType: "struct Data.UserData[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_unqId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_hashcode",
        type: "uint256",
      },
    ],
    name: "storeDataSmart",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
