"use client";
import { useState } from "react";
import { Button } from "@caps/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  async function submit() {
    const res = await fetch("/api/auth/login", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ email, password }) });
    setResult(await res.text());
  }
  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <input className="w-full border rounded p-2 mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border rounded p-2 mb-4" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <Button onClick={submit}>Login</Button>
      <pre className="mt-4 text-xs">{result}</pre>
    </div>
  );
}
