"use client";
import { NavBar } from "@/components/NavBar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";

import { Address, sha256, toHex } from "viem";

import { Checkbox } from "@/components/ui/checkbox";
import { useState, FormEvent, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { usePonder } from "@/hooks/usePonder";
import { formatEther } from "viem";
import { useSimulateContract, useWriteContract } from "wagmi";
import { localhost } from "wagmi/chains";
import { testifiAbi } from "@/lib/abi";
import Link from "next/link";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

type Record = {
  id: number;
  author: Address;
  hash: string;
  bounty: bigint;
  message: string;
};

export default function View() {
  const [filterBounty, setFilterBounty] = useState(false);
  const [filterRevealed, setFilterRevealed] = useState(false);
  const ponder = usePonder();

  const filterBountyCheck = (value: boolean) => {
    setFilterBounty(value);
  };
  const filterRevealedCheck = (value: boolean) => {
    setFilterRevealed(value);
  };

  const records: Record[] =
    ponder?.records?.map((record) => ({
      author: record.msgAuthor,
      hash: record.msgHashSha256,
      bounty: BigInt(record.bounty), // Convert string to bigint
      message: record.message,
      id: record.id,
    })) ?? [];

  return (
    <main className="min-h-screen p-6 mx-auto max-w-5xl">
      <NavBar />
      <div className="  max-w-2xl mt-10 mx-auto">
        <h1 className="text-3xl  mb-10  text-gray-600 text-center font-bold">
          Statements
        </h1>
        <div className="flex">
          <div className="mt-2 ml-2 flex gap-2">
            <Checkbox
              className=""
              checked={filterBounty}
              onCheckedChange={filterBountyCheck}
            />
            <Label className="mt-[2px]  text-gray-400">Has Bounty</Label>
          </div>
          <div className="mt-2 ml-2 flex gap-2">
            <Checkbox
              className=""
              checked={filterRevealed}
              onCheckedChange={filterRevealedCheck}
            />
            <Label className="mt-[2px]  text-gray-400">Revealed</Label>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Author</TableHead>
              <TableHead className="text-center">Hash</TableHead>
              <TableHead className="text-center">Message</TableHead>
              <TableHead className="text-right">Bounty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index}>
                {/*Author*/}
                <TableCell className="font-medium">
                  {truncateAddress(record.author)}
                </TableCell>
                {/*Hash*/}
                <TableCell>
                  {chunkHash(record.hash).map((chunk, chunkIndex) => (
                    <div
                      className="font-mono my-1 mx-auto w-fit"
                      key={chunkIndex}
                    >
                      {chunk}
                    </div>
                  ))}
                </TableCell>
                {/*Message*/}
                <TableCell>
                  <RevealPrediction record={record} />
                </TableCell>
                {/*Bounty*/}
                <TableCell className="text-right">
                  {formatEther(record.bounty)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

function chunkHash(sha256Msg: string, chunkSize: number = 16): string[] {
  return sha256Msg.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
}

function RevealPrediction({ record }: { record: Record }) {
  const [message, setMessage] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [hash, setHash] = useState(record.hash);

  const { data, isError, isSuccess, failureReason } = useSimulateContract({
    abi: testifiAbi,
    address: CONTRACT_ADDRESS,
    functionName: "revealAndClaimBounty",
    args: [message, record.id],
    chainId: localhost.id,
  });

  const {
    data: txHash,
    writeContract,
    status: revealRecordStatus,
    reset: resetWriteContract,
    isSuccess: revealRecordSuccess,
  } = useWriteContract();

  useEffect(() => {
    const computedHash = sha256(toHex(message)).replace(/^0x/, "");
    if (message.length > 0) {
      setIsMatch(computedHash === record.hash);
      setHash(computedHash);
    } else {
      setIsMatch(false);
      setIsMatch(computedHash === record.hash);
    }
  }, [message, record.hash]);

  function handleRevealRecord() {
    writeContract({
      abi: testifiAbi,
      address: CONTRACT_ADDRESS,
      functionName: "revealAndClaimBounty",
      args: [message, record.id],
      chainId: localhost.id,
    });
  }

  return (
    <>
      {record.message === "" ? (
        <Dialog>
          <DialogTrigger asChild className="flex justify-center w-full">
            <Button variant="ghost" className="text-4xl px-8 py-6">
              🪄
            </Button>
          </DialogTrigger>
          <DialogContent className=" w-md">
            <DialogHeader>
              <DialogTitle>Reveal Message</DialogTitle>
              <DialogDescription>
                If the sha256 matches then the button will be enabled.
              </DialogDescription>
            </DialogHeader>

            <div className="grow max-w-lg">
              <Label className=" text-gray-400">Statement</Label>
              <Input
                className=" bg-green-50 mt-1  placeholder:text-gray-400"
                placeholder="ETH will hit $10,000 by 2030"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              ></Input>
            </div>

            <div className="flex gap-2">
              <div className=" w-[324px] h-16 p-2 rounded mt-1 font-mono text-gray-600 bg-green-100">
                {chunkHash(hash, 32).map((chunk, index) => (
                  <div key={index}>{chunk}</div>
                ))}
              </div>
              <div className="flex">
                {isMatch && (
                  <CheckCircledIcon className="text-green-500  self-center w-10 h-10" />
                )}
              </div>
            </div>

            <DialogFooter>
              <div className="flex flex-col  justify-start w-full">
                <div>
                  <Button
                    disabled={!isMatch}
                    onClick={handleRevealRecord}
                    type="submit"
                  >
                    Reveal
                  </Button>
                </div>
                <DisplaySuccessMessage
                  txSuccess={revealRecordSuccess}
                  txHash={txHash}
                />
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="text-center">{record.message} </div>
      )}
    </>
  );
}

function truncateAddress(address: Address, length: number = 4): string {
  return `${address.substring(0, length)}...${address.substring(
    address.length - length
  )}`;
}

function DisplaySuccessMessage({
  txHash,
  txSuccess,
}: {
  txHash?: string;
  txSuccess?: boolean;
}) {
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
      <div className="text-blue-500">{renderTxSuccessMessage()}</div>
    </div>
  );
}
