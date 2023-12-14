"use client";
import Image from "next/image";
import { keccak256, toHex } from "viem";
import { useAccount } from "wagmi";
import { signTypedData } from "@wagmi/core";
import { Button, Input, Textarea } from "@ensdomains/thorin";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { format } from "date-fns";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  max-w-3xl w-full mx-auto px-1">
      <NavBar />
      <HashRevealTable />
    </main>
  );
}
function HashRevealTable() {
  const hashRevealRecords = [
    {
      id: 1,
      msgAuthor: "bob.eth",
      msgDate: format(new Date(), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 2,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 3,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 4,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 5,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 6,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 7,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 8,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 9,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 10,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
    {
      id: 11,
      msgAuthor: "example1",
      msgDate: format(new Date(2023, 11, 31), "MMM d, yyyy"),
      msgHash: "0x123...",
      msg: "0xABC...",
      msgRevealer: "frank.eth",
      msgRevealDate: "Dec 7, 2023",
    },
  ];
  return (
    <>
      <div className="w-4/5   my-0 mx-auto bg-white rounded-lg p-5 min-w-[360px] h-fit ">
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
            {hashRevealRecords?.map((record, index) => (
              <tr
                key={record.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : ""
                } border-b border-gray-200`}
              >
                <td className="pl-3 py-4">
                  {record.msgAuthor}
                  <div className="text-xs text-gray-500 mt-1">
                    {record.msgDate}
                  </div>
                </td>
                <td className="text-right">{record.msgHash}</td>
                <td className="text-right pr-4 py-2">{record.msg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const FormattedAddressLink = ({
  address,
  explorerUrl,
}: {
  address: string;
  explorerUrl: string;
}) => {
  if (!address || address.length < 10) {
    return <span>{address}</span>;
  }

  const formattedAddress = `${address.substring(0, 4)}...${address.substring(
    address.length - 4
  )}`;
  const fullUrl = `${explorerUrl}/${address}`;

  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-800 underline"
    >
      {formattedAddress.toLowerCase()}
    </a>
  );
};
