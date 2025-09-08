import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

type Post = {
  id: string;
  title: string;
  author: string;
  date: string; // ISO
  status: "published" | "draft";
  tags: string[];
  content: string;
};

type Mode = "none" | "edit" | "create";

const SAMPLE_POSTS: Post[] = [
  {
    id: "p1",
    title: "Grandma's 80th: Stories We Cherish",
    author: "Alex",
    date: new Date().toISOString(),
    status: "published",
    tags: ["memories", "birthday"],
    content:
      "We gathered to celebrate Grandma's 80th with dinner, a slideshow, and heartfelt toasts. Here are our favorite photos and the recipes we shared...",
  },
  {
    id: "p2",
    title: "June Picnic Planning",
    author: "Taylor",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "draft",
    tags: ["events"],
    content: "Drafting the checklist for games, food assignments, and carpool details for the picnic at Maple Park.",
  },
  {
    id: "p3",
    title: "Recipe: Uncle Pat's Chili",
    author: "Pat",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 36).toISOString(),
    status: "published",
    tags: ["recipe"],
    content: "A family classic with a mild kick. Ingredients, steps, and secret tips inside.",
  },
];

export default function Blogs() {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [tab, setTab] = useState<"all" | "published" | "draft">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_POSTS[0].id);
  const [mode, setMode] = useState<Mode>("none");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return posts
      .filter((p) => (tab === "all" || p.status === tab) && (p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.tags.join(" ").toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, tab, query]);

  const selected = useMemo(() => posts.find((p) => p.id === selectedId) || filtered[0] || posts[0], [posts, selectedId, filtered]);

  const startCreate = () => setMode("create");
  const startEdit = () => setMode("edit");
  const cancel = () => setMode("none");

  const saveCreate = (draft: Draft) => {
    const id = Math.random().toString(36).slice(2, 8);
    const post: Post = {
      id,
      title: draft.title,
      author: draft.author || "Unknown",
      date: new Date().toISOString(),
      status: draft.status,
      tags: normalizeTags(draft.tags),
      content: draft.content,
    };
    setPosts((prev) => [post, ...prev]);
    setSelectedId(id);
    setMode("none");
  };

  const saveEdit = (draft: Draft) => {
    if (!selected) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === selected.id
          ? {
              ...p,
              title: draft.title,
              author: draft.author,
              status: draft.status,
              tags: normalizeTags(draft.tags),
              content: draft.content,
            }
          : p,
      ),
    );
    setMode("none");
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Family Blogs</h1>
              <p className="mt-1 text-muted-foreground">Write and share stories together. Create new posts, edit drafts, and browse published memories.</p>
            </div>
            <Input placeholder="Search title, author, or tag" value={query} onChange={(e) => setQuery(e.target.value)} className="sm:w-72 rounded-[10px]" />
          </div>

          <div className="mt-5">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <div className="grid gap-5 md:grid-cols-2 items-center">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                </TabsList>
                <div className="flex md:justify-end">
                  <Button onClick={startCreate} className="h-10 w-10 rounded-full p-0" aria-label="New Post" title="New Post">
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">New Post</span>
                  </Button>
                </div>
              </div>

              {(["all", "published", "draft"] as const).map((key) => (
                <TabsContent key={key} value={key}>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((p) => (
                      <PostCard key={p.id} post={p} active={selected?.id === p.id} onSelect={() => { setSelectedId(p.id); setMode("none"); }} />
                    ))}
                    {filtered.length === 0 ? (
                      <div className="col-span-full rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">No posts match.</div>
                    ) : null}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        <aside className="md:sticky md:top-20 h-max rounded-xl border bg-card p-5 shadow-sm">
          {mode === "create" ? (
            <div>
              <div className="text-sm text-muted-foreground">Create post</div>
              <PostForm initial={defaultDraft()} onCancel={cancel} onSave={saveCreate} />
            </div>
          ) : mode === "edit" && selected ? (
            <div>
              <div className="text-sm text-muted-foreground">Edit post</div>
              <PostForm initial={draftFromPost(selected)} onCancel={cancel} onSave={saveEdit} />
            </div>
          ) : selected ? (
            <div>
              <div className="text-sm text-muted-foreground">Selected post</div>
              <div className="mt-1 text-lg font-semibold">{selected.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">By {selected.author} • {fmtDate(selected.date)} • <Badge variant="secondary">{selected.status}</Badge></div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.tags.map((t) => (
                  <Badge key={t} variant="outline">#{t}</Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{selected.content}</p>
              <div className="mt-3"><Button size="sm" onClick={startEdit}>Modify Post</Button></div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Select a post to see details.</div>
          )}
        </aside>
      </div>
    </div>
  );
}

function PostCard({ post, active, onSelect }: { post: Post; active?: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={`text-left rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md ${active ? "ring-2 ring-primary/30" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold line-clamp-2">{post.title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">By {post.author} • {fmtDate(post.date)}</div>
        </div>
        <Badge variant={post.status === "published" ? "secondary" : "outline"}>{post.status}</Badge>
      </div>
      {post.tags.length ? (
        <div className="mt-2 flex flex-wrap gap-1 text-xs">
          {post.tags.map((t) => (
            <Badge key={t} variant="outline">#{t}</Badge>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{post.content}</p>
    </button>
  );
}

// Form

type Draft = { title: string; author: string; status: Post["status"]; tags: string; content: string };

function draftFromPost(p: Post): Draft {
  return { title: p.title, author: p.author, status: p.status, tags: p.tags.join(", "), content: p.content };
}

function defaultDraft(): Draft {
  return { title: "New Post", author: "", status: "draft", tags: "", content: "" };
}

function normalizeTags(s: string) { return s.split(/[,#]/).map((t) => t.trim()).filter(Boolean); }

function PostForm({ initial, onCancel, onSave }: { initial: Draft; onCancel: () => void; onSave: (d: Draft) => void }) {
  const [draft, setDraft] = useState<Draft>(initial);
  return (
    <div className="mt-2 grid gap-2">
      <label className="grid gap-1">
        <span className="text-xs text-muted-foreground">Title</span>
        <Input value={draft.title} onChange={(e)=>setDraft({ ...draft, title: e.target.value })} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1">
          <span className="text-xs text-muted-foreground">Author</span>
          <Input value={draft.author} onChange={(e)=>setDraft({ ...draft, author: e.target.value })} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-muted-foreground">Status</span>
          <select className="h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={draft.status} onChange={(e)=>setDraft({ ...draft, status: e.target.value as Draft["status"] })}>
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1">
        <span className="text-xs text-muted-foreground">Tags (comma or # separated)</span>
        <Input value={draft.tags} onChange={(e)=>setDraft({ ...draft, tags: e.target.value })} />
      </label>
      <label className="grid gap-1">
        <span className="text-xs text-muted-foreground">Content</span>
        <Textarea rows={6} value={draft.content} onChange={(e)=>setDraft({ ...draft, content: e.target.value })} />
      </label>
      <div className="mt-2 flex gap-2">
        <Button onClick={()=>onSave(draft)}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
