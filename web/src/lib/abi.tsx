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
import testifiAbiJson from "../../../contracts/out/Testifi.sol/Testifi.json";

// Cast the imported ABI to the Abi type
const testifiAbi: Abi = testifiAbiJson.abi as Abi;

// Export the typed ABI for use in other parts of your application
export default testifiAbi;
