import { Input } from "@/components/ui/input";
import { Handle, Position } from "@xyflow/react";
import { Repeat } from "lucide-react";

function WhileNode({ data }: any) {
  return (
    <div className="bg-white rounded-2xl p-2 px-3 border">
      <div className="flex gap-2 items-center">
        <Repeat
          className="p-2 rounded-lg h-8 w-8"
          style={{ backgroundColor: data?.bgColor }}
        />
        <h2>While</h2>
      </div>
      <div className="max-w-[140px] flex flex-col gap-2 mt-2">
        <Input
          placeholder="If Condition"
          className="text-sm bg-white"
          disabled
        />
      </div>
      <Handle position={Position.Left} type="target" />
      <Handle position={Position.Right} type="source" />
    </div>
  );
}
export default WhileNode;
