import { Button } from "@/components/ui/button";
import { Agent } from "@/types/AgentTypes";
import { ChevronLeft, Code2, Play, X } from "lucide-react";
import Link from "next/link";

type Props = { agentDetails: Agent | undefined; previewHeader?: boolean };

function Header({ agentDetails, previewHeader = false }: Props) {
  return (
    <div className="w-full p-3 flex items-center justify-between">
      <div className="flex items-center">
        <ChevronLeft className="h-8 w-8" />
        <h2 className="text-xl">{agentDetails?.name}</h2>
      </div>

      <div className="flex items-center gap-3">
        <Button variant={"ghost"}>
          <Code2 /> Code
        </Button>
        {!previewHeader ? (
          <Link href={`/agent-builder/${agentDetails?.agentId}/preview`}>
            <Button>
              <Play /> Preview
            </Button>
          </Link>
        ) : (
          <Link href={`/agent-builder/${agentDetails?.agentId}`}>
            <Button variant={"outline"}>
              <X /> Close preview
            </Button>
          </Link>
        )}
        <Button>Publish</Button>
      </div>
    </div>
  );
}
export default Header;
