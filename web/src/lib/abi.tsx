// Define the structure of a single ABI item
interface AbiItem {
  type: string;
  name?: string;
  inputs?: { name: string; type: string; internalType: string }[];
  outputs?: { name: string; type: string; internalType: string }[];
  stateMutability?: string;
  anonymous?: boolean;
}

// Define the type for the ABI array
type Abi = AbiItem[];

// Import the ABI from the JSON file
import hashTruthAbiJson from "../../../contracts/out/HashTruth.sol/HashTruth.json";

// Cast the imported ABI to the Abi type
const hashTruthAbi: Abi = hashTruthAbiJson.abi as Abi;

// Export the typed ABI for use in other parts of your application
export default hashTruthAbi;
