import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios";
import toast from "react-hot-toast";

const plans = [
  {
    id: "FREE",
    name: "Free Tier",
    price: "₹0 /mo",
    features: ["1 Outlet", "Online Orders Catalog", "Basic Analytics"],
  },
  {
    id: "PRO",
    name: "Pro Plan",
    price: "₹1,999 /mo",
    features: [
      "Up to 5 Outlets",
      "Command Center & POS",
      "Inventory Alerts",
      "CRM Integration",
    ],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise Plan",
    price: "₹4,999 /mo",
    features: [
      "Unlimited Outlets",
      "Multi-brand Aggregator",
      "Dedicated Account Manager",
      "Custom WhatsApp Bot",
    ],
  },
];

export default function PlanManagement() {
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchActiveSubscription = async () => {
    try {
      const response = await axiosInstance.get("/subscriptions/current");
      if (response.data && response.data.data) {
        setActiveSub(response.data.data);
      } else {
        // Safe default active plan representation
        setActiveSub({
          plan: "FREE",
          status: "active",
          startDate: null,
          endDate: null,
          billingCycle: "monthly",
          autoRenew: false,
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No active subscription in database, default to Free plan representation
        setActiveSub({
          plan: "FREE",
          status: "active",
          startDate: null,
          endDate: null,
          billingCycle: "monthly",
          autoRenew: false,
        });
      } else {
        console.error("Failed to load active subscription status", error);
        toast.error("Failed to load subscription details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSubscription();
  }, []);

  const handleUpgradePlan = async (planId) => {
    try {
      const amount = planId === "PRO" ? 1999 : planId === "ENTERPRISE" ? 4999 : 0;
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const response = await axiosInstance.post("/subscriptions", {
        plan: planId,
        amount,
        startDate,
        endDate
      });

      toast.success(`Plan updated to ${planId} successfully!`);
      if (response.data && response.data.data) {
        setActiveSub(response.data.data);
      } else {
        fetchActiveSubscription();
      }
      setShowPlansModal(false);
    } catch (error) {
      console.error("Failed to upgrade subscription plan on server", error);
      toast.error(error.response?.data?.message || "Failed to upgrade plan.");
    }
  };

  const handleCancelSubscription = async () => {
    if (!activeSub || !activeSub._id) return;
    try {
      const response = await axiosInstance.patch(
        `/subscriptions/${activeSub._id}/cancel`
      );
      toast.success("Subscription cancelled successfully.");
      if (response.data && response.data.data) {
        setActiveSub(response.data.data);
      } else {
        fetchActiveSubscription();
      }
      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel subscription on server", error);
      toast.error(error.response?.data?.message || "Failed to cancel subscription.");
    }
  };

  if (loading) {
    return (
      <div style={{ color: "var(--text3)", textAlign: "center", padding: 40 }}>
        Loading Subscription Details...
      </div>
    );
  }

  const currentPlanDetails =
    plans.find((p) => p.id === activeSub?.plan) || plans[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        .sub-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
        .sub-grid { display: grid; grid-template-columns: 2fr 1.2fr; gap: 20px; }
        .feature-item { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text2); margin-top: 4px; }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">SaaS Subscription Plans</div>
            <div className="page-sub">
              Manage outlet billing cycles, upgrades, cancellations, and usage
              profiles.
            </div>
          </div>
        </div>
      </div>

      <div className="sub-grid">
        {/* Active plan status */}
        <div
          className="sub-card"
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--accent)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Current Active Plan
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--text)",
                  marginTop: 4,
                }}
              >
                {currentPlanDetails.name}
              </div>
              <div
                style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}
              >
                Cycle Price: {currentPlanDetails.price}
              </div>
            </div>

            <span
              className={`badge ${activeSub?.status === "active" ? "badge-green" : "badge-gray"}`}
            >
              {activeSub?.status?.toUpperCase()}
            </span>
          </div>

          <hr
            style={{ border: "none", borderTop: "1px solid var(--border)" }}
          />

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                Subscription Start
              </div>
              <div
                style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}
              >
                {activeSub?.startDate
                  ? new Date(activeSub.startDate).toLocaleDateString("en-IN")
                  : "N/A"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                Next Renewal / End Date
              </div>
              <div
                style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}
              >
                {activeSub?.endDate
                  ? new Date(activeSub.endDate).toLocaleDateString("en-IN")
                  : "N/A"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                Billing Frequency
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text2)",
                  marginTop: 2,
                  textTransform: "capitalize",
                }}
              >
                {activeSub?.billingCycle || "N/A"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                Payment Mode
              </div>
              <div
                style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}
              >
                Auto-Renew: {activeSub?.autoRenew ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button
              className="btn primary"
              onClick={() => setShowPlansModal(true)}
            >
              Upgrade / Change Plan
            </button>
            {activeSub?.status !== "cancelled" && (
              <button
                className="btn"
                style={{ borderColor: "var(--red)", color: "var(--red)" }}
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Included features */}
        <div
          className="sub-card"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div style={{ fontWeight: 700, fontSize: 14 }}>Features Included</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 6,
            }}
          >
            {currentPlanDetails.features.map((f, i) => (
              <div key={i} className="feature-item">
                <span style={{ color: "var(--green)" }}>✔</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrades Modal */}
      {showPlansModal && (
        <div className="pos-modal-overlay">
          <div className="pos-modal" style={{ width: 440 }}>
            <div className="pos-modal-header">
              <span>Choose Upgrade Plan</span>
              <button
                onClick={() => setShowPlansModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text3)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div className="pos-modal-body" style={{ gap: 14 }}>
              {plans.map((p) => {
                const isCurrent = p.id === activeSub?.planId;
                return (
                  <div
                    key={p.id}
                    style={{
                      background: "var(--bg3)",
                      border: isCurrent
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border)",
                      borderRadius: 8,
                      padding: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text3)",
                          marginTop: 2,
                        }}
                      >
                        {p.price}
                      </div>
                    </div>

                    <button
                      className={`btn${isCurrent ? "" : " primary"}`}
                      onClick={() => !isCurrent && handleUpgradePlan(p.id)}
                      disabled={isCurrent}
                      style={{ fontSize: 11, padding: "5px 10px" }}
                    >
                      {isCurrent ? "Active Plan" : "Upgrade"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="pos-modal-footer">
              <button className="btn" onClick={() => setShowPlansModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="pos-modal-overlay">
          <div className="pos-modal">
            <div className="pos-modal-header">
              <span>Cancel SaaS Plan</span>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text3)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div
              className="pos-modal-body"
              style={{ textAlign: "center", gap: 12 }}
            >
              <div
                style={{ fontSize: 14, fontWeight: 600, color: "var(--red)" }}
              >
                Are you absolutely sure?
              </div>
              <p
                style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}
              >
                Cancelling your subscription will revert your outlet counts back
                to the FREE limits at the end of the billing cycle.
              </p>
            </div>
            <div className="pos-modal-footer">
              <button className="btn" onClick={() => setShowCancelModal(false)}>
                Keep Subscription
              </button>
              <button
                className="btn"
                style={{
                  background: "var(--red)",
                  color: "#fff",
                  borderColor: "var(--red)",
                }}
                onClick={handleCancelSubscription}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
