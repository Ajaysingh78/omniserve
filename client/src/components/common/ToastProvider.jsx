import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#16191f",
          color: "#e8eaf0",
          border: "1px solid #2a2d35",
          fontSize: "12.5px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#16191f",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#16191f",
          },
        },
      }}
    />
  );
}
