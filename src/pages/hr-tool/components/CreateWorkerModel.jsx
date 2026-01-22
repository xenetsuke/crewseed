import React, { useState } from "react";
import { X } from "lucide-react";
import { createWorker } from "../../../Services/customWorker.service";

const CreateWorkerModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    fullName: "",
    primaryJobRole: "",
    phoneNumber: "",
  });

  const handleSubmit = async () => {
    const workerId = await createWorker(form);
    onCreated(workerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-in zoom-in-95">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-black text-lg text-slate-900">Add Worker</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Full Name
            </label>
            <input
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter worker name"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Job Role
            </label>
            <input
              value={form.primaryJobRole}
              onChange={(e) =>
                setForm({ ...form, primaryJobRole: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Electrician, Helper, Plumber..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="10-digit mobile number"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-colors"
          >
            Create Worker
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkerModal;
