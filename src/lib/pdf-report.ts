import "server-only";

export type CalibrationReportData = {
  companyName: string;
  reportNumber: string;
  assetCode: string;
  assetName: string;
  serialNumber?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  technician?: string | null;
  performedAt: string;
  dueAt?: string | null;
  result: "PASSED" | "FAILED" | "CONDITIONAL";
  certificateNumber?: string | null;
  notes?: string | null;
};

export function renderCalibrationReportHtml(data: CalibrationReportData) {
  const escape = (value: string | null | undefined) =>
    String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

  return `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>${escape(data.reportNumber)}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#111}h1{text-align:center}table{width:100%;border-collapse:collapse;margin-top:24px}td,th{border:1px solid #bbb;padding:10px;text-align:right}.result{font-weight:bold}.notes{margin-top:24px;min-height:100px;border:1px solid #bbb;padding:12px}</style></head><body><h1>${escape(data.companyName)}</h1><h2>گزارش کالیبراسیون</h2><table><tr><th>شماره گزارش</th><td>${escape(data.reportNumber)}</td><th>شماره گواهینامه</th><td>${escape(data.certificateNumber)}</td></tr><tr><th>کد تجهیز</th><td>${escape(data.assetCode)}</td><th>نام تجهیز</th><td>${escape(data.assetName)}</td></tr><tr><th>سازنده</th><td>${escape(data.manufacturer)}</td><th>مدل</th><td>${escape(data.model)}</td></tr><tr><th>سریال</th><td>${escape(data.serialNumber)}</td><th>کارشناس</th><td>${escape(data.technician)}</td></tr><tr><th>تاریخ انجام</th><td>${escape(data.performedAt)}</td><th>سررسید بعدی</th><td>${escape(data.dueAt)}</td></tr><tr><th>نتیجه</th><td class="result" colspan="3">${escape(data.result)}</td></tr></table><div class="notes"><strong>توضیحات:</strong><br>${escape(data.notes)}</div></body></html>`;
}
