"use client";
import { useState } from "react";
import { Button } from "@caps/ui";

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string>("");

  async function submit() {
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    setResponse(await res.text());
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Builder</h2>
      <textarea
        className="w-full border rounded p-3 mb-4"
        rows={6}
        placeholder="Describe the app you want to build"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button onClick={submit}>Plan</Button>
      <pre className="mt-6 bg-zinc-100 dark:bg-zinc-900 p-4 rounded overflow-auto text-xs">
        {response}
      </pre>
    </div>
  );
}
