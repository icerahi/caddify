"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Agent } from "@/types/AgentTypes";
import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { RefreshCwIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../_components/Header";
import { nodeTypes } from "../page";
import ChatUi from "./_components/ChatUi";

function PreviewAgent() {
  // 🧠 Store the agent detail fetched from Convex (nodes + edges)
  const [agentDetails, setAgentDetails] = useState<Agent>();

  // ⚙️ Convex client instance
  const convex = useConvex();

  // 🔑 Get agentId from URL params (e.g., /agent/[agentId])
  const { agentId } = useParams();

  // ⚙️ Store generated workflow config
  const [config, setConfig] = useState<any>();

  const [loading, setLoading] = useState(false);

  const updateAgentToolConfig = useMutation(api.agent.UpdateAgentToolConfig);

  // 📦 Fetch agent details when component mounts
  useEffect(() => {
    getAgentDetails();
  }, []);

  // 📡 Convex query to fetch agent detail by ID
  const getAgentDetails = async () => {
    const result = await convex.query(api.agent.GetAgentById, {
      agentId: agentId as string,
    });
    setAgentDetails(result);
  };

  // 🧩 Generate workflow once agent data is loaded
  useEffect(() => {
    if (agentDetails) {
      GenerateWorkflow();
    }
  }, [agentDetails]);

  // ⚙️ Generate workflow config (node/edge relationship)
  const GenerateWorkflow = () => {
    // 🧩 Build Edge Map for quick source → target lookup
    const edgeMap = agentDetails?.edges?.reduce((acc: any, edge: any) => {
      if (!acc[edge.source]) acc[edge.source] = [];
      acc[edge.source].push(edge);
      return acc;
    }, {});

    // 🔄 Build flow array by mapping each node
    const flow = agentDetails?.nodes?.map((node: any) => {
      const connectedEdges = edgeMap[node.id] || [];
      let next: any = null;

      switch (node.type) {
        // 🧭 Conditional branching node with "if" and "else"
        case "IfElseNode": {
          const ifEdge = connectedEdges.find(
            (e: any) => e.sourceHandle === "if"
          );
          const elseEdge = connectedEdges.find(
            (e: any) => e.sourceHandle === "else"
          );

          next = {
            if: ifEdge?.target || null,
            else: elseEdge?.target || null,
          };
          break;
        }

        // 🧠 Agent or AI Node
        case "AgentNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          } else if (connectedEdges.length > 1) {
            next = connectedEdges.map((e: any) => e.target);
          }
          break;
        }

        // 🔗 API Call Node
        case "ApiNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        // ✅ User Approval Node (manual checkpoint)
        case "UserApprovalNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        // 🚀 Start Node
        case "StartNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        // 🏁 End Node
        case "EndNode": {
          next = null; // No next node
          break;
        }

        // 🔧 Default handling for any unknown node type
        default: {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          } else if (connectedEdges.length > 1) {
            next = connectedEdges.map((e: any) => e.target);
          }
          break;
        }
      }

      // 🧱 Return a simplified node configuration
      return {
        id: node.id,
        type: node.type,
        label: node.data?.label || node.type,
        settings: node.data?.settings || {},
        next,
      };
    });

    // 🎯 Find the Start Node
    const startNode = agentDetails?.nodes?.find(
      (n: any) => n.type === "StartNode"
    );

    // 🧱 Final Config structure
    const config = {
      startNode: startNode?.id || null,
      flow,
    };

    console.log("✅ Generated Workflow Config:", JSON.stringify(config));
    setConfig(config);
  };

  const GenerateAgentToolConfig = async () => {
    setLoading(true);
    const result = await axios.post("/api/generate-agent-tool-config", {
      jsonConfig: config,
    });
    console.log(result.data);

    //update to our db
    updateAgentToolConfig({
      id: agentDetails?._id as any,
      agentToolConfig: result.data,
    });
    getAgentDetails();
    setLoading(false);
  };

  return (
    <div>
      <Header agentDetails={agentDetails} previewHeader={true} />
      <div className="grid grid-cols-4">
        <div className="col-span-3 p-5 border rounded-2xl m-5">
          <h2>Preview</h2>
          <div style={{ width: "100%", height: "90vh" }}>
            <ReactFlow
              nodes={agentDetails?.nodes || []}
              edges={agentDetails?.edges || []}
              fitView
              proOptions={{ hideAttribution: true }}
              nodeTypes={nodeTypes}
              draggable={false}
            >
              {/* @ts-ignore */}
              {/* <Background variant={"dots"} gap={10} size={1} /> */}
            </ReactFlow>
          </div>
        </div>

        <div className="col-span-1 border rounded-2xl m-3 p-2">
          <div className="flex justify-center items-center h-full">
            {!agentDetails?.agentToolConfig ? (
              <Button onClick={GenerateAgentToolConfig} disabled={loading}>
                <RefreshCwIcon
                  className={cn("", { "animate-spin": loading })}
                />{" "}
                Reboot Agent
              </Button>
            ) : (
              <ChatUi
                GenerateAgentToolConfig={GenerateAgentToolConfig}
                loading={loading} agentDetails={agentDetails}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default PreviewAgent;
