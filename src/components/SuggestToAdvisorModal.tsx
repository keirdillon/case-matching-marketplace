"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";

interface SuggestToAdvisorModalProps {
  open: boolean;
  caseId: string;
  managerId: string;
  onClose: () => void;
}

interface AdvisorOption {
  id: string;
  full_name: string;
  region: string;
  role: string;
}

export function SuggestToAdvisorModal({ open, caseId, managerId, onClose }: SuggestToAdvisorModalProps) {
  const [advisors, setAdvisors] = useState<AdvisorOption[]>([]);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    async function loadAdvisors() {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data } = await supabase
        .from("advisors")
        .select("id, full_name, region, role")
        .in("role", ["senior", "mid"])
        .eq("availability_status", "active")
        .order("full_name");
      setAdvisors((data as AdvisorOption[]) || []);
    }
    loadAdvisors();
  }, [open]);

  async function handleSubmit() {
    if (!selectedAdvisorId) return;
    setSubmitting(true);
    const supabase = getSupabase();
    if (!supabase) { setSubmitting(false); return; }

    const { error } = await supabase.from("manager_assignments").insert({
      manager_id: managerId,
      case_id: caseId,
      assigned_advisor_id: selectedAdvisorId,
      message: message || null,
      status: "pending",
    });

    if (error) {
      alert("Failed to suggest: " + error.message);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedAdvisorId("");
      setMessage("");
      onClose();
    }, 1500);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center"
      style={{ background: "rgba(37,47,74,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: "440px", maxWidth: "95vw", background: "var(--white)", boxShadow: "var(--shadow-xl)" }}>
        <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--gray-200)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--coastal-900)", fontWeight: 400 }}>
            Suggest to Advisor
          </h3>
        </div>

        <div style={{ padding: "var(--space-6)" }}>
          {success ? (
            <div className="flex flex-col items-center" style={{ padding: "var(--space-5)", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", background: "var(--success)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-4)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: "15px", color: "var(--coastal-900)", fontWeight: 500 }}>
                Suggestion sent!
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "var(--space-5)" }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: "12px", fontWeight: 500, color: "var(--coastal-900)", display: "block", marginBottom: "var(--space-2)" }}>
                  Select Advisor<span style={{ color: "var(--error)" }}>*</span>
                </label>
                <select
                  value={selectedAdvisorId}
                  onChange={(e) => setSelectedAdvisorId(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px",
                    fontFamily: "var(--font-ui)", fontSize: "14px",
                    color: "var(--coastal-900)",
                    border: "1px solid var(--gray-200)", background: "var(--white)", outline: "none",
                  }}
                >
                  <option value="">Choose an advisor...</option>
                  {advisors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.full_name} ({a.region})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "var(--space-5)" }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: "12px", fontWeight: 500, color: "var(--coastal-900)", display: "block", marginBottom: "var(--space-2)" }}>
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hey, I think this is good for you. Want it?"
                  maxLength={300}
                  style={{
                    width: "100%", padding: "12px 14px",
                    fontFamily: "var(--font-ui)", fontSize: "14px",
                    color: "var(--coastal-900)",
                    border: "1px solid var(--gray-200)", background: "var(--white)",
                    outline: "none", resize: "vertical", minHeight: "80px",
                  }}
                />
              </div>
            </>
          )}
        </div>

        {!success && (
          <div className="flex justify-end" style={{ padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--gray-200)", gap: "var(--space-3)" }}>
            <button onClick={onClose} className="btn btn-outline btn-sm">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !selectedAdvisorId}
              className="btn btn-primary btn-sm"
              style={{ opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? "Sending..." : "Send Suggestion"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
