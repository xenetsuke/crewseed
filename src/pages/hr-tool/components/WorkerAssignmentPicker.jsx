import React, { useState } from "react";
import { UserPlus, Plus } from "lucide-react";
import { cn } from "utils/cn";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllProfiles } from "../../../Services/ProfileService";
import CreateWorkerModal from "./CreateWorkerModel";
// import CreateWorkerModal from "./CreateWorkerModal";
// CreateWorkerModal
const WorkerAssignmentPicker = ({ data, setData }) => {
  const queryClient = useQueryClient();

  /* ================= SAFETY GUARDS ================= */
  const selectedWorkerIds = Array.isArray(data?.workerIds)
    ? data.workerIds
    : [];

  /* ================= MODAL STATE ================= */
  const [showCreateWorker, setShowCreateWorker] = useState(false);

  /* ================= FETCH WORKERS ================= */
  const {
    data: workers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allWorkers"],
    queryFn: getAllProfiles,
  });

  /* ================= TOGGLE WORKER ================= */
  const toggleWorker = (workerId) => {
    setData((prev) => ({
      ...prev,
      workerIds: prev.workerIds.includes(workerId)
        ? prev.workerIds.filter((id) => id !== workerId)
        : [...prev.workerIds, workerId],
    }));
  };

  /* ================= UI ================= */
  return (
    <div className="bg-white rounded-2xl border p-5 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
          Assign Workers
        </h3>

        <button
          type="button"
          onClick={() => setShowCreateWorker(true)}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Create Worker
        </button>
      </div>

      {/* STATES */}
      {isLoading && (
        <p className="text-sm text-slate-400">Loading workers…</p>
      )}

      {isError && (
        <p className="text-sm text-rose-500">
          Failed to load workers
        </p>
      )}

      {!isLoading && workers.length === 0 && (
        <p className="text-sm text-slate-400">
          No workers available
        </p>
      )}

      {/* WORKER GRID */}
      {!isLoading && workers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {workers.map((worker) => {
            const isSelected = selectedWorkerIds.includes(worker.id);

            return (
              <button
                key={worker.id}
                type="button"
                onClick={() => toggleWorker(worker.id)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all",
                  isSelected
                    ? "bg-indigo-50 border-indigo-400"
                    : "bg-white border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="text-left">
                  <p className="font-bold text-sm text-slate-900">
                    {worker.fullName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {worker.primaryJobRole || "Worker"}
                  </p>
                </div>

                <UserPlus
                  className={cn(
                    "w-5 h-5",
                    isSelected ? "text-indigo-600" : "text-slate-300"
                  )}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* CREATE WORKER MODAL */}
      {showCreateWorker && (
        <CreateWorkerModal
          onClose={() => setShowCreateWorker(false)}
          onCreated={(newWorkerId) => {
            // 1️⃣ Auto-select newly created worker
            setData((prev) => ({
              ...prev,
              workerIds: [...prev.workerIds, newWorkerId],
            }));

            // 2️⃣ Refresh worker list
            queryClient.invalidateQueries(["allWorkers"]);

            // 3️⃣ Close modal
            setShowCreateWorker(false);
          }}
        />
      )}
    </div>
  );
};

export default WorkerAssignmentPicker;
