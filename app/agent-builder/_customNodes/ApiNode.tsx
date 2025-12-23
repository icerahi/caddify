import { Handle, Position } from "@xyflow/react";
import { Webhook } from "lucide-react";

function ApiNode({ data }: any) {
  return (
    <div className="bg-white rounded-2xl p-2 px-4 border">
      <div className="flex gap-2 items-center">
        <Webhook
          className="p-2 rounded-lg h-8 w-8 bg-green-100"
          style={{ backgroundColor: data?.bgColor }}
        />
        <div>
          <h2 className=""> {data?.label} </h2>
          <p className="text-xs text-gray-500">API</p>
        </div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
}
export default ApiNode;
