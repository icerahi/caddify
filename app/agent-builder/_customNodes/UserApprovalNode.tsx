import { Button } from "@/components/ui/button";
import { Handle, Position } from "@xyflow/react";
import { ThumbsUp } from "lucide-react";

const handleStyle = { top: 110 };

function UserApprovalNode({ data }: any) {
  return (
    <div className="bg-white rounded-2xl p-2 px-3 border">
      <div className="flex gap-2 items-center">
        <ThumbsUp
          className="p-2 rounded-lg h-8 w-8"
          style={{ backgroundColor: data?.bgColor }}
        />
        <h2> User Approval </h2>
      </div>
      <div className="max-w-[140px] flex flex-col gap-2 mt-2">
        <Button variant={"outline"} disabled>
          Approve
        </Button>
        <Button variant={"outline"} disabled>
          Reject
        </Button>
      </div>
      <Handle position={Position.Left} type="target" />
      <Handle position={Position.Right} type="source" id="approve" />
      <Handle
        position={Position.Right}
        type="source"
        id="reject"
        style={handleStyle}
      />
    </div>
  );
}
export default UserApprovalNode;
