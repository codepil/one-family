import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

function summarize(text: string) {
  const clean = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  const sentences = clean.split(/(?<=[.!?])\s+/).slice(0, 4);
  const words = clean.toLowerCase().match(/[a-zA-Z']+/g) || [];
  const stop = new Set(["the","a","an","and","or","but","to","of","in","on","for","with","at","by","from","is","it","that","we","our"]);
  const freq = new Map<string, number>();
  for (const w of words) if (!stop.has(w) && w.length > 2) freq.set(w, (freq.get(w) || 0) + 1);
  const top = [...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([w])=>w);
  const summary = sentences.join(" ");
  return { summary, keywords: top };
}

export default function AISummary() {
  const [text, setText] = useState(
    "Grandma's 80th birthday was filled with stories, photos, and a surprise video call. We shared homemade recipes and planned a reunion picnic next month."
  );
  const { summary, keywords } = useMemo(() => summarize(text), [text]);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">AI Summary (demo)</h3>
        <Button size="sm" onClick={() => setText(text + " ")}>Refresh</Button>
      </div>
      <textarea
        className="mt-3 w-full resize-none rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4 text-sm">
        <div className="text-muted-foreground">Summary</div>
        <p className="mt-1">{summary}</p>
      </div>
      <div className="mt-3 text-sm">
        <div className="text-muted-foreground">Keywords</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {keywords.map((k) => (
            <span key={k} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{k}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
