import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const location = useLocation();
  const nav = [
    { to: "/", label: "Home" },
    { to: "/blogs", label: "Blogs" },
    { to: "/events", label: "Events" },
    { to: "/family-tree", label: "Family Tree" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-rose-400" />
          <span className="font-extrabold tracking-tight text-xl">Kinfolk</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-foreground/90",
                  isActive || location.pathname === item.to
                    ? "text-foreground"
                    : "text-foreground/60",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            aria-label="Plan for Event"
          >
            <Link to="/events">Plan for Event</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex"
            aria-label="Join Family"
          >
            <Link to="/family-tree">Join Family</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
