import { Handle, Position } from "@xyflow/react";
import { MousePointer } from "lucide-react";

function AgentNode() {
  return (
    <div className="bg-white rounded-2xl p-2 px-4 border">
      <div className="flex gap-2 items-center">
        <MousePointer className="p-2 rounded-lg h-8 w-8 bg-green-100" />
        <div>
          <h2 className=""> Agent </h2>
          <p className="text-xs text-gray-500">Agent</p>
        </div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
}
export default AgentNode;
