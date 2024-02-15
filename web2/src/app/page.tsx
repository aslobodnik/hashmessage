"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NavBar } from "@/components/NavBar";
import { Checkbox } from "@/components/ui/checkbox";
import { ReloadIcon } from "@radix-ui/react-icons";

import Link from "next/link";
import { useState, useEffect } from "react";
import { sha256, toHex, Hex } from "viem";
import { useSignMessage, useSimulateContract, useWriteContract } from "wagmi";
import { localhost } from "wagmi/chains";
import { testifiAbi } from "@/lib/abi";

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export default function Home() {
  const [message, setMessage] = useState(""); // captures value of the secret message
  const [lastMessage, setLastMessage] = useState(""); // stores the most recent message

  const [bountyCheck, setBountyCheck] = useState(false); // controls if the bounty input is visible

  const [isSigned, setIsSigned] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTxSuccess, setTxShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const [signedMsg, setSignedMsg] = useState("");
  const [hash, setHash] = useState("");

  const BountyCheckChange = (value: boolean) => {
    setBountyCheck(value);
  };

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
  }, [message]);

  const {
    data: addRecordSimulate,
    isError: isErrorAddRecord,
    isSuccess: isSuccessAddRecord,
  } = useSimulateContract({
    abi: testifiAbi,
    address: CONTRACT_ADDRESS,
    functionName: "addRecord",
    args: [hash, signedMsg as Hex],
    value: 0n,
    chainId: localhost.id,
  });

  const {
    data: _txHash,
    writeContract,
    status: createRecordStatus,
    reset: resetWriteContract,
  } = useWriteContract();

  function handleWriteContract() {
    writeContract({
      abi: testifiAbi,
      address: CONTRACT_ADDRESS,
      functionName: "addRecord",
      args: [hash, signedMsg as Hex],
      value: 0n,
      chainId: localhost.id,
    });
  }

  function handleSignMessage() {
    signMessage({ message: hash });
    setLastMessage(message);
  }

  useEffect(() => {
    if (signingStatus === "success") {
      setShowSuccess(true);
    }
    const timer = setTimeout(() => setShowSuccess(false), 3000);

    return () => clearTimeout(timer);
  }, [signingStatus]);

  useEffect(() => {
    if (createRecordStatus === "success") {
      setTxShowSuccess(true);
      setTxHash(_txHash || "");
      resetWriteContract(); // reset the status
      setMessage(""); // reset the message
    }
  }, [createRecordStatus]);

  console.log({ isSuccessAddRecord });
  return (
    <main className="min-h-screen p-6 mx-auto max-w-5xl">
      <NavBar />
      <div className="  max-w-2xl mt-10 mx-auto">
        <h1 className="text-3xl  mb-10  text-gray-600 text-center font-bold">
          Make A Prediction
        </h1>
        <div className="flex gap-4">
          <div className="grow   max-w-lg">
            <Label className=" text-gray-400">Prediction</Label>
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
        {/* TODO:add success
        TODO: add disable button after submission*/}
        <Button
          disabled={!isSuccessAddRecord}
          className="h-11 w-full max-w-lg mt-4 self-center text-lg"
          onClick={handleWriteContract}
        >
          {createRecordStatus === "pending" ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Prediction"
          )}
        </Button>

        <DisplaySuccessMessage message={lastMessage} isSigned={isSigned} />
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
  console.log(message);
  return (
    <div className="mt-4 text-green-500">
      {isSigned ? `${message} signed!` : ""}
    </div>
  );
}
