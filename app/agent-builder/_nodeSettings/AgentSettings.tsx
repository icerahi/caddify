import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileJson } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function AgentSettings({ selectedNode, updateFormData }: any) {
  const [formData, setFormData] = useState({
    name: "",
    instruction: "",
    includeHistory: true,
    model: "gemini-flash-1.5",
    output: "text",
    schema: "",
  });

  useEffect(() => {
    selectedNode && setFormData(selectedNode?.data?.settings);
  }, [selectedNode]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    console.log(formData);
    updateFormData(formData);
    toast.success("Setting updated!");
  };
  return (
    <div>
      <h2 className="font-bold">Agent</h2>
      <p className="text-gray-500 mt-1">
        Call the AI model with your instruction
      </p>

      <div className="mt-3 space-y-1">
        <Label>Name</Label>
        <Input
          value={formData.name}
          placeholder="Agent Name"
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="mt-3 space-y-1">
        <Label>Instruction</Label>
        <Textarea
          value={formData.instruction}
          placeholder="Instruction"
          onChange={(e) => handleChange("instruction", e.target.value)}
        />
        <h2 className="text-sm p-1 flex gap-2 items-center">
          Add Context <FileJson className="h-3 w-3" />
        </h2>
      </div>

      <div className="mt-3 space-y-1 flex justify-between items-center">
        <Label>Include Chat History</Label>
        <Switch
          checked={formData.includeHistory}
          onCheckedChange={(checked) => handleChange("includeHistory", checked)}
        />
      </div>

      <div className="mt-3 flex justify-between items-center">
        <Label>Model</Label>
        <Select
          value={formData.model}
          onValueChange={(value) => handleChange("model", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="gemini flash 1.5"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini-flash-1.5">Gemini Flash 1.5</SelectItem>
            <SelectItem value="gemini-pro-1.5">Gemini Pro 1.5</SelectItem>
            <SelectItem value="gemini-pro-2.0">Gemini Pro 2.0</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 space-y-2">
        <Label>Output format</Label>

        <Tabs
          value={formData.output}
          defaultValue="text"
          onValueChange={(value) => handleChange("output", value)}
        >
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="json">Json</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="text-sm text-gray-500">
            Output will be Text
          </TabsContent>
          <TabsContent value="json">
            <Label className="text-sm text-gray-500">Enter Json Schema</Label>
            <Textarea
              value={formData.schema}
              onChange={(e) => handleChange("schema", e.target.value)}
              placeholder="{title:string}"
              className="max-w-[300px] mt-1"
            />
          </TabsContent>
        </Tabs>
      </div>

      <Button onClick={onSave} className="w-full mt-5">
        Save
      </Button>
    </div>
  );
}
export default AgentSettings;
