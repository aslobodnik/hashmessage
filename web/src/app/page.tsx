"use client";
import { keccak256, toHex, Hex, Address } from "viem";
import {
  Button,
  Input,
  CopySVG,
  CheckSVG,
  CheckCircleSVG,
  CrossSVG,
  Toggle,
} from "@ensdomains/thorin";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
//import DisplayHash from "./components/DisplayHash";
import {
  useSignMessage,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import hashTruthABI from "../../../contracts/out/HashTruth.sol/HashTruth.json";
import { sha256 } from "@noble/hashes/sha256";

//todo: componentize as much as you
//todo: create nice table with up to 5 records
//todo: figure out how to import abi from foundry out without copying / pasting
//todo: redesign page to be cleaner -- show signature and hash in table

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

type Record = {
  id: number;
  message: string;
  msgHashSha256: string;
  msgAuthor: Address;
  msgRevealor: Address;
  msgHashSignature: string;
};

type RecordTableProps = {
  records: Record[];
};

export default function Home() {
  const [secretMsg, setSecretMsg] = useState("");
  const [hashedMsg, setHashedMsg] = useState("");
  const [sha256Msg, setSha256Msg] = useState("");

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: sha256Msg,
  });

  const handleButtonClick = () => {
    signMessage();
  };

  useEffect(() => {
    const hash = keccak256(
      toHex("\x19Ethereum Signed Message:\n" + sha256Msg.length + sha256Msg)
    );
    setHashedMsg(hash);
  }, [sha256Msg]);

  useEffect(() => {
    const hashArray = sha256(secretMsg);
    const hashHex = Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setSha256Msg(hashHex);
  }, [secretMsg]);

  return (
    <main className="flex min-h-screen flex-col  max-w-3xl w-full mx-auto px-1">
      <NavBar />
      <h1 className="text-2xl font-bold text-center mb-4 opacity-80">
        Secret Keeper
      </h1>
      <div className="sm:px-16 px-4 flex-col">
        <Input
          label="Predication"
          placeholder="ETH will hit $10,000 before 2030."
          value={secretMsg}
          onChange={(event) => setSecretMsg(event.target.value)}
        />
        <div className="mx-auto w-fit">
          <div className="pt-4  pl-2  text-custom-blue-gray font-bold">
            Sha256
          </div>
          <div className="flex">
            <div className="  w-fit rounded-lg px-4 py-2 mt-2   mb-3 bg-white">
              {chunkHash(sha256Msg).map((chunk, index) => (
                <div className="font-mono my-1 mx-auto w-fit" key={index}>
                  {chunk}
                </div>
              ))}
            </div>
            <div className="ml-4 mt-2">
              <Button onClick={handleButtonClick} width="45">
                Sign
              </Button>
              <div className="mt-4">
                <AddRecord msgHashSha256={sha256Msg} msgHashSignature={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <ViewRecordCount />
      </div>

      <div>
        <RecordTable records={dummyRecords} />
      </div>
    </main>
  );
}
function AddRecord({
  msgHashSha256,
  msgHashSignature,
}: {
  msgHashSha256: string;
  msgHashSignature: Hex | undefined;
}) {
  console.log("hash", msgHashSha256, "signature", msgHashSignature);
  const { write, data, isLoading, error } = useContractWrite({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: hashTruthABI.abi,
    functionName: "addRecord",
    args: [msgHashSha256, msgHashSignature], // Use props here
  });

  const handleClick = () => {
    write();
  };

  if (isLoading) return <div>Transaction in progress...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={msgHashSignature === undefined}
        width="45"
      >
        Create
      </Button>
    </>
  );
}

const ViewRecordCount = () => {
  const { data, isError, isLoading } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: hashTruthABI.abi,
    functionName: "getRecordsCount",
  });
  const displayData = data ? data.toString() : "No data";

  return (
    <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
      Total Records: {displayData}
    </div>
  );
};

