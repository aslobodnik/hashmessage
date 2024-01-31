import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex justify-center ">
      <NavBar />
      <div className="">
        <Button className="px-4 py-2 text-white rounded-lg shadow">
          Click me
        </Button>
      </div>
    </main>
  );
}
function NavBar() {
  return (
    <div className="flex">
      <div>
        <div>Testifi</div>
        <div>How It Works</div>
      </div>
      <div>
        <div>Create Prediction</div>
        <div>Reveal Prediction</div>
      </div>
      <div>Connect</div>
    </div>
  );
}
