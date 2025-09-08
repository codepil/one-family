import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Invite = { id: string; name: string; email?: string; status: "pending" | "accepted" | "declined" };

type Event = {
  id: string;
  title: string;
  start: string; // ISO date
  end: string; // ISO date
  location: string;
  description?: string;
  invites: Invite[];
};

function statusOf(ev: Event, now = new Date()): "upcoming" | "ongoing" | "past" {
  const s = new Date(ev.start).getTime();
  const e = new Date(ev.end).getTime();
  const n = now.getTime();
  if (n < s) return "upcoming";
  if (n > e) return "past";
  return "ongoing";
}

const SAMPLE_EVENTS: Event[] = [
  {
    id: "e1",
    title: "June Family Picnic",
    start: new Date(new Date().getFullYear(), 5, 14, 11, 0).toISOString(),
    end: new Date(new Date().getFullYear(), 5, 14, 15, 0).toISOString(),
    location: "Maple Park, Shelter 3",
    description: "Potluck picnic with games and group photo.",
    invites: [
      { id: "i1", name: "Alex", status: "accepted" },
      { id: "i2", name: "Taylor", status: "pending" },
      { id: "i3", name: "Casey", status: "accepted" },
    ],
  },
  {
    id: "e2",
    title: "Grandma's 80th Birthday",
    start: new Date(new Date().getFullYear(), 0, 10, 17, 0).toISOString(),
    end: new Date(new Date().getFullYear(), 0, 10, 20, 0).toISOString(),
    location: "Grandma's House",
    description: "Dinner, stories, and slideshow.",
    invites: [
      { id: "i4", name: "Maya", status: "accepted" },
      { id: "i5", name: "Evan", status: "accepted" },
      { id: "i6", name: "Riley", status: "declined" },
    ],
  },
  {
    id: "e3",
    title: "Holiday Dinner",
    start: new Date(new Date().getFullYear(), 11, 24, 18, 30).toISOString(),
    end: new Date(new Date().getFullYear(), 11, 24, 22, 0).toISOString(),
    location: "Jordan & Pat's",
    description: "Secret Santa and cookie exchange.",
    invites: [
      { id: "i7", name: "Pat", status: "accepted" },
      { id: "i8", name: "Jordan", status: "accepted" },
      { id: "i9", name: "Alex", status: "pending" },
    ],
  },
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);
  const [tab, setTab] = useState<"upcoming" | "ongoing" | "past" | "all">("upcoming");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(events[0].id);

  const filtered = useMemo(() => {
    const list = events.filter((ev) =>
      (tab === "all" || statusOf(ev) === tab) &&
      (ev.title.toLowerCase().includes(query.toLowerCase()) ||
        ev.location.toLowerCase().includes(query.toLowerCase()))
    );
    return list.sort((a,b)=> new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [events, tab, query]);

  const selected = useMemo(() => events.find((e) => e.id === selectedId) || filtered[0] || events[0], [events, selectedId, filtered]);

  const addInvite = (name: string, email?: string) => {
    if (!selected) return;
    const id = Math.random().toString(36).slice(2,8);
    setEvents((prev) => prev.map((ev) => ev.id === selected.id ? { ...ev, invites: [...ev.invites, { id, name, email, status: "pending" }] } : ev));
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Events</h1>
              <p className="mt-1 text-muted-foreground">Browse upcoming, ongoing, and past gatherings. Filter and manage invites.</p>
            </div>
            <Input placeholder="Search by title or location" value={query} onChange={(e)=>setQuery(e.target.value)} className="sm:w-72" />
          </div>

          <div className="mt-5">
            <Tabs value={tab} onValueChange={(v)=>setTab(v as any)}>
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              {["upcoming","ongoing","past","all"].map((key)=> (
                <TabsContent key={key} value={key}>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((ev)=> (
                      <EventCard key={ev.id} ev={ev} active={selected?.id===ev.id} onSelect={()=>setSelectedId(ev.id)} />
                    ))}
                    {filtered.length===0 ? (
                      <div className="col-span-full rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">No events match.</div>
                    ) : null}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        <aside className="md:sticky md:top-20 h-max rounded-xl border bg-card p-5 shadow-sm">
          {selected ? (
            <div>
              <div className="text-sm text-muted-foreground">Selected event</div>
              <div className="mt-1 text-lg font-semibold">{selected.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {fmtRange(selected.start, selected.end)} • {selected.location} • <Badge variant="secondary" className="ml-1">{statusOf(selected)}</Badge>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold">Invites</h4>
                <ul className="mt-2 space-y-2">
                  {selected.invites.map((i)=> (
                    <li key={i.id} className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm">
                      <span className="truncate">{i.name}{i.email ? <span className="text-muted-foreground"> • {i.email}</span> : null}</span>
                      <Badge variant={i.status === "accepted" ? "default" : i.status === "declined" ? "destructive" : "secondary"}>{i.status}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <InviteForm onAdd={addInvite} />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Select an event to manage invites.</div>
          )}
        </aside>
      </div>
    </div>
  );
}

function EventCard({ ev, active, onSelect }: { ev: Event; active?: boolean; onSelect: () => void }) {
  const accepted = ev.invites.filter((i)=>i.status==="accepted").length;
  const pending = ev.invites.filter((i)=>i.status==="pending").length;
  return (
    <button onClick={onSelect} className={`text-left rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md ${active ? "ring-2 ring-primary/30" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{ev.title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{fmtRange(ev.start, ev.end)} • {ev.location}</div>
        </div>
        <Badge variant="secondary">{statusOf(ev)}</Badge>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        <Badge variant="default">{accepted} going</Badge>
        <Badge variant="secondary">{pending} pending</Badge>
        <Badge variant="outline">{ev.invites.length} invited</Badge>
      </div>
      {ev.description ? <p className="mt-3 text-sm text-muted-foreground">{ev.description}</p> : null}
    </button>
  );
}

function InviteForm({ onAdd }: { onAdd: (name: string, email?: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), email.trim() || undefined);
    setName("");
    setEmail("");
  };

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold">Add invite</h4>
      <div className="mt-2 grid gap-2">
        <Input placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
        <Input placeholder="Email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Button onClick={submit}>Add Invite</Button>
      </div>
    </div>
  );
}

function fmtRange(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const sameDay = s.toDateString() === e.toDateString();
  const date = s.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const endDate = e.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const st = s.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const et = e.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return sameDay ? `${date} ${st} – ${et}` : `${date} ${st} – ${endDate} ${et}`;
}
