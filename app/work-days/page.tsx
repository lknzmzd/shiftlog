import WorkDayForm from "@/components/WorkDayForm";
import WorkDayList from "@/components/WorkDayList";

export default function WorkDaysPage() {
  return (
    <main className="page">
      <h1>Work Days</h1>

      <section className="grid-section">
        <WorkDayForm />
        <WorkDayList />
      </section>
    </main>
  );
}