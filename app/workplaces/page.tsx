import WorkplaceForm from "@/components/WorkplaceForm";
import WorkplaceList from "@/components/WorkplaceList";

export default function WorkplacesPage() {
  return (
    <main className="page">
      <h1>Workplaces</h1>

      <section className="grid-section">
        <WorkplaceForm />
        <WorkplaceList />
      </section>
    </main>
  );
}