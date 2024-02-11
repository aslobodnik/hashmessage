"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NavBar } from "@/components/NavBar";
import { Checkbox } from "@/components/ui/checkbox";

import Link from "next/link";
import { useState, useEffect } from "react";
import { sha256, toHex } from "viem";
import { useSignMessage } from "wagmi";

export default function Home() {
  const [message, setMessage] = useState("");
  const [bountyCheck, setBountyCheck] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signedMsg, setSignedMsg] = useState("");
  const [hash, setHash] = useState("");

  const BountyCheckChange = (value: boolean) => {
    setBountyCheck(value);
  };

  useEffect(() => {
    if (message.length > 0) {
      setHash(sha256(toHex(message)));
    }
  }, [message]);

  const {
    signMessage,
    status: signingStatus,
    data: SignMessageData,
  } = useSignMessage({
    mutation: { onMutate({ message: hash }) {} },
  });

  useEffect(() => {
    if (signingStatus === "success") {
      setIsSigned(true);
      setSignedMsg(SignMessageData || "");
    } else {
      setIsSigned(false);
    }
  }, [signingStatus]);

  useEffect(() => {
    setIsSigned(true);
    setSignedMsg("");
  }, [message]);

  console.log({ message, signedMsg, isSigned }, signedMsg.length);

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
              onClick={() => signMessage({ message: hash })}
              className="h-full w-36  self-center text-lg"
            >
              Sign
            </Button>{" "}
          </div>
        </div>
        <Button
          disabled={!(isSigned && signedMsg.length > 0)}
          className="h-full w-full max-w-lg mt-4 self-center text-lg"
        >
          Create Prediction
        </Button>
      </div>
    </main>
  );
}

function chunkHash(sha256Msg: string, chunkSize: number = 16): string[] {
  const cleanMsg = sha256Msg.replace(/^0x/, "");

  return cleanMsg.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
}
