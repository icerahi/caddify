"use client";
import { Button } from "@/components/ui/button";
import { WorkflowContext } from "@/context/WorkflowContext";
import { api } from "@/convex/_generated/api";
import { Agent } from "@/types/AgentTypes";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useConvex, useMutation } from "convex/react";
import { Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import AgentToolsPanel from "../_components/AgentToolsPanel";
import Header from "../_components/Header";
import AgentNode from "../_customNodes/AgentNode";
import ApiNode from "../_customNodes/ApiNode";
import EndNode from "../_customNodes/EndNode";
import IfElseNode from "../_customNodes/IfElseNode";
import StartNode from "../_customNodes/StartNode";
import UserApprovalNode from "../_customNodes/UserApprovalNode";
import WhileNode from "../_customNodes/WhileNode";

// const initialNodes = [
//   {
//     id: "n1",
//     position: { x: 0, y: 0 },
//     data: { label: "Node 1" },
//     type: "StartNode",
//   },
//   {
//     id: "n2",
//     position: { x: 0, y: 100 },
//     data: { label: "Node 2" },
//     type: "AgentNode",
//   },
// ];
// const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

const nodeTypes = {
  StartNode,
  AgentNode,
  EndNode,
  IfElseNode,
  WhileNode,
  UserApprovalNode,
  ApiNode,
};
function AgentBuilder() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { agentId } = useParams();

  const { addedNodes, setAddedNodes, nodeEdges, setNodeEdges } =
    useContext(WorkflowContext);
  const convex = useConvex();
  const UpdateAgentDetails = useMutation(api.agent.UpdateAgentDetails);
  const [agentDetails, setAgentDetails] = useState<Agent>();

  useEffect(() => {
    getAgentDetails();
  }, []);

  const getAgentDetails = async () => {
    const result = await convex.query(api.agent.GetAgentById, {
      agentId: agentId as string,
    });
    setAgentDetails(result);
  };

  useEffect(() => {
    if (agentDetails) {
      setNodes(agentDetails.nodes);
      setEdges(agentDetails.edges);
      setAddedNodes(agentDetails.nodes);
      setNodeEdges(agentDetails.edges);
    }
  }, [agentDetails]);

  useEffect(() => {
    addedNodes && setNodes(addedNodes);
    nodeEdges && setEdges(nodeEdges);
  }, [addedNodes]);

  useEffect(() => {
    edges && setNodeEdges(edges);
    edges && console.log(edges);
  }, [edges]);

  const saveNodesAndEdges = async () => {
    const result = await UpdateAgentDetails({
      //@ts-ignore
      id: agentDetails?._id,
      edges: nodeEdges,
      nodes: addedNodes,
    });
    toast.success("Saved!");
    console.log(result);
  };

  // useEffect(() => {
  //   (nodes || edges) && saveNodesAndEdges();
  // }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => {
        const updated = applyNodeChanges(changes, nodesSnapshot);
        setAddedNodes(updated);
        return updated;
      }),
    [setAddedNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      //@ts-ignore
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );
  return (
    <div>
      <Header agentDetails={agentDetails} />

      <div style={{ width: "100vw", height: "90vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          proOptions={{ hideAttribution: true }}
          nodeTypes={nodeTypes}
        >
          {/* @ts-ignore */}
          <Background variant={"dots"} gap={10} size={1} />
          <MiniMap />
          <Controls />

          <Panel position="top-left">
            <h1 className="text-gray-400 text-sm">Caddify</h1>
          </Panel>

          <Panel position="top-left">
            <AgentToolsPanel />
          </Panel>
          <Panel position="top-right">Setting</Panel>
          <Panel position="bottom-center">
            <Button onClick={saveNodesAndEdges}>
              {" "}
              <Save /> Save
            </Button>{" "}
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
export default AgentBuilder;
