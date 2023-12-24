"use client";
import { Address, keccak256, toHex } from "viem";
import { Button, Input, Textarea, RecordItem } from "@ensdomains/thorin";
import { useState, useEffect, ChangeEvent } from "react";
import NavBar from "./components/NavBar";
import { useSignMessage, useContractRead, useContractWrite } from "wagmi";
import counterABI from "../../../contracts/out/Counter.sol/Counter.json";
import hashTruthABI from "../../../contracts/out/HashTruth.sol/HashTruth.json";
import { recoverMessageAddress, Hex } from "viem";
import { sha256 } from "@noble/hashes/sha256";

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

  useEffect(() => {
    if (isSuccess) {
      console.log({ data });
    }
  }, [isSuccess, data]);

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
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <Input
          label="Secret Message"
          placeholder="Bull market is starting..."
          value={secretMsg}
          onChange={(event) => setSecretMsg(event.target.value)}
        />
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <RecordItem keyLabel="sha256" value={sha256Msg}>
          {sha256Msg}
        </RecordItem>
      </div>

      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <RecordItem keyLabel="keccak" value={hashedMsg}>
          {hashedMsg}
        </RecordItem>
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <RecordItem keyLabel="signature" value={data ?? ""}>
          {data ?? ""}
        </RecordItem>
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
      </div>
    </main>
  );
}
const AddRecord: React.FC<AddRecordProps> = ({
  msgHashSha256,
  msgHashSignature,
}) => {
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
};

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

const ViewRecord: React.FC<{ id: number }> = ({ id }) => {
  const { data, isError, isLoading } = useContractRead({
    address: "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
    abi: hashTruthABI.abi,
    functionName: "records",
    args: [id], // passing id as an argument to the getRecord function
  });
  const [
    recordId,
    message,
    msgHashSha256,
    msgAuthor,
    msgRevealor,
    msgHashSignature,
  ] = data as [Number, string, string, string, string, string];

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
              <TruncatedHash hash={msgHashSha256} />
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
};

const TruncatedHash: React.FC<{ hash: string }> = ({ hash }) => {
  const truncatedHash = `${hash.substring(0, 6)}...${hash.substring(
    hash.length - 6
  )}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    // Optionally, you could add feedback to the user (like a tooltip) that the text has been copied.
  };

  const hashChunks = hash.match(/.{1,16}/g) || [];

  return (
    <div className="relative group">
      <div className="truncate cursor-pointer" onClick={copyToClipboard}>
        {truncatedHash}
        <button className="ml-2 underline text-blue-500 hover:text-blue-700">
          Copy
        </button>
      </div>
      <div className="absolute hidden group-hover:block bg-white shadow-lg p-2 rounded z-10 whitespace-pre-line transition-opacity duration-500 ">
        {hashChunks.map((chunk: string, index: number) => (
          <div className="font-mono my-1" key={index}>
            {chunk}
          </div>
        ))}
      </div>
    </div>
  );
};
