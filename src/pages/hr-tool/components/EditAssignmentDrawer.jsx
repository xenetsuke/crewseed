import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import toast from "react-hot-toast";
import { updateAssignment } from "Services/AssignmentService";

const EditAssignmentDrawer = ({ open, onClose, assignment, onSaved ,}) => {
  const [form, setForm] = useState(null);

  /* ===============================
     LOAD EXISTING ASSIGNMENT
  =============================== */
  useEffect(() => {
    if (!assignment) return;

    setForm({
      id: assignment.id,
      // workerRole: assignment.workerRole || "",
      remarks: assignment.remarks || "",

      payroll: {
        basePay: assignment.payroll?.basePay ?? 0,
        dailyPay: assignment.payroll?.dailyPay ?? 0,
        overtimePay: assignment.payroll?.overtimePay ?? 0,
        bata: assignment.payroll?.bata ?? 0,
        pfDeduction: assignment.payroll?.pfDeduction ?? 0,
        esiDeduction: assignment.payroll?.esiDeduction ?? 0,
        advanceDeduction: assignment.payroll?.advanceDeduction ?? 0,
        grossPay: assignment.payroll?.grossPay ?? 0,
        totalDeductions: assignment.payroll?.totalDeductions ?? 0,
        netPayable: assignment.payroll?.netPayable ?? 0,
      },
    });
  }, [assignment]);

  if (!open || !form) return null;

  /* ===============================
     PAYROLL CHANGE HANDLER
  =============================== */
  const handlePayrollChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        [key]: value,
      },
    }));
  };

  /* ===============================
     SAVE (AssignmentDTO)
  =============================== */
  const handleSave = async () => {
    try {
      await updateAssignment(form);
      toast.success("Assignment updated successfully");
      onSaved?.();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update assignment");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="font-black text-lg">Edit Assignment</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* BASIC */}
          {/* <Input
            label="Worker Role"
            value={form.workerRole}
            onChange={(e) =>
              setForm({ ...form, workerRole: e.target.value })
            }
          /> */}

          <Input
            label="Remarks"
            value={form.remarks}
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
          />

          {/* PAYROLL */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-600">
              Payroll Details(Update will be reflected on next shift/day)
            </h3>

            <Input
              label="Base Pay"
              type="number"
              value={form.payroll.basePay}
              onChange={(e) =>
                handlePayrollChange("basePay", Number(e.target.value))
              }
            />

            <Input
              label="Daily Pay"
              type="number"
              value={form.payroll.dailyPay}
              onChange={(e) =>
                handlePayrollChange("dailyPay", Number(e.target.value))
              }
            />

            <Input
              label="Overtime Pay"
              type="number"
              value={form.payroll.overtimePay}
              onChange={(e) =>
                handlePayrollChange("overtimePay", Number(e.target.value))
              }
            />

            <Input
              label="Bata / Allowance"
              type="number"
              value={form.payroll.bata}
              onChange={(e) =>
                handlePayrollChange("bata", Number(e.target.value))
              }
            />

            <Input
              label="PF Deduction"
              type="number"
              value={form.payroll.pfDeduction}
              onChange={(e) =>
                handlePayrollChange("pfDeduction", Number(e.target.value))
              }
            />

            <Input
              label="ESI Deduction"
              type="number"
              value={form.payroll.esiDeduction}
              onChange={(e) =>
                handlePayrollChange("esiDeduction", Number(e.target.value))
              }
            />

            <Input
              label="Advance Deduction"
              type="number"
              value={form.payroll.advanceDeduction}
              onChange={(e) =>
                handlePayrollChange("advanceDeduction", Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditAssignmentDrawer;
