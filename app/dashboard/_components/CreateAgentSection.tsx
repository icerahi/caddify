"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Loader2Icon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

function CreateAgentSection() {
  const [openDialog, setOpenDialog] = useState(false);

  const createAgentMutation = useMutation(api.agent.CreateNewAgent);
  const [agentName, setAgentName] = useState<string>();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { has } = useAuth();
  const isPaidUser = has && has({ plan: "unlimited_plan" });

  const createAgent = async () => {
    if (!isPaidUser && userDetail && userDetail?.remainingCredits <= 0) {
      toast.error(
        "You have reached the limit of free agents. Please upgrade your plan to create more agents."
      );
      return;
    }

    setLoader(true);
    const agentId = uuid();
    const result = await createAgentMutation({
      name: agentName ?? "",
      agentId,
      userId: userDetail?._id,
    });
    console.log(result);
    setOpenDialog(false);
    setLoader(false);
    //navigate to agent builder screen
    router.push(`/agent-builder/${agentId}`);
  };

  return (
    <div className="space-y-2 flex flex-col items-center mt-24 justify-center">
      <h2 className="font-bold text-2xl">Create AI Agent</h2>
      <p className="text-lg">
        Build a AI Agent workflow with custom logic and tools
      </p>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size={"lg"} onClick={() => setOpenDialog(true)}>
            <Plus /> Create
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Agent Name</DialogTitle>
            <DialogDescription>
              <Input
                placeholder="Agent Name"
                onChange={(e) => setAgentName(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button onClick={createAgent} disabled={loader}>
              {loader && <Loader2Icon className="animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CreateAgentSection;
