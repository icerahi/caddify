import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Agent } from "@/types/AgentTypes";
import { RefreshCwIcon, Send } from "lucide-react";

type Props = {
  GenerateAgentToolConfig: () => void;
  loading: boolean;
  agentDetails: Agent;
  conversationId: string | null;
};
function ChatUi({
  GenerateAgentToolConfig,
  loading,
  agentDetails,
  conversationId,
}: Props) {
  return (
    <div>
      <div className="flex justify-between items-center border-b p-4">
        <h2>{agentDetails?.name}</h2>

        <Button onClick={GenerateAgentToolConfig} disabled={loading}>
          <RefreshCwIcon /> Reboot Agent
        </Button>
      </div>

      <div className="w-full h-[90vh] p-4 flex flex-col">
        {/* Message section  */}

        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
          {/* hard coded message  */}
          <div className="flex justify-start">
            <div className="p-2 rounded-lg max-w-[80%] bg-gray-100 text-black">
              <h2 className="text-sm"> Welcome! this is a demo chat</h2>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="p-2 rounded-lg max-w-[80%] bg-gray-100 text-black">
              <h2 className="text-sm">
                {" "}
                Hello! Can you show me a design idea?
              </h2>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="p-2 rounded-lg max-w-[80%] bg-gray-100 text-black">
              <h2 className="text-sm">
                {" "}
                Sure! I suggest a modern dashboard with clear layouts
              </h2>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="p-2 rounded-lg max-w-[80%] bg-gray-100 text-black">
              <h2 className="text-sm">Great! Can you add dark mode?</h2>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="p-2 rounded-lg max-w-[80%] bg-gray-100 text-black">
              <h2 className="text-sm">
                Absolutely! dark mode will make the dashboard look sleek
              </h2>
            </div>
          </div>

          {/* loading state  */}
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-800"></div>
            <span className="ml-2 text-zinc-800">
              Thinking.... Working on your request
            </span>
          </div>
        </div>

        {/* footer input  */}
        <div className="p-1 mt-3 border-t flex items-center gap-2 fixed bottom-10">
          <Textarea
            placeholder="Type your message here...."
            className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
          />
          <Button>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ChatUi;
