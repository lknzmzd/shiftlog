"use client";

type Props = {
  rows: any[];
};

export default function WarehouseResultTable({ rows }: Props) {
  if (!rows.length) {
    return <p className="muted">No parsed rows yet.</p>;
  }

  return (
    <div className="panel">
      <h2>Preview Rows</h2>
      <div className="warehouse-table-wrap">
        <table className="warehouse-table">
          <thead>
            <tr>
              <th>Device Type</th>
              <th>Device No</th>
              <th>Issue Type</th>
              <th>Quick</th>
              <th>Sub Type</th>
              <th>Issue</th>
              <th>Recovery</th>
              <th>Time</th>
              <th>Abnormal</th>
              <th>Warnings</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.rowKey || index}>
                <td>{row.deviceType}</td>
                <td>{row.deviceNo}</td>
                <td>{row.issueType}</td>
                <td>{row.quick}</td>
                <td>{row.subType}</td>
                <td>{row.issueDesc}</td>
                <td>{row.recovery}</td>
                <td>{row.startTime}</td>
                <td>{row.abnormal}</td>
                <td>{(row.warnings || []).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
