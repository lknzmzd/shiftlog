export type ReportTemplate = {
  id: string;
  title: string;
  template_text: string;
  usage_count: number;
  created_at: string;
};

export type Report = {
  id: string;
  workplace_id: string | null;
  template_id: string | null;
  device_no: string | null;
  issue_type: string | null;
  note: string | null;
  photo_url: string | null;
  final_text: string;
  created_at: string;
};

export type WorkDay = {
  id: string;
  workplace_id: string | null;
  work_date: string;
  hours_worked: number;
  note: string | null;
  created_at: string;
};

export type IncidentInput = {
  deviceNo?: string;
  deviceType?: string;
  issueText: string;
  shift?: string;
  createdBy?: string;
};

export type ParsedIncident = {
  deviceNo: string;
  deviceType: string;
  issueText: string;
  issueType: string;
  quickReason: string;
  shift: string;
  createdBy: string;
};