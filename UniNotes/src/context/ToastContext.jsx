import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Floating Toast Container */}
      <div style={{
        position: "fixed",
        top: "2rem",
        right: "2rem",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        width: "100%",
        maxWidth: "380px",
        pointerEvents: "none"
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: "auto",
              padding: "1rem 1.25rem",
              borderRadius: "14px",
              background: "rgba(17, 17, 20, 0.9)",
              backdropFilter: "blur(16px)",
              webkitBackdropFilter: "blur(16px)",
              border: `1px solid ${getBorderColor(toast.type)}`,
              boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px ${getGlowColor(toast.type)}`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Status bar */}
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              background: getThemeColor(toast.type)
            }} />

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingLeft: "4px" }}>
              <span style={{ fontSize: "1.2rem", display: "flex", alignItems: "center" }}>
                {getIcon(toast.type)}
              </span>
              <span style={{ lineHeight: 1.4 }}>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                color: "#a1a1aa",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "background 0.2s, color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#a1a1aa";
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Slide-in styles inline since we are pair programming */}
      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(40px) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// Helper colors
const getThemeColor = (type) => {
  switch (type) {
    case "success": return "#10b981"; // Emerald
    case "error": return "#ef4444"; // Red
    case "warning": return "#f59e0b"; // Amber
    case "info":
    default: return "#C1440E"; // Terracotta (Primary)
  }
};

const getBorderColor = (type) => {
  switch (type) {
    case "success": return "rgba(16, 185, 129, 0.4)";
    case "error": return "rgba(239, 68, 68, 0.4)";
    case "warning": return "rgba(245, 158, 11, 0.4)";
    case "info":
    default: return "rgba(193, 68, 14, 0.4)";
  }
};

const getGlowColor = (type) => {
  switch (type) {
    case "success": return "rgba(16, 185, 129, 0.15)";
    case "error": return "rgba(239, 68, 68, 0.15)";
    case "warning": return "rgba(245, 158, 11, 0.15)";
    case "info":
    default: return "rgba(193, 68, 14, 0.15)";
  }
};

const getIcon = (type) => {
  switch (type) {
    case "success": return "🟢";
    case "error": return "🔴";
    case "warning": return "🟡";
    case "info":
    default: return "✨";
  }
};
