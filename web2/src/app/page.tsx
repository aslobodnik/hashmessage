"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NavBar } from "@/components/NavBar";
import { Checkbox } from "@/components/ui/checkbox";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [bountyCheck, setBountyCheck] = useState(false);

  const handleCheckboxChange = (value: boolean) => {
    setBountyCheck(value);
  };
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
              placeholder="ETH will hit $10,000 by 2030"
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
            onCheckedChange={handleCheckboxChange}
          />

          <Label className="mt-[2px]  text-gray-400">Bounty</Label>
        </div>
        <div className="mt-5 flex flex-col">
          <Label className="text-gray-400">Hash (SHA256)</Label>
          <div className="flex gap-2">
            <div className="w-fit p-2 rounded mt-1 font-mono text-gray-600 bg-green-100">
              a441b15fe9a3cf5661190a0b93b9decd<br></br>
              7d04127288cc87256661190a0b93b9de
            </div>
            <Button className="h-full w-36  self-center text-lg">
              Sign
            </Button>{" "}
          </div>
        </div>
        <Button className="h-full w-full max-w-lg mt-4 self-center text-lg">
          Create Prediction
        </Button>
      </div>
    </main>
  );
}
