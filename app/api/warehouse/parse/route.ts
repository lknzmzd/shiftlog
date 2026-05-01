import { NextResponse } from "next/server";
import { buildPreviewRecords } from "@/lib/warehouse/inputParser";
import { validateRawText, finalizePreviewRows, getValidationStats } from "@/lib/warehouse/validator";
import { previewRowsToTSV } from "@/lib/warehouse/exporter";
import { DEFAULTS } from "@/lib/warehouse/utils";

const identityCorrectionEngine = {
  applyManualOverrideToRow(row: any) {
    return row;
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rawText = String(body.rawText || body.text || "");
    const date = String(body.date || new Date().toISOString().slice(0, 10).replaceAll("-", "/"));
    const fallbackDeviceType = String(body.fallbackDeviceType || DEFAULTS.deviceType);
    const status = String(body.status || DEFAULTS.status);
    const tempMeasuresDefault = String(body.tempMeasuresDefault || DEFAULTS.recovery);
    const defaultMin = Number(body.defaultMin || DEFAULTS.minutes);

    const rawValidation = validateRawText(rawText);

    const rows = await buildPreviewRecords({
      rawText,
      date,
      fallbackDeviceType,
      status,
      tempMeasuresDefault,
      defaultMin,
      correctionEngine: identityCorrectionEngine,
    });

    const finalizedRows = finalizePreviewRows(rows);
    const stats = getValidationStats(finalizedRows);
    const tsv = previewRowsToTSV(finalizedRows, date).join("\n");

    return NextResponse.json({
      success: true,
      data: {
        rows: finalizedRows,
        tsv,
        rawValidation,
        stats,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Warehouse parse failed" },
      { status: 500 }
    );
  }
}
