import React, { useState } from "react";
import { X, UserPlus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAssignmentsByJob,
  addWorkerToJob,
  removeWorkerFromJob,
} from "../../../Services/AssignmentService";
import CreateWorkerModel from "./CreateWorkerModel"; 
import { cn } from "utils/cn";

const ManageWorkersDrawer = ({ open, jobId, employerId, onClose }) => {
  const queryClient = useQueryClient();
  const [showCreateWorker, setShowCreateWorker] = useState(false);

  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments", jobId],
    queryFn: () => getAssignmentsByJob(jobId),
    enabled: !!jobId && open,
  });

  const handleRemoveWorker = async (assignmentId) => {
    if (!window.confirm("Remove worker from this job?")) return;
    try {
      await removeWorkerFromJob(assignmentId);
      queryClient.invalidateQueries(["assignments", jobId]);
    } catch (error) {
      console.error("Failed to remove worker:", error);
      alert("Could not remove worker. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop: Higher than sidebar/header */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150]"
        onClick={onClose}
      />

      {/* Drawer: Highest primary level */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[160] shadow-2xl flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg text-slate-900">Manage Workers</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Job ID: {jobId}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Add Worker to Job
            </label>
            <button
              onClick={() => setShowCreateWorker(true)}
              className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-8 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="p-3 bg-slate-50 rounded-full group-hover:bg-indigo-100 transition-colors">
                <UserPlus className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm">Create & Assign Worker</span>
            </button>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
              Currently Assigned ({assignments.length})
            </h3>

            {assignments.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase">No workers assigned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between border border-slate-100 bg-white rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {a.workerName?.charAt(0) || "W"}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{a.workerName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {a.workerRole || "General Labor"}
                        </p>
                      </div>
                    </div>
                   <button
  onClick={() => handleRemoveWorker(a.id)} // ✅ FIXED
  className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg"
>
  <Trash2 className="w-4 h-4" />
</button>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Must be higher than the drawer (z-200+) */}
      {showCreateWorker && (
        <div className="fixed inset-0 z-[200]">
           <CreateWorkerModel
            onClose={() => setShowCreateWorker(false)}
            onCreated={async (newWorkerId) => {
              try {
                await addWorkerToJob({
                  jobId,
                  employerId,
                  workerId: newWorkerId,
                  startDate: new Date().toISOString(),
                });
                queryClient.invalidateQueries(["assignments", jobId]);
                setShowCreateWorker(false);
              } catch (error) {
                console.error("Auto-assign failed:", error);
                alert("Worker created, but failed to auto-assign.");
                setShowCreateWorker(false);
              }
            }}
          />
        </div>
      )}
    </>
  );
};

export default ManageWorkersDrawer;