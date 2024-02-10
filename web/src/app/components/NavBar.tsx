import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex justify-between px-2 py-8 w-full max-w-3xl  my-0 mx-auto  relative min-w-[360px]">
      <div className="flex gap-4">
        <span className=" text-opacity-90 custom-blue-gray">Testifi </span>
        <Link
          className={pathname === "/how" ? "text-blue-500" : ""}
          href="/how"
        >
          How It Works
        </Link>
      </div>
      <div className="flex gap-x-4 font-sans text-lg text-gray-700    font-bold">
        <Link className={pathname === "/" ? "text-blue-500" : ""} href="/">
          {" "}
          Create
        </Link>
        <Link
          className={pathname === "/how" ? "text-blue-500" : ""}
          href="/how"
        >
          How It Works
        </Link>
      </div>
      <div>
        <ConnectButton chainStatus="icon" showBalance={false} />
      </div>
    </nav>
  );
};

export default NavBar;
