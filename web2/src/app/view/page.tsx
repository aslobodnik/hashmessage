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

import { Address } from "viem";

import { Checkbox } from "@/components/ui/checkbox";
import { useState, FormEvent } from "react";
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

type Record = {
  author: Address;
  hash: string;
  bounty: bigint;
  message: string;
};

export default function View() {
  const [filterBounty, setFilterBounty] = useState(false);
  const [filterRevealed, setFilterRevealed] = useState(false);

  const filterBountyCheck = (value: boolean) => {
    setFilterBounty(value);
  };
  const filterRevealedCheck = (value: boolean) => {
    setFilterRevealed(value);
  };
  const records: Record[] = [
    {
      author: "0xf39F...2266", // Assuming Address is a string
      hash: "a441b15fe9a3cf5661190a0b93b9decda441b15fe9a3cf5661190a0b93b9decd",
      bounty: 250n, // Changed to bigint
      message: "",
    },
    {
      author: "0xf39F...2266", // Assuming Address is a string
      hash: "a441b15fe9a3cf5661190a0b93b9decda441b15fe9a3cf5661190a0b93b9decd",
      bounty: 150n, // Changed to bigint
      message: "",
    },
    {
      author: "0xf39F...2266", // Assuming Address is a string
      hash: "a441b15fe9a3cf5661190a0b93b9decda441b15fe9a3cf5661190a0b93b9decd",
      bounty: 150n, // Changed to bigint
      message: "",
    },
    {
      author: "0xf39F...2266", // Assuming Address is a string
      hash: "a441b15fe9a3cf5661190a0b93b9decda441b15fe9a3cf5661190a0b93b9decd",
      bounty: 150n, // Changed to bigint
      message: "hello",
    },
    {
      author: "0xf39F...2266", // Assuming Address is a string
      hash: "a441b15fe9a3cf5661190a0b93b9decda441b15fe9a3cf5661190a0b93b9decd",
      bounty: 150n, // Changed to bigint
      message: "",
    },
  ];

  const hashChunks = chunkHash(
    "a441b15fe9a3cf5661190a0b93b9decda441b15fe9a3cf5661190a0b93b9decd",
    16
  );
  return (
    <main className="min-h-screen p-6 mx-auto max-w-5xl">
      <NavBar />
      <div className="  max-w-2xl mt-10 mx-auto">
        <h1 className="text-3xl  mb-10  text-gray-600 text-center font-bold">
          Predictions
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
          <TableCaption>A list of your recent authors.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Author</TableHead>
              <TableHead className="text-center">Hash</TableHead>
              <TableHead className="text-center">Message</TableHead>
              <TableHead className="text-right">Bounty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.author}>
                {/*Author*/}
                <TableCell className="font-medium">{record.author}</TableCell>
                {/*Hash*/}
                <TableCell>
                  {" "}
                  {hashChunks.map((chunk: string, index: number) => (
                    <div className="font-mono my-1 mx-auto w-fit" key={index}>
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
                  {record.bounty.toLocaleString()}
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Your form submission logic here
    console.log("Form submitted");
    setIsModalOpen(false); // Close the modal after form submission
  };
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
                Type in the message to reveal the prediction. If the sha256
                matches then the button will be enabled.
              </DialogDescription>
            </DialogHeader>

            <div className="grow   max-w-lg">
              <Label className=" text-gray-400">Prediction</Label>
              <Input
                className=" bg-green-50 mt-1  placeholder:text-gray-400"
                placeholder="ETH will hit $10,000 by 2030"
              ></Input>
            </div>

            <div className="flex gap-2">
              <div className="w-fit p-2 rounded mt-1 font-mono text-gray-600 bg-green-100">
                a441b15fe9a3cf5661190a0b93b9decd<br></br>
                7d04127288cc87256661190a0b93b9de
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-start w-full">
                <Button type="submit">Reveal</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="text-center">{record.message}</div>
      )}
    </>
  );
}
