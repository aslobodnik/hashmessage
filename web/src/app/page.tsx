"use client";
import { keccak256, toHex, Hex, Address, parseEther, formatEther } from "viem";
import {
  Button,
  Input,
  CopySVG,
  CheckSVG,
  CheckCircleSVG,
  CrossSVG,
  Checkbox,
  UpCircleSVG,
} from "@ensdomains/thorin";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import {
  useSignMessage,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
} from "wagmi";
import hashTruthABI from "../../../contracts/out/HashTruth.sol/HashTruth.json";
import { sha256 } from "@noble/hashes/sha256";
import { usePonder } from "@/hooks/usePonder";

const CONTRACT_ADDRESS = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
const BUTTON_WIDTH = "40";

type RecordTableProps = {
  onRevealChange: (id: number) => void;
};

export default function Home() {
  const [secretMsg, setSecretMsg] = useState(""); // The message the user inputs
  const [sha256Msg, setSha256Msg] = useState("");
  const [isDupeMsg, setIsDupeMsg] = useState(false);
  const [bounty, setBounty] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [isBountyChecked, setIsBountyChecked] = useState(false);
  const [isProcessingNewMessage, setIsProcessingNewMessage] = useState(false);
  const [recordCreationSuccess, setRecordCreationSuccess] =
    useState<boolean>(false);

  const handleRecordCreationSuccess = (success: boolean) => {
    setRecordCreationSuccess(success);
  };

  const [revealRecordId, setRevealRecordId] = useState<number>();

  function handleRevealChange(id: number) {
    setRevealRecordId(id);
  }

  const { isDisconnected } = useAccount();

  useEffect(() => {
    if (recordCreationSuccess) {
      setTimeout(() => {
        setRecordCreationSuccess(false);
        setSecretMsg("");
        setBounty("");
        setIsSigned(false);
      }, 5000);
      ``;
    }
  }, [recordCreationSuccess]);

  const { data, isSuccess, signMessage, isLoading } = useSignMessage({
    message: sha256Msg,
  });

  useEffect(() => {
    const hashArray = sha256(secretMsg);
    const hashHex = Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    setSha256Msg(hashHex);

    setIsSigned(false); // Reset isSigned when secretMsg changes
    setIsProcessingNewMessage(true); // Indicate a new message is being processed
  }, [secretMsg]);

  useEffect(() => {
    if (isSuccess && !isProcessingNewMessage) {
      setIsSigned(true);
    }
  }, [isSuccess, isProcessingNewMessage]);

  const handleSigning = () => {
    setIsProcessingNewMessage(false); // Reset this flag when signing a message
    signMessage();
  };

  return (
    <main className="flex min-h-screen flex-col  max-w-3xl w-full mx-auto px-1">
      <NavBar />
      <h1 className="text-2xl font-bold text-center mb-4 opacity-80">
        TestiFi
      </h1>
      <div className="sm:px-16 px-4  flex-col ml-1">
        <div className="flex">
          <Input
            label="Predication"
            placeholder="ETH will hit $10,000 before 2030."
            value={secretMsg}
            onChange={(event) => setSecretMsg(event.target.value)}
          />
          {/* bounty */}
          {isBountyChecked && (
            <div className="ml-2">
              <Input
                label="Bounty"
                placeholder="0.01 ETH"
                value={bounty}
                onChange={(event) => {
                  const value = event.target.value;
                  const decimalRegex = /^[0-9]*\.?[0-9]*$/;
                  // const numValue = parseFloat(value);

                  // Ensure the value is a decimal
                  if (decimalRegex.test(value)) {
                    setBounty(value);
                  }
                }}
                inputMode="decimal"
              />
            </div>
          )}
        </div>
        <div className="ml-1 mt-3">
          <Checkbox
            label="Bounty"
            checked={isBountyChecked}
            onChange={(event) => setIsBountyChecked(event.target.checked)}
          />
        </div>
        <div className="pt-4  pl-2  text-custom-blue-gray font-bold">
          Sha256
        </div>
        <div className="flex">
          {/* hash */}
          <div className="flex-col">
            {/* Desktop View */}
            <div
              className={`w-fit rounded-lg px-4 py-2 mt-2 mb-3 ${
                recordCreationSuccess
                  ? "bg-green-100 border-green-500 border-2"
                  : "bg-white"
              }`}
            >
              {" "}
              {recordCreationSuccess && (
                <div className="text-green-600 text-center">🎉 Success! 🎉</div>
              )}
              <HashDisplay hash={sha256Msg} />
            </div>
          </div>
          {/* sign / create buttons */}
          <div className="flex flex-col justify-center ml-4">
            {!isSigned && (
              <Button
                onClick={handleSigning}
                disabled={isDisconnected || isDupeMsg}
                width={BUTTON_WIDTH}
              >
                {isDupeMsg
                  ? "Dupe"
                  : isDisconnected
                  ? "Connect Wallet"
                  : isLoading
                  ? "Signing..."
                  : "Sign"}
              </Button>
            )}
            {isSigned && (
              <div className="">
                <AddRecord
                  msgHashSha256={sha256Msg}
                  msgHashSignature={data}
                  onRecordCreationSuccess={handleRecordCreationSuccess}
                  bounty={bounty}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mb-4 h-12 relative">
          {revealRecordId !== undefined ? (
            <RevealAndClaim recordId={BigInt(revealRecordId)} />
          ) : (
            <>
              <div className="blur-sm">
                <RevealAndClaim recordId={BigInt(0)} />
              </div>
              <div
                className="absolute inset-0 cursor-pointer"
                style={{ backgroundColor: "transparent" }}
              ></div>
            </>
          )}
        </div>
      </div>
      <div>
        <RecordTable onRevealChange={handleRevealChange} />
      </div>
      <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
        <ViewRecordCount />
      </div>
    </main>
  );
}
function AddRecord({
  msgHashSha256,
  msgHashSignature,
  onRecordCreationSuccess,
  bounty = "0",
}: {
  msgHashSha256: string;
  msgHashSignature: Hex | undefined;
  onRecordCreationSuccess: (success: boolean) => void;
  bounty?: string;
}) {
  const { config, status } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: hashTruthABI.abi,
    functionName: "addRecord",
    args: [msgHashSha256, msgHashSignature],
    value: parseEther(bounty),
  });

  const { write, data, isLoading, error, isSuccess } = useContractWrite(config);

  const handleClick = () => {
    if (write) {
      write();
    }
  };

  useEffect(() => {
    onRecordCreationSuccess(isSuccess);
  }, [isSuccess, onRecordCreationSuccess]);

  if (isLoading) return <Button width={BUTTON_WIDTH}>Creating...</Button>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={msgHashSignature === undefined || status === "error"}
        width={BUTTON_WIDTH}
      >
        {status === "error" ? "Dupe Message" : "Create"}
      </Button>
    </>
  );
}

