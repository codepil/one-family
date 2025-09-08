import FamilyTree from "@/components/FamilyTree";

export default function FamilyTreePage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Family Tree</h1>
        <p className="mt-3 text-muted-foreground">
          Expand branches to explore relatives. Click a person to toggle their descendants.
        </p>
      </div>
      <div className="mt-10">
        <FamilyTree />
      </div>
    </div>
  );
}
