import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

import { toast } from "sonner";

function WhileSettings({ selectedNode, updateFormData }: any) {
  const [formData, setFormData] = useState({ whileCondition: "" });

  useEffect(() => {
    selectedNode &&
      setFormData({
        whileCondition: selectedNode?.data?.settings?.whileCondition,
      });
  }, [selectedNode]);

  return (
    <div>
      <h2 className="font-bold">While</h2>
      <p className="text-gray-500 mt-1">Loop your logic</p>
      <div className="mt-2 space-y-2">
        <Label> While </Label>

        <Input
          value={formData?.whileCondition}
          onChange={(e) => setFormData({ whileCondition: e.target.value })}
          className=""
          placeholder="Enter condition e.g output==`any condition`"
        />
      </div>

      <Button
        className="w-full mt-5"
        onClick={() => {
          updateFormData(formData);
          toast.success("Updated!");
        }}
      >
        Save
      </Button>
    </div>
  );
}
export default WhileSettings;
