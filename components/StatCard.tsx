export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="card">
      <p className="muted small">{label}</p>
      <h2>{value}</h2>
    </div>
  );
}