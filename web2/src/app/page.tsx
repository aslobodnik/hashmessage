"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavBar } from "@/components/NavBar";
import { Checkbox } from "@/components/ui/checkbox";
import { ReloadIcon } from "@radix-ui/react-icons";

import Link from "next/link";
import { useState, useEffect } from "react";
import { sha256, toHex, Hex, parseEther } from "viem";
import { useSignMessage, useSimulateContract, useWriteContract } from "wagmi";

import { localhost } from "wagmi/chains";
import { testifiAbi } from "@/lib/abi";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Home() {
  const [message, setMessage] = useState(""); // captures value of the secret message
  const [lastMessage, setLastMessage] = useState(""); // stores the most recent message
  const [bounty, setBounty] = useState("0"); // captures value of the bounty [optional]

  const [bountyCheck, setBountyCheck] = useState(false); // controls if the bounty input is visible

  const [isSigned, setIsSigned] = useState(false); // controls if current message is signed
  const [txSuccess, setTxSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const [signedMsg, setSignedMsg] = useState("");
  const [hash, setHash] = useState("");

  const [failureReason, setFailureReason] = useState<string>("");

  const BountyCheckChange = (value: boolean) => {
    setBountyCheck(value);
  };

  //sha256 of message
  useEffect(() => {
    if (message.length > 0) {
      setHash(sha256(toHex(message)).replace(/^0x/, ""));
    }
  }, [message]);

  const {
    signMessage,
    status: signingStatus,
    data: signMessageData,
    error: signMessageError,
    reset: resetSignMessage,
  } = useSignMessage();

  useEffect(() => {
    if (signingStatus === "success") {
      setIsSigned(true);
      setSignedMsg(signMessageData || "");
      resetSignMessage();
    }
  }, [signingStatus, signMessageData]);

  useEffect(() => {
    setIsSigned(false);
    setSignedMsg("");
    setTxSuccess(false);
  }, [message]);

  const {
    data: addRecordSimulate,
    isError: isErrorAddRecord,
    isSuccess: canAddRecord,
    failureReason: addRecordFailureReason,
  } = useSimulateContract({
    abi: testifiAbi,
    address: CONTRACT_ADDRESS,
    functionName: "addRecord",
    args: [hash, signedMsg as Hex],
    value: parseEther(bounty),
    chainId: localhost.id,
  });
  console.log(parseEther(bounty));
  // if (isErrorAddRecord) {
  //   const contractError = addRecordFailureReason as any;
  //   const failureReason = contractError.cause?.reason;
  //   setFailureReason(failureReason);
  // }

  const {
    data: _txHash,
    writeContract,
    status: addRecordStatus,
    reset: resetWriteContract,
    isSuccess: addRecordSuccess,
  } = useWriteContract();

  function handleAddRecord() {
    writeContract({
      abi: testifiAbi,
      address: CONTRACT_ADDRESS,
      functionName: "addRecord",
      args: [hash, signedMsg as Hex],
      value: parseEther(bounty),
      chainId: localhost.id,
    });
  }

  function handleSignMessage() {
    signMessage({ message: hash });
    setLastMessage(message);
  }

  useEffect(() => {
    if (addRecordStatus === "success") {
      setTxSuccess(true);
      setTxHash(_txHash || "");
      resetWriteContract(); // reset the status
    }
  }, [addRecordStatus]);

  console.log({ failureReason });
  console.log(txSuccess);
  return (
    <main className="min-h-screen p-6 mx-auto max-w-5xl">
      <NavBar />
      <div className="  max-w-2xl mt-10 mx-auto">
        <h1 className="text-3xl  mb-10  text-gray-600 text-center font-bold">
          Write a Statement
        </h1>
        <div className="flex gap-4">
          <div className="grow   max-w-lg">
            <Label className=" text-gray-400">Statement</Label>
            <Input
              className=" bg-green-50 mt-1  placeholder:text-gray-400"
              placeholder="OG Facaster floor is 10ETH"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            ></Input>
          </div>
          {bountyCheck && (
            <div>
              <Label className=" text-gray-400">Bounty</Label>
              <Input
                className=" bg-green-50 mt-1 placeholder:text-gray-400"
                placeholder="0.1"
                value={bounty}
                onChange={(event) => setBounty(event.target.value)}
              ></Input>
            </div>
          )}
        </div>
        <div className="mt-2 ml-2 flex gap-2">
          <Checkbox
            className=""
            checked={bountyCheck}
            onCheckedChange={BountyCheckChange}
          />

          <Label className="mt-[2px]  text-gray-400">Bounty</Label>
        </div>
        <div className="mt-5 flex flex-col">
          <Label className="text-gray-400">Hash (SHA256)</Label>
          <div className="flex gap-4">
            <div className=" w-[324px] h-16 p-2 rounded mt-1 font-mono text-gray-600 bg-green-100">
              {chunkHash(hash, 32).map((chunk, index) => (
                <div key={index}>{chunk}</div>
              ))}
            </div>
            <Button
              onClick={handleSignMessage}
              disabled={signingStatus === "pending" || isSigned}
              className="h-11 w-36  self-center text-lg"
            >
              {signingStatus === "pending" ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : isSigned ? (
                "Signed"
              ) : (
                "Sign"
              )}
            </Button>{" "}
          </div>
        </div>

        <Button
          disabled={!canAddRecord || txSuccess}
          className="h-11 w-full max-w-lg mt-4 self-center text-lg"
          onClick={handleAddRecord}
        >
          {addRecordStatus === "pending" ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create"
          )}
        </Button>

        <DisplaySuccessMessage
          message={lastMessage}
          isSigned={isSigned}
          txSuccess={txSuccess}
          txHash={txHash}
        />
      </div>
    </main>
  );
}

function chunkHash(sha256Msg: string, chunkSize: number = 16): string[] {
  const cleanMsg = sha256Msg.replace(/^0x/, "");

  return cleanMsg.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
}

// handles displaying success message for both txn & signing
function DisplaySuccessMessage({
  txHash,
  message,
  txSuccess,
  isSigned,
}: {
  txHash?: string;
  message?: string;
  txSuccess?: boolean;
  isSigned?: boolean;
}) {
  // Function declaration for rendering the signed message
  function renderSignedMessage() {
    if (isSigned) {
      return (
        <p>
          {message
            ? `${message} has been signed!`
            : "The document has been signed!"}
        </p>
      );
    }
    return null;
  }

  // Function declaration for rendering the transaction success message
  function renderTxSuccessMessage() {
    if (txSuccess) {
      const url = `https://etherscan.io/tx/${txHash}`;
      return (
        <p>
          {txHash ? (
            <span>
              Success! Transaction{" "}
              <Link
                className=" underline"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hash
              </Link>
            </span>
          ) : (
            "Transaction successful!"
          )}
        </p>
      );
    }
    return null;
  }

  return (
    <div className="mt-4">
      <div className="text-green-500">{renderSignedMessage()}</div>
      <div className="text-blue-500">{renderTxSuccessMessage()}</div>
    </div>
  );
}
