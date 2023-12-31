import Web3 from "web3";
import axios from "axios"; // Import axios
import { contractAbi } from "./contractAbi.js";

async function sendTransaction() {
  // Set your Ethereum account private key and contract address
  const privateKey =
    "0x5f2fcf1d4559add541873ebb6ca23d3b01533262ad4dc2e2489a7989e934d4bd";
  const contractAddress = "0xb15795825FE52193955316A1B578E385F14DceD1"; // Replace with your smart contract address

  // Create a web3 instance with the appropriate provider URL
  const web3 = new Web3(
    "https://testnet.mirrornode.hedera.com/api/v1/transactions"
  );

  // Create a web3 contract instance
  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  // Set the account that will send the transaction
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  // Specify the function and its parameters
  const functionName = "storeDataSmart";
  const functionParams = [1, 23];

  // Build the transaction data
  const transactionData = contract.methods[functionName](
    ...functionParams
  ).encodeABI();

  // Specify the transaction parameters
  const transactionParams = {
    from: account.address,
    to: contractAddress,
    gas: 20000, // Adjust based on your contract's gas requirements
    gasPrice: 1, // You can adjust this value based on the network's gas price
    data: transactionData,
  };

  try {
    // Sign and send the transaction
    const response = await axios.post(
      "https://testnet.mirrornode.hedera.com/api/v1/transactions",
      // Pass the transaction parameters as the request body
      transactionParams
    );

    // Log the entire response for further inspection
    console.log("Response:", response);

    // Assuming the transaction hash is in the response
    const transactionHash = response.data.transactionHash;

    console.log("Transaction Hash:", transactionHash);
  } catch (error) {
    console.error("Error sending transaction:", error.message);

    // Print the full error object for additional details
    // console.error(error);
  }
}

// Call the function
sendTransaction();
