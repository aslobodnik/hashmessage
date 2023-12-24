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
    <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
      <table>
        <tbody>
          <tr>
            <th>ID:</th>
            <td>{recordId.toString()}</td>
          </tr>
          <tr>
            <th>Message:</th>
            <td>{message}</td>
          </tr>
          <tr>
            <th>Message Hash (SHA-256):</th>
            <td>{msgHashSha256}</td>
          </tr>
          <tr>
            <th>Message Author:</th>
            <td>{msgAuthor}</td>
          </tr>
          <tr>
            <th>Message Revealor:</th>
            <td>{msgRevealor}</td>
          </tr>
          <tr>
            <th>Message Hash Signature:</th>
            <td>{msgHashSignature}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
