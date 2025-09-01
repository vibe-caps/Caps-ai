import Link from "next/link";
import { Button } from "@caps/ui";

export default function MarketingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-5xl font-bold">Caps AI</h1>
      <p className="text-zinc-600">Prompt → Plan → Code → Preview → Deploy</p>
      <div className="flex gap-3">
        <Link href="/dashboard"><Button>Go to Dashboard</Button></Link>
        <Link href="/builder"><Button variant="outline">Open Builder</Button></Link>
      </div>
    </main>
  );
}
