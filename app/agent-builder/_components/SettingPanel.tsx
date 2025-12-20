import { WorkflowContext } from "@/context/WorkflowContext";
import { useContext } from "react";
import AgentSettings from "../_nodeSettings/AgentSettings";
import EndSettings from "../_nodeSettings/EndSettings";
import IfElseSettings from "../_nodeSettings/IfElseSettings";
import UserApprovalSettings from "../_nodeSettings/UserApprovalSettings";
import WhileSettings from "../_nodeSettings/WhileSettings";

function SettingPanel() {
  const { selectedNode, setAddedNodes } = useContext(WorkflowContext);

  const onUpdateNodeData = (formData: any) => {
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label: formData.name,
        settings: formData,
      },
    };
    setAddedNodes((prev: any) =>
      prev.map((node: any) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    );
  };
  return (
    selectedNode && (
      <div className="p-5 bg-white rounded-2xl w-[350px] shadow">
        {selectedNode?.type === "AgentNode" && (
          <AgentSettings
            selectedNode={selectedNode}
            updateFormData={(value: any) => onUpdateNodeData(value)}
          />
        )}

        {selectedNode?.type === "EndNode" && (
          <EndSettings
            selectedNode={selectedNode}
            updateFormData={(value: any) => onUpdateNodeData(value)}
          />
        )}
        {selectedNode?.type === "IfElseNode" && (
          <IfElseSettings
            selectedNode={selectedNode}
            updateFormData={(value: any) => onUpdateNodeData(value)}
          />
        )}
        {selectedNode?.type === "WhileNode" && (
          <WhileSettings
            selectedNode={selectedNode}
            updateFormData={(value: any) => onUpdateNodeData(value)}
          />
        )}
        {selectedNode?.type === "UserApprovalNode" && (
          <UserApprovalSettings
            selectedNode={selectedNode}
            updateFormData={(value: any) => onUpdateNodeData(value)}
          />
        )}
      </div>
    )
  );
}
export default SettingPanel;
