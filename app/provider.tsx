"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { WorkflowContext } from "@/context/WorkflowContext";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = useUser();
  const createUser = useMutation(api.user.createNewUser);

  const [userDetail, setUserDetail] = useState<any>();
  const [addedNodes, setAddedNodes] = useState([
    {
      id: "start",
      position: { x: 0, y: 0 },
      data: { label: "Start" },
      type: "StartNode",
    },
  ]);
  const [nodeEdges, setNodeEdges] = useState([]);

  useEffect(() => {
    user && createAndGetUser();
  }, [user]);

  const createAndGetUser = async () => {
    if (user) {
      const result = await createUser({
        name: user.fullName ?? "",
        email: user.primaryEmailAddress?.emailAddress ?? "",
      });

      setUserDetail(result);

      //save to context
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <WorkflowContext.Provider
        value={{ addedNodes, setAddedNodes, nodeEdges, setNodeEdges }}
      >
        <div>{children}</div>;
      </WorkflowContext.Provider>
    </UserDetailContext.Provider>
  );
};
export default Provider;
