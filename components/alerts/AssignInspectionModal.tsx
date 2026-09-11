"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { WaterAlert } from "@/types/water";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

interface AssignInspectionModalProps {
  alert: WaterAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (alertId: string, officerName: string, dueDate: string) => void;
}

const PHED_OFFICERS = [
  "Er. Rajeev Sharma (Executive Engineer, PHED Central)",
  "Er. Priya Sundaram (Assistant Engineer, Quality Control Div)",
  "Er. Amitesh Mohanty (District Surveillance Lead)",
  "Er. Sunita Deshmukh (Sub-Divisional Water Inspector)",
  "Er. Harpreet Singh (Mobile Testing Unit Superintendent)",
];

export const AssignInspectionModal: React.FC<AssignInspectionModalProps> = ({
  alert,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedOfficer, setSelectedOfficer] = useState(PHED_OFFICERS[0]);
  const [dueDate, setDueDate] = useState("2026-09-13");
  const [priority, setPriority] = useState<"urgent" | "high" | "routine">("urgent");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!alert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(alert.id, selectedOfficer, dueDate);
      setIsSubmitting(false);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatch Field Inspection & Verification"
      description={`Official assignment for ${alert.sourceName} (${alert.sourceId})`}
      maxWidth="md"
    >
      {successNotice ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            Inspection Order Dispatched Successfully
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Dispatched to {selectedOfficer}. Notice sent to Field Water Testing Laboratory.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-rose-50 p-3 border border-rose-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-rose-800">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
              <span>Anomaly: {alert.title}</span>
            </div>
            <p className="mt-1 text-rose-700">
              Location: {alert.village}, {alert.district} • Recommended: {alert.recommendedAction}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Field Officer / Specialist
            </label>
            <div className="relative">
              <select
                value={selectedOfficer}
                onChange={(e) => setSelectedOfficer(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#0f2942] focus:ring-1 focus:ring-[#0f2942] focus:outline-none"
              >
                {PHED_OFFICERS.map((officer) => (
                  <option key={officer} value={officer}>
                    {officer}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Inspection Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#0f2942] focus:ring-1 focus:ring-[#0f2942] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Inspection Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "urgent" | "high" | "routine")}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#0f2942] focus:ring-1 focus:ring-[#0f2942] focus:outline-none"
              >
                <option value="urgent">Urgent (Within 24 Hours)</option>
                <option value="high">High (Within 48 Hours)</option>
                <option value="routine">Routine Verification (Within 5 Days)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Field Protocol / Directives (Optional)
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Collect triplicate laboratory samples for atomic absorption spectrometry and check borehole seal."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-[#0f2942] focus:ring-1 focus:ring-[#0f2942] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="bg-[#0f2942]"
            >
              {isSubmitting ? "Dispatching..." : "Confirm & Dispatch Order"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
