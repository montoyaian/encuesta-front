"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastVariant = "success" | "error";

type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
  isVisible: boolean;
};

type ToastContextValue = {
  notify: (message: string, variant?: ToastVariant) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

const EXIT_ANIMATION_MS = 260;
const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const closeToast = useCallback((id: string) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, isVisible: false } : toast)),
    );

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, EXIT_ANIMATION_MS);
  }, []);

  const notify = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage) {
        return;
      }

      const id = `toast-${Date.now()}-${idRef.current++}`;

      setToasts((current) => [
        ...current,
        {
          id,
          message: trimmedMessage,
          variant,
          isVisible: true,
        },
      ]);

      window.setTimeout(() => {
        closeToast(id);
      }, AUTO_DISMISS_MS);
    },
    [closeToast],
  );

  const notifySuccess = useCallback(
    (message: string) => {
      notify(message, "success");
    },
    [notify],
  );

  const notifyError = useCallback(
    (message: string) => {
      notify(message, "error");
    },
    [notify],
  );

  const value = useMemo(
    () => ({
      notify,
      notifySuccess,
      notifyError,
    }),
    [notify, notifySuccess, notifyError],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[min(94vw,30rem)] flex-col gap-3">
        {toasts.map((toast) => {
          const isError = toast.variant === "error";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-2xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                toast.isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              } ${
                isError
                  ? "border-red-200 bg-red-50/95 text-red-900"
                  : "border-emerald-200 bg-emerald-50/95 text-emerald-900"
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`mt-1 inline-block h-3 w-3 rounded-full ${
                    isError ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
                <p className="flex-1 text-base font-semibold leading-6">{toast.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }

  return context;
}
