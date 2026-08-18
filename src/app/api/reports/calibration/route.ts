import { NextRequest, NextResponse } from "next/server";
import { renderCalibrationReportHtml } from "@/lib/pdf-report";
import { permissions } from "@/lib/rbac";
import { requirePermission } from "@/lib/auth/authorization";

export async function POST(request: NextRequest) {
  await requirePermission(permissions.calibrationView);
  const data = await request.json();
  const html = renderCalibrationReportHtml(data);
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8", "content-disposition": `inline; filename="${String(data.reportNumber || "calibration-report")}.html"` } });
}