function RevealMessage({ recordId = BigInt(1) }: { recordId: bigint }) {
  const [message, setMessage] = useState("");
  const [userSha256Msg, setUserSha256Msg] = useState("");
  const [isMatch, setIsMatch] = useState<boolean>();

  useEffect(() => {
    const hashArray = sha256(message);
    const hashHex = Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setUserSha256Msg(hashHex);
  }, [message]);

  // Prepare the contract write operation
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: hashTruthABI.abi,
    functionName: "revealMsg",
    args: [message, recordId],
  });

  const { data, isError, isLoading } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: [
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
    ] as const,
    functionName: "records",
    args: [recordId], // passing id as an argument to the getRecord function
  });

  // Execute the contract write operation
  const {
    write,
    data: revealData,
    isError: revealIsError,
    isLoading: revealIsLoading,
  } = useContractWrite(config);

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (write) {
      write(); // Execute the transaction only if write is defined
    } else {
      console.error("Write function is not available.");
    }
  };
  useEffect(() => {
    if (!isLoading && !isError && data) {
      const recordSha256Msg = data[2];
      setIsMatch(recordSha256Msg === userSha256Msg);
    }
  }, [data, isLoading, isError, userSha256Msg]);
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
          className="border border-gray-300 rounded-md p-2 pr-5 w-full" // Increased right padding
        />

        <div className="-ml-5 flex my-auto">
          {isMatch !== undefined &&
            (isMatch ? (
              <CheckCircleSVG className=" text-green-600" />
            ) : (
              message && <CrossSVG className="text-red-300" />
            ))}
        </div>

        {/* <button type="submit" className="mt-2">
          Reveal Message
        </button> */}
      </form>
    </div>
  );
}

