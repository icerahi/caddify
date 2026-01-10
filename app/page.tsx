import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex justify-between p-5 items-center border-b">
        <div className="flex gap-2">
          <Image src={"/logo.svg"} alt="logo" height={35} width={35} />

          <h2 className="text-3xl font-bold">Caddify</h2>
        </div>
        <Button size={"lg"}>Get Started</Button>
      </div>

      <div className="flex flex-col justify-center items-center max-w-3xl mx-auto mt-20">
        <h1 className="text-7xl font-bold">
          Empower <span className="text-indigo-600">Ideas with</span> <br />
          Intelligent Agents. No Code, Just Pure AI.
        </h1>
        <p className="text-gray-600 p-5  w-2xl text-lg">
          Design agents that understand,think and take action for you. From
          chatbot to task automators - build smarter,faster,easier.
        </p>

        <div>
          <Button>Explore Now</Button>
          <Button variant={"outline"}>Contact Support</Button>
        </div>
      </div>
    </div>
  );
}
