import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type Member = {
  id: string;
  name: string;
  born?: string;
  avatar?: string;
  children?: Member[];
};

function TreeNode({ node, depth = 0 }: { node: Member; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <div className="relative">
      <div
        className={cn(
          "group inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 shadow-sm transition hover:shadow-md",
          depth === 0 && "ring-1 ring-primary/10",
        )}
        onClick={() => hasChildren && setExpanded((v) => !v)}
        role="button"
      >
        <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-rose-400 text-white grid place-items-center text-xs font-bold">
          {node.name
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <div className="text-sm font-semibold leading-none">{node.name}</div>
          {node.born ? (
            <div className="text-[11px] text-muted-foreground leading-none mt-1">b. {node.born}</div>
          ) : null}
        </div>
        {hasChildren ? (
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
            {expanded ? "Hide" : "Show"} {node.children!.length}
          </span>
        ) : null}
      </div>
      {hasChildren && expanded ? (
        <div className="relative ml-8 pl-6 mt-4 border-l-2 border-muted/60">
          <div className="absolute -left-[6px] top-3 size-3 rounded-full bg-muted" />
          <div className="grid gap-4">
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />)
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function FamilyTree({ data }: { data?: Member }) {
  const sample = useMemo<Member>(() => data ?? ({
    id: "root",
    name: "Pat & Jordan",
    born: "1962/1964",
    children: [
      {
        id: "a1",
        name: "Alex",
        born: "1987",
        children: [
          { id: "a1a", name: "Maya", born: "2015" },
          { id: "a1b", name: "Evan", born: "2018" },
        ],
      },
      {
        id: "b1",
        name: "Taylor",
        born: "1990",
        children: [
          { id: "b1a", name: "Riley", born: "2020" },
        ],
      },
      {
        id: "c1",
        name: "Casey",
        born: "1993",
      },
    ],
  } as Member), [data]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[560px]">
        <TreeNode node={sample} />
      </div>
    </div>
  );
}
