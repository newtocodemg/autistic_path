import { useEffect, ReactNode } from "react";
import { X, AlertTriangle, Info, AlertOctagon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BottomSheetProps, ConfirmationDialogProps, DrawerProps } from "../types";
import { Button } from "./Button";

// Escape Key listener hook
function useEscapeKey(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
}

// 1. ConfirmationDialog Component
export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
}: ConfirmationDialogProps) {
  useEscapeKey(isOpen, onClose);

  // Styling helpers
  const iconConfig = {
    info: {
      color: "text-brand-primary bg-brand-primary-soft",
      icon: <Info className="h-6 w-6 stroke-[2.5px]" />,
    },
    warning: {
      color: "text-amber-600 bg-amber-50",
      icon: <AlertTriangle className="h-6 w-6" />,
    },
    danger: {
      color: "text-red-600 bg-red-50",
      icon: <AlertOctagon className="h-6 w-6" />,
    },
  };

  const { color, icon } = iconConfig[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur and Dark Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/30 backdrop-blur-xs"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative bg-white w-full max-w-md rounded-premium p-6 shadow-premium-lg border border-brand-border z-10 flex flex-col font-sans"
          >
            {/* Header with Icon */}
            <div className="flex gap-4 items-start mb-4">
              <div className={`h-12 w-12 rounded-premium flex items-center justify-center shrink-0 ${color}`}>
                {icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold font-display text-gray-900 leading-snug">{title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-sans">{message}</p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-3.5 mt-6 ml-auto w-full justify-end">
              <Button variant="outline" size="sm" onClick={onClose} className="px-5">
                {cancelText}
              </Button>
              <Button
                variant={type === "danger" ? "primary" : type === "warning" ? "primary" : "primary"}
                size="sm"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={type === "danger" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 2. BottomSheet Component
export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEscapeKey(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop Blur and Dark Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/25 backdrop-blur-xs"
          />

          {/* Sheet Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative bg-white w-full max-w-2xl rounded-t-premium-lg shadow-premium-lg border-t border-brand-border z-10 font-sans max-h-[85vh] flex flex-col"
          >
            {/* Top Handle bar (typical iOS visual slider anchor) */}
            <div className="flex justify-center py-3 cursor-pointer" onClick={onClose}>
              <div className="h-1 w-12 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors" />
            </div>

            {/* Title / Header */}
            {title && (
              <div className="px-6 pb-4 border-b border-gray-50 flex justify-between items-center">
                <h4 className="text-lg font-bold font-display text-gray-800">{title}</h4>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 smooth-transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Interactive Scrollable Body content */}
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 3. Side Drawer Component
export function Drawer({ isOpen, onClose, position = "right", title, children }: DrawerProps) {
  useEscapeKey(isOpen, onClose);

  const isLeft = position === "left";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur and Dark Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/25 backdrop-blur-xs"
          />

          {/* Drawer Body Panel */}
          <motion.div
            initial={{ x: isLeft ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isLeft ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative bg-white w-full max-w-md h-full shadow-premium-lg border-y z-10 font-sans flex flex-col ${
              isLeft ? "left-0 mr-auto border-r" : "right-0 ml-auto border-l"
            } border-brand-border`}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h4 className="text-lg font-bold font-display text-gray-800">
                {title || "Options Panel"}
              </h4>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 smooth-transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
