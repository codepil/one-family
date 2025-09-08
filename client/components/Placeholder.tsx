import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function Placeholder({
  title,
  description,
  actionHref,
  actionLabel,
}: Props) {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-muted-foreground">{description}</p>
        {actionHref && actionLabel ? (
          <Button asChild className="mt-6">
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
