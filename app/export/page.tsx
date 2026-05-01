export default function ExportPage() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Export</h1>

      <a
        href="/api/export/tsv"
        className="inline-block bg-black text-white px-5 py-3 rounded-lg"
      >
        Download TSV
      </a>
    </main>
  );
}