function HashDisplay({ hash }: { hash: string }) {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block">
        {chunkHash(hash, 32).map((chunk, index) => (
          <div className="font-mono my-1 mx-auto w-fit" key={index}>
            {chunk}
          </div>
        ))}
      </div>
      {/* Mobile View */}
      <div className="block sm:hidden">
        {chunkHash(hash, 16).map((chunk, index) => (
          <div className="font-mono my-1 mx-auto w-fit" key={index}>
            {chunk}
          </div>
        ))}
      </div>
    </>
  );
}
const ViewRecordCount = () => {
  const { data, isError, isLoading } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: hashTruthABI.abi,
    functionName: "getRecordsCount",
  });

  const displayData = data ? data.toString() : "No data";

  return (
    <div className="max-w-sm pb-4 w-full sm:w-1/2 mx-auto">
      Total Records: {displayData}
    </div>
  );
};

function RevealAndClaim({ recordId }: { recordId: bigint }) {
  const [message, setMessage] = useState("");
  const [userSha256Msg, setUserSha256Msg] = useState("");
  const [isMatch, setIsMatch] = useState<boolean>(Number(recordId) !== 0);

  useEffect(() => {
    const hashArray = sha256(message);
    const hashHex = Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setUserSha256Msg(hashHex);
  }, [message]);

  // Prepare the contract write operation
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    enabled: isMatch,
    abi: hashTruthABI.abi,
    functionName: "revealAndClaimBounty",
    args: [message, recordId],
  });

  const {
    data: recordData,
    isError,
    isLoading,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: [
      {
        type: "function",
        name: "records",
        inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        outputs: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "message", type: "string", internalType: "string" },
          { name: "msgHashSha256", type: "string", internalType: "string" },
          { name: "msgAuthor", type: "address", internalType: "address" },
          { name: "msgRevealor", type: "address", internalType: "address" },
          {
            name: "msgHashSignature",
            type: "bytes",
            internalType: "bytes",
          },
          { name: "bounty", type: "uint256", internalType: "uint256" },
        ],
        stateMutability: "view",
      },
    ] as const,
    functionName: "records",
    args: [recordId], // passing id as an argument to the getRecord function
  });

  // Execute the contract write operation
  const {
    write,
    data: revealData,
    isError: revealIsError,
    isLoading: revealIsLoading,
  } = useContractWrite(config);

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (write) {
      write(); // Execute the transaction only if write is defined
    } else {
      console.error("Write function is not available.");
    }
  };
  useEffect(() => {
    if (!isLoading && !isError && recordData) {
      const recordSha256Msg = recordData[2]; // msgHashSha256

      setIsMatch(recordSha256Msg === userSha256Msg);
    }
  }, [recordData, userSha256Msg]);

  return (
    <div className="flex gap-4">
      <div className="w-[342.25px] relative">
        <Input
          label="Reveal"
          value={message}
          placeholder="Predication"
          onChange={(event) => setMessage(event.target.value)}
          hideLabel={true}
          className="mr-2"
          autoFocus //TODO: autofocus should not appear when record id is 0
        />
        {message !== "" &&
          (isMatch ? (
            <div className="absolute right-2 top-4 text-green-500">
              <CheckCircleSVG />
            </div>
          ) : (
            <div className="absolute right-2 top-4 text-red-400">
              <CrossSVG />
            </div>
          ))}
      </div>
      <Button width={BUTTON_WIDTH} disabled={!isMatch} onClick={handleSubmit}>
        Reveal Message
      </Button>
    </div>
  );
}

