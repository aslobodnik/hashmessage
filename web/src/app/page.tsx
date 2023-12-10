"use client";
import Image from "next/image";
import { keccak256, toHex } from "viem";
import { useAccount } from "wagmi";
import { signTypedData } from "@wagmi/core";
import { Button, Input, Textarea } from "@ensdomains/thorin";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { useSignMessage } from "wagmi";
import { recoverMessageAddress } from "viem";

export default function Home() {
  const [secretMsg, setSecretMsg] = useState("");
  const [hashedMsg, setHashedMsg] = useState("");

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: secretMsg,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log({ data });
    }
  }, [isSuccess, data]);

  const handleButtonClick = () => {
    console.log("Button clicked!");
    signMessage();
  };

  useEffect(() => {
    const hash = keccak256(toHex(secretMsg));
    setHashedMsg(hash);
  }, [secretMsg]);

  return (
    <main className="flex min-h-screen flex-col  max-w-3xl w-full mx-auto px-1">
      <NavBar />
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <Textarea
          label="Secret Message"
          placeholder="Bull market is starting..."
          value={secretMsg}
          onChange={(event) => setSecretMsg(event.target.value)}
        />
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <Textarea
          label="Read only"
          placeholder="Share your story…"
          defaultValue={
            hashedMsg ===
            "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
              ? ""
              : hashedMsg
          }
          readOnly
        />
      </div>
      <div className="pb-4  mx-auto">
        <Button onClick={handleButtonClick} width="45">
          Sign
        </Button>
      </div>
    </main>
  );
}
