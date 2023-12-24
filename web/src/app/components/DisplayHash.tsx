import exp from "constants";

function DisplayHash({ hash }: { hash: string }) {
  const truncatedHash = `${hash.substring(0, 6)}...${hash.substring(
    hash.length - 6
  )}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    // Optionally, you could add feedback to the user (like a tooltip) that the text has been copied.
  };

  const hashChunks = hash.match(/.{1,16}/g) || [];

  return (
    <div className="relative group">
      <div className="truncate cursor-pointer" onClick={copyToClipboard}>
        {truncatedHash}
        <button className="ml-2 underline text-blue-500 hover:text-blue-700">
          Copy
        </button>
      </div>
      <div className="absolute hidden group-hover:block bg-white shadow-lg p-2 rounded z-10 whitespace-pre-line transition-opacity duration-500 ">
        {hashChunks.map((chunk: string, index: number) => (
          <div className="font-mono my-1" key={index}>
            {chunk}
          </div>
        ))}
      </div>
    </div>
  );
}
export default DisplayHash;
