import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function UserApprovalSettings({ selectedNode, updateFormData }: any) {
  const [formData, setFormData] = useState({ name: "", message: "" });

  useEffect(() => {
    selectedNode && setFormData(selectedNode?.data?.settings);
  }, [selectedNode]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    setFormData((prev: any) => ({ ...prev }));
    updateFormData(formData);
    toast.success("Settings Updated!");
  };
  return (
    <div>
      <h2 className="font-bold">User Approval</h2>
      <p className="text-gray-500 mt-1">
        Pause for a human to approve or reject a step
      </p>
      <div className="mt-2 space-y-2">
        <Label>Name </Label>

        <Input
          value={formData?.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className=""
          placeholder="Name"
        />
      </div>
      <div className="mt-2 space-y-2">
        <Label>Message </Label>

        <Textarea
          value={formData?.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className=""
          placeholder="Describe the message to show to the user"
        />
      </div>

      <Button className="w-full mt-5" onClick={onSave}>
        Save
      </Button>
    </div>
  );
}
export default UserApprovalSettings;
