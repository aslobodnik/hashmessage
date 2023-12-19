"use client";
import Image from "next/image";
import { Address, keccak256, toHex } from "viem";
import { useAccount } from "wagmi";
import { signTypedData } from "@wagmi/core";
import { Button, Input, Textarea, RecordItem } from "@ensdomains/thorin";
import { useState, useEffect, ChangeEvent } from "react";
import NavBar from "./components/NavBar";
import { useSignMessage, useContractRead, useContractWrite } from "wagmi";
import counterABI from "../../../contracts/out/Counter.sol/Counter.json";
import { recoverMessageAddress, Hex } from "viem";

export default function Home() {
  const [secretMsg, setSecretMsg] = useState("");
  const [hashedMsg, setHashedMsg] = useState("");
  const [signature, setSignature] = useState<Hex | undefined>(undefined);

  const [message, setMessage] = useState<string>("");

  const handleSignatureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (input.startsWith("0x")) {
      setSignature(input as Hex);
    } else {
      alert("Misformed signature");
    }
  };

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: hashedMsg,
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

  const recoverButtonClick = async () => {
    console.log("Recover");

    try {
      const address = await recoverMessageAddress({
        message: message,
        signature: signature as Hex,
      });

      console.log(address);
      // Do something with the address
    } catch (error) {
      console.error("Error in recovering address:", error);
    }
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
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <Textarea
          label="Read only"
          placeholder="Signed message"
          readOnly
          value={data}
        />
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <Input
          label="Message"
          placeholder="hi"
          value={message}
          onChange={handleMessageChange}
        />
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <Input
          label="Signature"
          placeholder="0xA0Cf…251e"
          value={signature}
          onChange={handleSignatureChange}
        />
      </div>
      <div className="pb-4  mx-auto">
        <Button onClick={recoverButtonClick} width="45">
          Recover Address
        </Button>
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <RecordItem value="user#123">{""}</RecordItem>
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <Incrementor />
        <ViewCounter />
      </div>
    </main>
  );
}
const Incrementor = () => {
  const { write, data, isLoading, error } = useContractWrite({
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    abi: counterABI.abi,
    functionName: "increment",
  });

  const handleClick = () => {
    write();
  };

  if (isLoading) return <div>Transaction in progress...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Button onClick={handleClick} width="45">
        Increment
      </Button>
    </>
  );
};

const ViewCounter = () => {
  const { data, isError, isLoading } = useContractRead({
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    abi: counterABI.abi,
    functionName: "number",
  });
  const displayData = data ? data.toString() : "No data";

  return (
    <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
      <RecordItem value="user#123">{displayData}</RecordItem>
    </div>
  );
};
