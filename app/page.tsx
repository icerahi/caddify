import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h1 className="text-5xl font-bold">caddify</h1>
      <Button>Caddify</Button>
      <UserButton />
    </div>
  );
}
