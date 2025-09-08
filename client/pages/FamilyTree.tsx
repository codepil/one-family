import FamilyTree, { Member } from "@/components/FamilyTree";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }

function updateNode(root: Member, id: string, mutator: (node: Member) => void): Member {
  if (root.id === id) {
    const next = { ...root, children: root.children ? [...root.children] : undefined } as Member;
    mutator(next);
    return next;
  }
  if (!root.children) return root;
  let changed = false;
  const nextChildren = root.children.map((c) => {
    const updated = updateNode(c, id, mutator);
    if (updated !== c) changed = true;
    return updated;
  });
  if (!changed) return root;
  return { ...root, children: nextChildren };
}

function insertSibling(root: Member, id: string, create: () => Member): Member {
  if (!root.children) return root;
  const idx = root.children.findIndex((c) => c.id === id);
  if (idx !== -1) {
    const next = [...root.children];
    next.splice(idx + 1, 0, create());
    return { ...root, children: next };
  }
  let changed = false;
  const nextChildren = root.children.map((c) => {
    const updated = insertSibling(c, id, create);
    if (updated !== c) changed = true;
    return updated;
  });
  if (!changed) return root;
  return { ...root, children: nextChildren };
}

function insertChild(root: Member, id: string, create: () => Member): Member {
  return updateNode(root, id, (n) => {
    const children = n.children ? [...n.children] : [];
    children.push(create());
    n.children = children;
  });
}

function findParentId(root: Member, id: string, parentId: string | null = null): string | null {
  if (root.id === id) return parentId;
  for (const c of root.children ?? []) {
    const res = findParentId(c, id, root.id);
    if (res) return res;
  }
  return null;
}

export default function FamilyTreePage() {
  const initial: Member = useMemo(() => ({
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
      { id: "b1", name: "Taylor", born: "1990", children: [{ id: "b1a", name: "Riley", born: "2020" }] },
      { id: "c1", name: "Casey", born: "1993" },
    ],
  }), []);

  const [tree, setTree] = useState<Member>(initial);
  const [selectedId, setSelectedId] = useState<string>(initial.id);
  const selected = useMemo(() => {
    let found: Member | null = null;
    const walk = (n: Member) => {
      if (n.id === selectedId) { found = n; return; }
      for (const c of n.children ?? []) if (!found) walk(c);
    };
    walk(tree);
    return found ?? tree;
  }, [selectedId, tree]);

  const [name, setName] = useState(selected.name);
  const [born, setBorn] = useState(selected.born ?? "");
  useEffect(() => {
    setName(selected.name);
    setBorn(selected.born ?? "");
  }, [selectedId]);

  const canAddSibling = findParentId(tree, selectedId) !== null;

  const saveDetails = () => {
    setTree((prev) => updateNode(prev, selectedId, (n) => { n.name = name; n.born = born || undefined; }));
  };

  const addChild = () => {
    const id = Math.random().toString(36).slice(2, 8);
    setTree((prev) => insertChild(prev, selectedId, () => ({ id, name: "New Member", born: undefined })));
    setSelectedId(id);
  };

  const addSibling = () => {
    const parentId = findParentId(tree, selectedId);
    if (!parentId) return;
    const id = Math.random().toString(36).slice(2, 8);
    setTree((prev) => insertSibling(prev, selectedId, () => ({ id, name: "New Sibling", born: undefined })));
    setSelectedId(id);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Family Tree</h1>
          <p className="mt-2 text-muted-foreground">Click a person to edit details. Use the actions to add children or siblings.</p>
          <div className="mt-6 rounded-xl border bg-card p-4">
            <FamilyTree data={tree} selectedId={selectedId} onSelect={(n) => setSelectedId(n.id)} />
          </div>
        </div>

        <aside className="md:sticky md:top-20 h-max rounded-xl border bg-card p-5 shadow-sm">
          <div className="text-sm text-muted-foreground">Selected member</div>
          <div className="mt-1 text-lg font-semibold">{selected.name}</div>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">Name</span>
              <input className="h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={name} onChange={(e)=>setName(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">Born (YYYY or range)</span>
              <input className="h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={born} onChange={(e)=>setBorn(e.target.value)} />
            </label>
            <div className="flex gap-2 pt-2">
              <Button onClick={saveDetails}>Save</Button>
              <Button variant="outline" onClick={addChild}>Add Child</Button>
              <Button variant="outline" disabled={!canAddSibling} onClick={addSibling}>Add Sibling</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
