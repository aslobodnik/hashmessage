"use client";
import { keccak256, toHex, Hex } from "viem";
import { Button, Input, RecordItem } from "@ensdomains/thorin";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import DisplayHash from "./components/DisplayHash";
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

type AddRecordProps = {
  msgHashSha256: string;
  msgHashSignature: Hex | undefined;
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

  const truncatedHash = `${sha256Msg.substring(0, 6)}...${sha256Msg.substring(
    sha256Msg.length - 6
  )}`;
  const hashChunks = sha256Msg.match(/.{1,16}/g) || [];

  return (
    <main className="flex min-h-screen flex-col  max-w-3xl w-full mx-auto px-1">
      <NavBar />
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <Input
          label="Secret Message"
          placeholder="Bull market is starting..."
          value={secretMsg}
          onChange={(event) => setSecretMsg(event.target.value)}
        />
      </div>
      <div className="relative group max-w-sm w-full sm:w-1/2 mx-auto  bg-white  rounded-lg mb-8">
        <div className="truncate cursor-pointer py-2 px-2">
          <span className=" text-gray-400 font-bold">sha256: </span>
          {truncatedHash}
        </div>
        <div className="absolute ml-[200px]  -mt-20 opacity-0 group-hover:opacity-100 bg-white shadow-lg p-2 rounded-lg z-10 whitespace-pre-line transition-opacity duration-1500">
          {hashChunks.map((chunk: string, index: number) => (
            <div className="font-mono my-1" key={index}>
              {chunk}
            </div>
          ))}
        </div>
      </div>

      <div className="pb-4  mx-auto">
        <Button onClick={handleButtonClick} width="45">
          Sign
        </Button>
      </div>
      <div className="pb-4  mx-auto">
        <AddRecord msgHashSha256={sha256Msg} msgHashSignature={data} />
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <ViewRecordCount />
        <ViewRecord id={0} />
        <ViewRecord id={1} />
        <ViewRecord id={3} />
        <ViewRecord id={4} />
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <RevealMessage />
      </div>
    </main>
  );
}
function AddRecord({ msgHashSha256, msgHashSignature }: AddRecordProps) {
  console.log("hash", msgHashSha256, "signature", msgHashSignature);
  const { write, data, isLoading, error } = useContractWrite({
    address: "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
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
      <Button onClick={handleClick} width="45">
        Add Record
      </Button>
    </>
  );
}

const ViewRecordCount = () => {
  const { data, isError, isLoading } = useContractRead({
    address: "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
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

function ViewRecord({ id }: { id: number }) {
  const bigId = BigInt(id);
  const { data, isError, isLoading } = useContractRead({
    address: "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
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
    args: [bigId], // passing id as an argument to the getRecord function
  });
  console.log("data", data);
  const [
    recordId,
    message,
    msgHashSha256,
    msgAuthor,
    msgRevealor,
    msgHashSignature,
  ] = data ?? [];

  console.log("data", data);

  return (
    <div className="w-4/5 my-0 mx-auto bg-white rounded-lg p-5 min-w-[720px] h-fit">
      <div className="text-lg mb-4 text-center font-semibold">Messages</div>
      <table className="w-full min-w-[360px] border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pl-3 py-2 opacity-60">Author</th>
            <th className="text-right pl-2 pr-4 py-2 opacity-60">Hash</th>
            <th className="text-right pl-2 pr-4 py-2 opacity-60">Message</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="pl-3 break-all py-4">slobo.eth</td>
            <td className="text-right break-all pr-4 py-2">
              <DisplayHash hash={msgHashSha256 || ""} />
            </td>{" "}
            <td className="text-right p-0 flex items-center">
              <div className="w-full">
                {message === "" ? (
                  <input
                    type="text"
                    className="w-full text-right border-cyan-500 border-2 rounded-lg p-2"
                  />
                ) : (
                  <span>{message}</span> // You can replace this with any other content you wish to display when message is not empty
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function RevealMessage() {
  const [message, setMessage] = useState("");
  const [recordId, setRecordId] = useState(0);

  // Prepare the contract write operation
  const { config } = usePrepareContractWrite({
    address: "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
    abi: hashTruthABI.abi,
    functionName: "revealMsg",
    args: [message, recordId],
  });

  // Execute the contract write operation
  const { write, data, isError, isLoading } = useContractWrite(config);

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (write) {
      write(); // Execute the transaction only if write is defined
    } else {
      console.error("Write function is not available.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <input
          type="number"
          value={recordId}
          onChange={(e) => setRecordId(parseInt(e.target.value, 10))}
          placeholder="Enter record ID"
        />
        <button type="submit">Reveal Message</button>
      </form>
      {/* Render your component based on data, isError, isLoading */}
    </div>
  );
}
