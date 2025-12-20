import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

import { toast } from "sonner";

function IfElseSettings({ selectedNode, updateFormData }: any) {
  const [formData, setFormData] = useState({ ifCondition: "" });

  useEffect(() => {
    selectedNode &&
      setFormData({ ifCondition: selectedNode?.data?.settings?.ifCondition });
  }, [selectedNode]);

  return (
    <div>
      <h2 className="font-bold">If / Else</h2>
      <p className="text-gray-500 mt-1">
        Create conditions to branch your workflow
      </p>
      <div className="mt-2 space-y-2">
        <Label> If </Label>

        <Input
          value={formData?.ifCondition}
          onChange={(e) => setFormData({ ifCondition: e.target.value })}
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
export default IfElseSettings;
