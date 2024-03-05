"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavBarLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavBar() {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="text-4xl text-gray-600 font-bold">Testifi</div>
        <Link
          href="/how"
          className=" hover:text-green-500 active:text-green-600"
        >
          <div className=" text-gray-400">How It Works</div>
        </Link>
      </div>
      <div className="flex items-center gap-4 font-bold text-gray-400">
        <NavBarLink href="/">Create</NavBarLink>
        <NavBarLink href="/view">View</NavBarLink>
      </div>
      <div className="flex items-center">
        <w3m-button balance="hide" />
      </div>
    </div>
  );
}

function NavBarLink({ href, children }: NavBarLinkProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`hover:text-green-500 active:text-green-600 ${
        isActive
          ? "underline text-green-500 decoration-green-400 decoration-2 underline-offset-4"
          : ""
      }`}
      passHref
    >
      {children}
    </Link>
  );
}
