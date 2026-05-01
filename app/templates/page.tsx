import TemplateForm from "@/components/TemplateForm";
import TemplatePicker from "@/components/TemplatePicker";

export default function TemplatesPage() {
  return (
    <main className="page">
      <h1>Templates</h1>

      <section className="grid-section">
        <TemplateForm />
        <TemplatePicker />
      </section>
    </main>
  );
}