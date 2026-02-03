import React, { useEffect, useState } from "react";
import { generatePayrollSlipHTML } from "./PayrollSlipPreview";

const PayrollSlipEditor = ({
  open,
  onClose,
  worker,
  payroll,
  viewMonth,
  viewYear,
}) => {
  const assignment = worker?.assignment || {};

  const monthYear = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(viewYear, viewMonth));

  /* =========================
     FORM STATE (AUTO-FILLED)
  ========================= */
  const [form, setForm] = useState({
    companyName: "",
    companyAddress: "",
    gst: "",
    pan: "",
    cin: "",
    managerName: "",
    siteName: "",
    employeeName: "",
    designation: "",
    basePay: 0,
    notes: "",
  });

  /* =========================
     AUTO-FILL FROM OLD DATA
  ========================= */
  useEffect(() => {
    if (!open) return;

    setForm({
      companyName: assignment?.companyName || "Company Name",
      companyAddress:
        assignment?.fullWorkAddress ||
        assignment?.locationName ||
        "",
      gst: assignment?.gstNumber || "",
      pan: assignment?.panNumber || "",
      cin: assignment?.cinNumber || "",
      managerName: assignment?.managerName || "Site Manager",
      siteName: assignment?.jobTitle || "Work Site",
      employeeName: worker?.name || "Worker",
      designation: worker?.role || "Worker",
      basePay: Number(payroll?.basePay || 0),
      notes: "",
    });
  }, [open, assignment, worker, payroll]);

  if (!open) return null;

  const update = (key, value) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* =========================
     PREVIEW + DOWNLOAD
  ========================= */
  const handlePreviewDownload = () => {
    const html = generatePayrollSlipHTML({
      company: {
        name: form.companyName,
        address: form.companyAddress,
        gst: form.gst,
        pan: form.pan,
        cin: form.cin,
        managerName: form.managerName,
        siteName: form.siteName,
        notes: form.notes,
      },
      employee: {
        name: form.employeeName,
        role: form.designation,
      },
      payroll,
      monthYear,
    });

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  /* =========================
     UI (COMPACT + SCROLLABLE)
  ========================= */
  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-3">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="px-5 py-4 border-b">
          <h2 className="text-base font-black text-slate-900">
            Payroll Slip Details
          </h2>
          <p className="text-[11px] text-slate-500">
            Review before download
          </p>
        </div>

        {/* BODY (SCROLL) */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-5">

          {/* COMPANY */}
          <Section title="Company">
            <Input label="Company Name" value={form.companyName} onChange={(v) => update("companyName", v)} />
            <Input label="Manager / Supervisor" value={form.managerName} onChange={(v) => update("managerName", v)} />
            <Input label="Work Site / Job" value={form.siteName} onChange={(v) => update("siteName", v)} />
            <Input label="Company Address" value={form.companyAddress} onChange={(v) => update("companyAddress", v)} />
            <Input label="GST Number" value={form.gst} onChange={(v) => update("gst", v)} />
            <Input label="PAN Number" value={form.pan} onChange={(v) => update("pan", v)} />
            <Input label="CIN (Optional)" value={form.cin} onChange={(v) => update("cin", v)} />
          </Section>

          {/* EMPLOYEE */}
          <Section title="Employee">
            <ReadOnly label="Employee Name" value={form.employeeName} />
            <Input label="Designation" value={form.designation} onChange={(v) => update("designation", v)} />
          </Section>

          {/* PAYROLL */}
          <Section title="Payroll">
            <ReadOnly label="Pay Period" value={monthYear} />
            <ReadOnly
              label="Base Pay (Monthly)"
              value={`₹${form.basePay.toLocaleString("en-IN")}`}
            />
          </Section>

          {/* NOTES */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Notes / Remarks
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-slate-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Optional remarks"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-1 mb-2 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-sm font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handlePreviewDownload}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black shadow"
          >
            Preview & Download
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   SMALL HELPERS
========================= */
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 gap-3">{children}</div>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
      {label}
    </label>
    <input
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ReadOnly = ({ label, value }) => (
  <div>
    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
      {label}
    </label>
    <div className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
      {value}
    </div>
  </div>
);

export default PayrollSlipEditor;
