import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AISummary from "@/components/AISummary";
import FamilyTree from "@/components/FamilyTree";

export default function Index() {
  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="container relative py-20 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                Private by default • Invite only
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">
                Your family's home for stories, events, and the family tree
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Write blog posts together, plan gatherings, share photos, and
                explore an interactive family tree. An AI assistant summarizes
                highlights automatically.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/events">Plan for Event</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/blogs">Start a Blog</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link to="/family-tree">Build Family Tree</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border bg-card p-4 shadow-xl">
                <div className="rounded-xl bg-gradient-to-br from-rose-200/40 via-primary/10 to-teal-200/40 p-6">
                  <div className="grid gap-6">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        AI Snapshot
                      </div>
                      <p className="mt-1 text-sm">
                        Reunion picnic planned for June 14. 18 RSVPs. New posts
                        from Alex and Taylor. 42 photos added to "Grandma 80th".
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { t: "Blogs", v: "268" },
                        { t: "Events", v: "32" },
                        { t: "Photos", v: "1.2k" },
                      ].map((m) => (
                        <div
                          key={m.t}
                          className="rounded-lg border bg-background p-3"
                        >
                          <div className="text-xs text-muted-foreground">
                            {m.t}
                          </div>
                          <div className="text-xl font-bold">{m.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border bg-background p-3">
                      <div className="text-xs text-muted-foreground">
                        Family Tree
                      </div>
                      <div className="mt-2 max-h-48 overflow-hidden">
                        <FamilyTree />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Member Blogs"
            desc="Any family member can write, tag, and share posts. Keep memories in one place."
            link="/blogs"
          />
          <FeatureCard
            title="Events & Groups"
            desc="Plan events, invite members, and create event groups to chat and share media."
            link="/events"
          />
          <FeatureCard
            title="AI Summaries"
            desc="Automatic highlights from posts and events. See what's new at a glance."
            link="#ai"
          />
        </div>
      </section>

      <section id="ai" className="container pb-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Smart summaries of family activity
            </h2>
            <p className="mt-2 text-muted-foreground">
              Paste recent posts or updates to preview how the AI summarizes
              highlights. Server-side integration can be added later.
            </p>
            <div className="mt-6">
              <AISummary />
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="font-semibold">Upcoming Events</h3>
            <div className="mt-4 grid gap-4">
              {[
                {
                  title: "June Picnic",
                  date: "Sat, Jun 14",
                  where: "Maple Park",
                  attendees: 18,
                },
                {
                  title: "Holiday Dinner",
                  date: "Dec 24",
                  where: "Grandma's House",
                  attendees: 26,
                },
              ].map((e) => (
                <div
                  key={e.title}
                  className="rounded-xl border bg-background p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{e.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.date} • {e.where}
                      </div>
                    </div>
                    <div className="text-xs rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      {e.attendees} going
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild className="mt-6 w-full">
              <Link to="/events">Open Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  link,
}: {
  title: string;
  desc: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className="group rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="size-10 rounded-md bg-gradient-to-br from-primary to-rose-400" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4 text-sm font-medium text-primary">Explore →</div>
    </Link>
  );
}
