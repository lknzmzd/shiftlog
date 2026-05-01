"use client";

import { useEffect, useState } from "react";

type Workplace = {
  id: string;
  name: string;
  created_at: string;
};

export default function WorkplaceList() {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);

  function load() {
    fetch("/api/workplaces/list")
      .then((res) => res.json())
      .then((json) => setWorkplaces(json.data || []));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="panel">
      <h2>Saved Workplaces</h2>

      {workplaces.length === 0 && (
        <p className="muted">No workplaces yet.</p>
      )}

      <div className="report-list">
        {workplaces.map((workplace) => (
          <div key={workplace.id} className="report-card">
            <strong>{workplace.name}</strong>
            <p className="muted small">
              {new Date(workplace.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}