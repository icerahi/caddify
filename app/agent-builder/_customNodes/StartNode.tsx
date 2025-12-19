import { Handle, Position } from "@xyflow/react";
import { Play } from "lucide-react";

function StartNode() {
  return (
    <div className="bg-white rounded-2xl p-2 px-4 border">
      <div className="flex gap-2 items-center">
        <Play className="p-2 rounded-lg h-8 w-8 bg-yellow-100" />
        <h2 className="">Start</h2>
        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
}
export default StartNode;
