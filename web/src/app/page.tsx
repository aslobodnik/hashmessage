import Image from "next/image";
import { keccak256 } from "viem";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  max-w-3xl w-full mx-auto px-1"></main>
  );
}
