async function main() {
  const res = await fetch("http://localhost:3000/api/agent-chat", {
    method: "POST",
    body: JSON.stringify({
      agentId: "",
      userId: "",
      userInput: "",
    }),
  });

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      const chunk = decoder.decode(value);
      // process chunk......
      console.log(chunk);
    }
  }
}

main();