function RecordTable({ records }: RecordTableProps) {
  const [showInput, setShowInput] = useState<boolean>(false);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowInput(event.target.checked);
    console.log("toggle", event.target.checked);
  };
  return (
    <>
      <div className="sm:w-4/5 mx-2 my-0 sm:mx-auto bg-white rounded-lg p-5 sm:min-w-[620px] h-fit">
        <div className="text-lg mb-4 font-semibold flex justify-between items-center w-full">
          <div className="flex-grow text-center">Messages</div>
          <div className=" text-sm text-gray-500 pr-2">Show Input</div>
          <Toggle checked={showInput} onChange={handleToggle} size="small" />
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          {records.map((record, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="font-semibold">Author:</div>
              <div className="mb-2 pt-2">
                <ShortAddressDisplay address={record.msgAuthor} />
              </div>
              <div className="font-semibold">Hash:</div>
              <div className="mb-2 pt-2">
                {chunkHash(record.msgHashSha256, 32).map((chunk, index) => (
                  <div className="font-mono" key={index}>
                    {chunk}
                  </div> // Added parentheses around parameters and key prop
                ))}
              </div>
              <div className="font-semibold">Message:</div>
              <div>
                {record.message === "" ? (
                  <div className="pt-2">
                    <RevealMessage recordId={BigInt(1)} />
                  </div>
                ) : (
                  <div className="pt-2">{record.message}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <table className="w-full min-w-[360px] border-collapse hidden sm:table">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left w-16 pl-3 py-2 opacity-60">Author</th>
              <th className="text-right w-16 pl-2 pr-4 opacity-60">Hash</th>
              <th className="text-right pl-2 pr-2 opacity-60">Message</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-4">
                  <DisplayAddress address={record.msgAuthor} />
                </td>
                <td className="flex justify-end p-4">
                  <DisplayHash hash={record.msgHashSha256} />
                </td>
                {record.message === "" ? (
                  <td className="pr-2 text-right p-4">
                    {showInput && <RevealMessage recordId={BigInt(1)} />}
                  </td>
                ) : (
                  <td className="pr-2 text-right p-4">{record.message}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const dummyRecords: Record[] = [
  {
    id: 1,
    message: "Hello, this is message one",
    msgHashSha256:
      "a441b15fe9a3cf56661190a0b93b9dec7d04127288cc87250967cf3b52894d11",
    msgAuthor: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    msgRevealor: "0x0",
    msgHashSignature: "signature1",
  },
  {
    id: 2,
    message: "Second message content",
    msgHashSha256:
      "a441b15fe9a3cf56661190a0b93b9dec7d04127288cc87250967cf3b52894d11",
    msgAuthor: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    msgRevealor: "0x0",
    msgHashSignature: "signature2",
  },
  {
    id: 3,
    message: "Another example message",
    msgHashSha256:
      "a441b15fe9a3cf56661190a0b93b9dec7d04127288cc87250967cf3b52894d11",
    msgAuthor: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    msgRevealor: "0x0",
    msgHashSignature: "signature3",
  },
  {
    id: 4,
    message: "",
    msgHashSha256:
      "a441b15fe9a3cf56661190a0b93b9dec7d04127288cc87250967cf3b52894d11",
    msgAuthor: "0x45678",
    msgRevealor: "0x0",
    msgHashSignature: "signature4",
  },
  {
    id: 5,
    message: "Final dummy message",
    msgHashSha256:
      "a441b15fe9a3cf56661190a0b93b9dec7d04127288cc87250967cf3b52894d11",
    msgAuthor: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    msgRevealor: "0x0",
    msgHashSignature: "signature5",
  },
];

function truncateAddress(address: Address, length: number = 4): string {
  return `${address.substring(0, length)}...${address.substring(
    address.length - length
  )}`;
}

function truncateHash(sha256Msg: string, length: number = 6): string {
  return `${sha256Msg.substring(0, length)}...${sha256Msg.substring(
    sha256Msg.length - length
  )}`;
}

// splits sha256 hash into chunks of 16 characters
function chunkHash(sha256Msg: string, chunkSize: number = 16): string[] {
  return sha256Msg.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
}

function DisplayHash({ hash }: { hash: string }) {
  const truncatedHash = truncateHash(hash, 4);
  const hashChunks = chunkHash(hash, 16);
  const [showCheck, setShowCheck] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
    }, 1000); // 1000 milliseconds = 1 second
  };

  return (
    <div className="relative group  w-[16ch]">
      <div className="flex justify-end cursor-pointer group">
        <span className="relative inline-block">
          {truncatedHash}
          {showCheck ? (
            <CheckSVG className="opacity-50 text-green-600 absolute -right-5 top-0" />
          ) : (
            <CopySVG
              className="opacity-0 duration-500 absolute -right-5 top-0 group-hover:opacity-50"
              onClick={copyToClipboard}
            />
          )}
        </span>
      </div>
      <div className="absolute  group-hover:block bg-white shadow-lg pt-2 rounded z-10 w-[18ch] transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
        {hashChunks.map((chunk: string, index: number) => (
          <div className="font-mono my-1 mx-auto w-fit" key={index}>
            {chunk}
          </div>
        ))}
      </div>
    </div>
  );
}

function DisplayAddress({ address }: { address: Address }) {
  const [showCheck, setShowCheck] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
    }, 1000); // 1000 milliseconds = 1 second
  };

  const truncatedAddress = truncateAddress(address, 4);

  return (
    <div className="relative group w-fit">
      <span className="cursor-pointer flex gap-2 justify-end group">
        <span className="relative inline-block">
          {truncatedAddress}
          {showCheck ? (
            <CheckSVG className="opacity-50 text-green-600 absolute -right-5 top-0" />
          ) : (
            <CopySVG
              className="opacity-0 duration-500 absolute -right-5 top-0 group-hover:opacity-50"
              onClick={copyToClipboard}
            />
          )}
        </span>
      </span>
      <div className="absolute -ml-4 px-4 whitespace-nowrap py-2 bg-white shadow-lg rounded z-10 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
        {address}
      </div>
    </div>
  );
}

function ShortAddressDisplay({ address }: { address: Address }) {
  const [isFullAddressVisible, setIsFullAddressVisible] = useState(false);

  function handleAddressClick() {
    setIsFullAddressVisible(!isFullAddressVisible);
  }

  const displayAddress = isFullAddressVisible
    ? address
    : `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;

  return (
    <div className="mb-2 cursor-pointer" onClick={handleAddressClick}>
      {displayAddress}
    </div>
  );
}
