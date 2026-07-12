import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  trackOrderApi,
  requestQrAssistanceApi,
  getQrSessionBillApi,
  getQrSessionGuestsApi,
  leaveGuestSessionApi,
  createOrUpdateCartApi
} from "../../api/models/public.api";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import { useSocket } from "../../context/SocketContext";
import { 
  HiOutlineChevronLeft,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineQuestionMarkCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineArrowRightOnRectangle,
  HiOutlineExclamationCircle,
  HiOutlineSparkles
} from "react-icons/hi2";

export default function OrderTrackingPage() {
  const { outletSlug, orderId } = useParams();
  const navigate = useNavigate();
  const { lastMessage, connected } = useSocket();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core tracking states
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [etaMinutes, setEtaMinutes] = useState(20);

  // Billing and Diner Session states
  const [billSession, setBillSession] = useState(null);
  const [joinedGuests, setJoinedGuests] = useState([]);
  
  // Assistance requests states
  const [assistanceTasks, setAssistanceTasks] = useState([]);
  const [requestingAssist, setRequestingAssist] = useState(false);

  // Toast notifications
  const [notifications, setNotifications] = useState([]);

  // Leave Table confirmation
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const sessionToken = localStorage.getItem("sessionToken");
  const guestSessionToken = localStorage.getItem("guestSessionToken");
  const tableToken = localStorage.getItem("tableToken") || "";

  const fetchTrackingAndSession = async () => {
    try {
      // 1. Fetch Order Tracking
      const trackingRes = await trackOrderApi(orderId);
      const trackingData = trackingRes.data.data;
      setOrder(trackingData.order);
      setTimeline(trackingData.timeline);
      
      // Calculate derived ETA based on 20 mins mock prep window minus elapsed time
      const elapsed = Math.floor((Date.now() - new Date(trackingData.order.createdAt).getTime()) / 60000);
      setEtaMinutes(Math.max(1, 20 - elapsed));

      // 2. Fetch Session Billing & splits
      if (sessionToken) {
        const billRes = await getQrSessionBillApi(sessionToken);
        setBillSession(billRes.data.data.billSession);
      }

      // 3. Fetch Seated Guests
      if (sessionToken) {
        const guestsRes = await getQrSessionGuestsApi(sessionToken);
        setJoinedGuests(guestsRes.data.data || []);
      }

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tracking updates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingAndSession();
  }, [orderId, sessionToken]);

  // Live WebSocket updates
  useEffect(() => {
    if (lastMessage) {
      const { event, payload } = lastMessage;
      
      // 1. Order Status Updates
      if (event === "ORDER_STATUS_CHANGED" && payload._id === orderId) {
        addNotification(`Order status updated to ${payload.orderStatus}!`);
        fetchTrackingAndSession();
      }

      // 2. Waiter Task Updates
      if (event?.startsWith("WAITER_TASK_")) {
        const task = payload;
        if (task.sessionId === sessionToken) {
          // If task matches our table, update or append to list
          setAssistanceTasks(prev => {
            const idx = prev.findIndex(t => t._id === task._id);
            if (idx > -1) {
              const updated = [...prev];
              updated[idx] = task;
              return updated;
            }
            return [task, ...prev];
          });
          
          // Map action triggers to toast alerts
          if (event === "WAITER_TASK_ASSIGNED") {
            addNotification(`Waiter ${task.assignedToName || "Staff"} assigned to your request!`);
          } else if (event === "WAITER_TASK_COMPLETED") {
            addNotification(`Assistance request "${task.taskType}" completed!`);
          }
        }
      }

      // 3. Billing & Splits Updates
      if (event === "BILL_SETTLED" || event === "BILL_REQUESTED" || event === "BILL_SPLIT_CREATED") {
        addNotification(`Billing balances updated!`);
        fetchTrackingAndSession();
      }

      // 4. Session Guests Updates
      if (event === "SEAT_ADDED" || event === "SEAT_REMOVED" || event === "SESSION_CLOSED") {
        fetchTrackingAndSession();
      }
    }
  }, [lastMessage]);

  // Toast Notification Dispatcher
  const addNotification = (text) => {
    const newId = Date.now() + Math.random().toString(36).substring(2, 6);
    setNotifications(prev => [...prev, { id: newId, text }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newId));
    }, 4500);
  };

  // Submit Waiter Assistance
  const handleRequestAssistance = async (action) => {
    if (!tableToken) {
      alert("No active table token found. Please re-scan QR Code.");
      return;
    }
    setRequestingAssist(true);

    try {
      const activeGuest = joinedGuests.find(g => g.guestSessionToken === guestSessionToken);
      const res = await requestQrAssistanceApi({
        tableToken,
        action,
        seatNumber: activeGuest?.seatNumber || undefined
      });
      addNotification(`Requested assistance: "${action}"`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to call waiter");
    } finally {
      setRequestingAssist(false);
    }
  };

  // Reorder items: prepopulates cart and returns to menu
  const handleReorderItems = async () => {
    if (!order || !order.items) return;
    setLoading(true);
    try {
      const activeOutletId = localStorage.getItem("selectedOutletId");
      for (const item of order.items) {
        await createOrUpdateCartApi({
          sessionToken: guestSessionToken,
          outletId: activeOutletId,
          item: {
            menuItemId: item.menuItemId,
            variantId: item.variantId || undefined,
            quantity: item.quantity,
            addons: (item.addons || []).map(ad => ({ addonId: ad.addonId, quantity: ad.quantity }))
          }
        });
      }
      navigate(`/public/w/${outletSlug}/cart`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reorder items");
      setLoading(false);
    }
  };

  // Leave Table Session
  const handleConfirmLeaveTable = async () => {
    setShowLeaveConfirm(false);
    setLoading(true);
    try {
      await leaveGuestSessionApi();
      
      // Clean local storage tokens
      localStorage.removeItem("guestSessionToken");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("tableToken");

      // Redirect to landing
      navigate(`/public/w/${outletSlug}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave session");
      setLoading(false);
    }
  };

  const statusSteps = ["PENDING", "ACCEPTED", "PREPARING", "READY", "DELIVERED", "COMPLETED"];
  const currentStatus = order?.status || "PENDING";
  const currentStepIndex = statusSteps.indexOf(currentStatus);

  const getStepState = (stepName) => {
    const idx = statusSteps.indexOf(stepName);
    if (idx === -1) return "upcoming";
    if (idx < currentStepIndex) return "completed";
    if (idx === currentStepIndex) return "active";
    return "upcoming";
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900 guest-ordering">
        <Spinner size="lg" className="text-[#6311f4]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-zinc-950 p-6 text-center space-y-4 guest-ordering">
        <h2 className="text-xl font-black text-rose-500">Failed to Load Tracking</h2>
        <p className="text-zinc-500 text-xs max-w-xs">{error || "Something went wrong"}</p>
        <button
          onClick={() => navigate(`/public/w/${outletSlug}/menu`)}
          className="px-6 py-2.5 bg-[#6311f4] text-white font-bold rounded-xl text-xs uppercase"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  // Calculate bill balance splits
  const paidTotal = billSession?.splits?.reduce((sum, s) => sum + (s.isPaid ? s.amount : 0), 0) || 0;
  const grandTotal = (billSession?.subtotal || 0) + (billSession?.tax || 0) + 15;
  const remainingTotal = Math.max(0, grandTotal - paidTotal);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 flex flex-col guest-ordering pb-24 relative select-none">
      
      {/* Visual Toast Notification Overlays */}
      <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none space-y-2">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="mx-auto max-w-sm bg-zinc-900 border border-zinc-800 text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 animate-slide-up pointer-events-auto"
          >
            <HiOutlineBell className="w-5 h-5 text-[#9d57ff] shrink-0" />
            <span className="text-xs font-bold leading-normal">{notif.text}</span>
          </div>
        ))}
      </div>

      {/* Sticky top header */}
      <header className="bg-white border-b border-zinc-100/80 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link 
          to={`/public/w/${outletSlug}/menu`}
          className="w-9 h-9 bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-600 transition"
        >
          <HiOutlineChevronLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <h1 className="font-black text-[14px] text-zinc-900 tracking-tight">Live Tracking</h1>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Order #{order.orderNumber}</p>
        </div>
        <button
          onClick={() => setShowLeaveConfirm(true)}
          className="w-9 h-9 bg-zinc-50 border border-zinc-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-xl flex items-center justify-center text-zinc-500 transition cursor-pointer"
          title="Leave Table"
        >
          <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
        </button>
      </header>

      {/* Main progress and assist blocks */}
      <div className="flex-grow max-w-xl w-full mx-auto p-4 space-y-4">
        
        {/* Connection status notification */}
        {!connected && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3 flex items-center gap-2 text-rose-600 text-xs font-bold">
            <HiOutlineExclamationCircle className="w-5 h-5 shrink-0" />
            <span>Connection lost. Attempting to reconnect...</span>
          </div>
        )}

        {/* Live Countdown & Progress details */}
        <Card className="bg-white border border-zinc-100 p-5 rounded-3xl shadow-xs space-y-5 text-center">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Estimated Delivery</span>
            <h2 className="text-3xl font-black text-zinc-900 block">
              {currentStatus === "READY" ? "Ready for Serving" : currentStatus === "DELIVERED" || currentStatus === "COMPLETED" ? "Served" : `${etaMinutes} min`}
            </h2>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Dine-In Table Delivery</p>
          </div>

          {/* Animated Progress Timeline dots */}
          <div className="relative flex justify-between items-center max-w-sm mx-auto pt-4 pb-2">
            <div className="absolute top-[28px] left-0 right-0 h-0.5 bg-zinc-100 -z-10" />
            <div 
              className="absolute top-[28px] left-0 h-0.5 bg-[#6311f4] -z-10 transition-all duration-500" 
              style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%` }}
            />

            {statusSteps.map((step) => {
              const state = getStepState(step);
              return (
                <div key={step} className="flex flex-col items-center gap-1.5 z-10">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                    state === "completed" 
                      ? "bg-[#6311f4] border-[#6311f4] text-white" 
                      : state === "active" 
                        ? "bg-white border-[#6311f4] text-[#6311f4] animate-pulse" 
                        : "bg-white border-zinc-200 text-zinc-300"
                  }`}>
                    {state === "completed" ? "✓" : "●"}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-wider ${
                    state === "active" ? "text-[#6311f4]" : "text-zinc-400"
                  }`}>{step}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Waiter Assistance Action Panel */}
        <div className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-xs text-zinc-800 tracking-tight">Assistance Panel</h3>
            <p className="text-[9px] text-zinc-400">Request service assistance directly to your table.</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Need Water", label: "Need Water", icon: "💧" },
              { id: "Call Waiter", label: "Call Waiter", icon: "🙋‍♂️" },
              { id: "Need Spoon", label: "Need Spoon", icon: "🥄" },
              { id: "Need Tissue", label: "Need Tissue", icon: "🧻" },
              { id: "Need Bill", label: "Need Bill", icon: "💵" },
              { id: "Need Cleaning", label: "Need Cleaning", icon: "🧹" }
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => handleRequestAssistance(act.id)}
                disabled={requestingAssist}
                className="py-2.5 bg-zinc-50 border border-zinc-100 hover:border-zinc-200 rounded-xl transition flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span className="text-base">{act.icon}</span>
                <span className="text-[9px] font-black uppercase text-zinc-600 tracking-wider">{act.label}</span>
              </button>
            ))}
          </div>

          {/* Active Waiter Tasks logs */}
          {assistanceTasks.length > 0 && (
            <div className="border-t border-zinc-50 pt-3 space-y-2">
              <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Active Requests</h4>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {assistanceTasks.map((t) => (
                  <div key={t._id} className="flex justify-between items-center bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2 text-xs font-bold text-zinc-700">
                    <span>{t.taskType.replace("_", " ")}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      t.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600 animate-pulse"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Diner Session Members & Bill split balances */}
        {billSession && (
          <div className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-xs space-y-4">
            <div className="flex justify-between items-start border-b border-zinc-50 pb-2">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs text-zinc-800 tracking-tight">Table Session Members</h3>
                <p className="text-[9px] text-zinc-400">Manage billing split balances in real-time.</p>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-wider block">Remaining Balance</span>
                <span className="text-xs font-black text-[#6311f4]">₹{remainingTotal} / ₹{grandTotal}</span>
              </div>
            </div>

            {/* Seated Guests Grid */}
            <div className="grid grid-cols-2 gap-2">
              {joinedGuests.map((guest) => {
                const guestSplit = billSession.splits?.find(s => s.seatNumber === guest.seatNumber);
                const isHost = guest.role === "HOST";
                
                return (
                  <div 
                    key={guest.guestSessionToken}
                    className="bg-zinc-50 border border-zinc-100 rounded-xl p-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <HiOutlineUser className="w-4 h-4 text-[#6311f4] shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-xs text-zinc-900 leading-tight">
                          {guest.name} {isHost && <span className="text-[#6311f4] text-[8px] font-black font-mono">Host</span>}
                        </h4>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Seat {guest.seatNumber || "N/A"}</p>
                      </div>
                    </div>
                    {guestSplit && (
                      <div className="text-right">
                        <span className="text-[9px] font-black text-zinc-700 block">₹{guestSplit.amount}</span>
                        <span className={`text-[8px] font-black uppercase ${guestSplit.isPaid ? 'text-emerald-600' : 'text-amber-500'}`}>
                          {guestSplit.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Settle Bill redirect */}
            {remainingTotal > 0 && (
              <Link to={`/public/w/${outletSlug}/checkout`}>
                <button className="w-full mt-1 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-zinc-950/10">
                  Settle / Pay Bill Share →
                </button>
              </Link>
            )}
          </div>
        )}

      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 p-4 z-40 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handleReorderItems}
            className="flex-1 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <HiOutlineArrowPath className="w-4 h-4 text-[#6311f4]" />
            <span>Reorder Items</span>
          </button>
          
          <Link to={`/public/w/${outletSlug}/menu`} className="flex-1">
            <button className="w-full bg-[#6311f4] hover:bg-[#520dd4] text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-[#6311f4]/15 active:scale-97 transition-all">
              Add More Items
            </button>
          </Link>
        </div>
      </div>

      {/* Leave Table Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-zinc-100 shadow-2xl text-center space-y-5 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 text-2xl mx-auto">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-base text-zinc-950 tracking-tight">Leave Table?</h3>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mx-auto">
                Are you sure you want to leave this table session? You will lose access to active orders tracking and split details.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-700 font-black text-xs uppercase py-3 rounded-xl hover:bg-zinc-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeaveTable}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase py-3 rounded-xl transition shadow-lg shadow-rose-600/15"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