function RecordTable({ onRevealChange }: RecordTableProps) {
  const [revealRecordId, setRevealRecordId] = useState<number | undefined>(
    undefined
  );

  const ponder = usePonder();

  const handleRevealChange = (id: number) => {
    onRevealChange(id);
    setRevealRecordId(id);
  };

  // Handle loading state
  if (ponder.isLoading) {
    return <div>Loading...</div>;
  }

  const records = ponder.records || [];

  return (
    <>
      <div className="sm:w-4/5 mx-2 my-0 sm:mx-auto bg-white rounded-lg p-5 sm:min-w-[620px] h-fit">
        <div className="text-lg mb-4 font-semibold flex justify-between items-center w-full relative">
          <div className="flex-grow text-center">Messages</div>
        </div>
        {/* TODO: FIX Mobile View */}
        <div className="sm:hidden">
          <table className="w-full border-collapse">
            <tbody>
              {records.map((record, index) => (
                <tr key={index} className="bg-gray-100 rounded-lg mb-4">
                  <td className="p-4">
                    <div className="font-semibold">Author:</div>
                    <div className="mb-2 pt-2">
                      <ShortAddressDisplay address={record.msgAuthor} />
                    </div>
                    <div className="font-semibold">Hash:</div>
                    <div className="mb-2 pt-2">
                      {chunkHash(record.msgHashSha256, 32).map(
                        (chunk, index) => (
                          <div className="font-mono" key={index}>
                            {chunk}
                          </div>
                        )
                      )}
                    </div>
                    <div className="font-semibold">Message:</div>
                    <div>{record.message === "" ? "" : record.message}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Desktop View */}
        <table className="w-full min-w-[360px] border-collapse hidden sm:table">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-center w-16 pl-3 opacity-60">Author</th>
              <th className="text-center w-16 pl-3 opacity-60">Revealer</th>
              <th className="text-right w-16 pl-2 pr-4 opacity-60">Hash</th>
              <th className="text-right pl-2  opacity-60">Message</th>
              <th className="text-left w-16 pl-3 py-2 opacity-60">
                Bounty
                <br />
                <span className="text-center block">(eth)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={index}
                className={` ${
                  revealRecordId === record.id
                    ? " ring-2 rounded-lg"
                    : "border-b  border-gray-200"
                }`}
              >
                <td className="p-4 relative">
                  <span className="absolute inset-x-0 bottom-1   text-ss text-gray-400 flex justify-center">
                    {(record.block * 10000).toLocaleString()}
                  </span>
                  <DisplayAddress address={record.msgAuthor} />{" "}
                </td>
                <td className="p-4">
                  {record.msgRevealor === "0x" ? (
                    <div className=" text-center">—</div>
                  ) : (
                    <DisplayAddress address={record.msgRevealor} />
                  )}
                </td>
                <td className="flex justify-end p-4">
                  <DisplayHash hash={record.msgHashSha256} />
                </td>
                <td className="text-right">
                  {record.message === "" ? (
                    <div
                      onClick={() => handleRevealChange(record.id)}
                      className="flex justify-center  text-yellow-400 cursor-pointer"
                    >
                      <UpCircleSVG />
                    </div>
                  ) : (
                    record.message
                  )}
                </td>
                <td className="text-center">
                  {BigInt(record.bounty) > BigInt(0) ? (
                    <div className=" text-center">
                      {formatEther(BigInt(record.bounty))}
                    </div>
                  ) : (
                    <div>—</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function truncateAddress(address: Address, length: number = 4): string {
  return `${address.substring(0, length)}...${address.substring(
    address.length - length
  )}`;
}

function truncateHash(sha256Msg: string, length: number = 6): string {
  return `${sha256Msg.substring(0, length)}...${sha256Msg.substring(
    sha256Msg.length - length
  )}`;
}

function hashExists(hash: string): boolean {
  const ponder = usePonder(hash);

  return false;
}

// splits sha256 hash into chunks of 16 characters
function chunkHash(sha256Msg: string, chunkSize: number = 16): string[] {
  return sha256Msg.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
}

function DisplayHash({ hash }: { hash: string }) {
  const truncatedHash = truncateHash(hash, 4);
  const hashChunks = chunkHash(hash, 16);
  const [showCheck, setShowCheck] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
    }, 1000); // 1000 milliseconds = 1 second
  };

  return (
    <div className="relative group  w-[16ch]">
      <div className="flex justify-end cursor-pointer group">
        <span className="relative inline-block">
          {truncatedHash}
          {showCheck ? (
            <CheckSVG className="opacity-50 text-green-600 absolute -right-5 top-0" />
          ) : (
            <CopySVG
              className="opacity-0 duration-500 absolute -right-5 top-0 group-hover:opacity-50"
              onClick={copyToClipboard}
            />
          )}
        </span>
      </div>
      <div className="absolute  group-hover:block bg-white shadow-lg pt-2 rounded z-10 w-[18ch] transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
        {hashChunks.map((chunk: string, index: number) => (
          <div className="font-mono my-1 mx-auto w-fit" key={index}>
            {chunk}
          </div>
        ))}
      </div>
    </div>
  );
}

function DisplayAddress({ address }: { address: Address }) {
  const [showCheck, setShowCheck] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
    }, 1000); // 1000 milliseconds = 1 second
  };

  const truncatedAddress = truncateAddress(address, 4);

  return (
    <div className="relative group w-fit">
      <span className="cursor-pointer flex gap-2 justify-end group">
        <span className="relative inline-block">
          {truncatedAddress}
          {showCheck ? (
            <CheckSVG className="opacity-50 text-green-600 absolute -right-5 top-0" />
          ) : (
            <CopySVG
              className="opacity-0 duration-500 absolute -right-5 top-0 group-hover:opacity-50"
              onClick={copyToClipboard}
            />
          )}
        </span>
      </span>
      <div className="absolute -ml-4 px-4 whitespace-nowrap py-2 bg-white shadow-lg rounded z-10 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
        {address}
      </div>
    </div>
  );
}

function ShortAddressDisplay({ address }: { address: Address }) {
  const [isFullAddressVisible, setIsFullAddressVisible] = useState(false);

  function handleAddressClick() {
    setIsFullAddressVisible(!isFullAddressVisible);
  }

  const displayAddress = isFullAddressVisible
    ? address
    : `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;

  return (
    <div className="mb-2 cursor-pointer" onClick={handleAddressClick}>
      {displayAddress}
    </div>
  );
}
