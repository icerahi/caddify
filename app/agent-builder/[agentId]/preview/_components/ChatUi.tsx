import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Agent } from "@/types/AgentTypes";
import { Loader2Icon, RefreshCwIcon, Send } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
// import remarkGfm from 'remark-gfm'

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
  const [userInput, setUserInput] = useState<string>("");
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const onSendMsg = async () => {
    setLoadingMsg(true);
    setMessages([...messages, { role: "user", content: userInput }]);

    setUserInput("");
    const res = await fetch("/api/agent-chat", {
      method: "POST",
      body: JSON.stringify({
        input: userInput,
        conversationId,
        agentName: agentDetails?.name,
        agents: agentDetails?.config?.agents || [],
        tools: agentDetails?.config?.tools || [],
      }),
    });

    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        console.log(decoder.decode(value));
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: (updated[updated.length - 1]?.content || "") + chunk,
          };
          return updated;
        });
      }
    }
    setLoadingMsg(false);
  };
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
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn("p-2 flex rounded-lg max-w-[80%]", {
                "bg-blue-500 text-white self-end": msg.role == "user",
                "bg-gray-300 text-black self-start": msg.role == "assistant",
              })}
            >
              <div className="text-sm break-words whitespace-pre-wrap overflow-auto">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          ))}

          {/* loading state  */}
          {loadingMsg && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-800"></div>
              <span className="ml-2 text-zinc-800">
                Thinking.... Working on your request
              </span>
            </div>
          )}
        </div>

        {/* footer input  */}
        <div className="p-1 mt-3 border-t flex items-center gap-2 fixed bottom-10">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message here...."
            className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
          />
          <Button
            onClick={onSendMsg}
            disabled={loadingMsg || !userInput.trim().length}
          >
            {loadingMsg ? <Loader2Icon className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ChatUi;
