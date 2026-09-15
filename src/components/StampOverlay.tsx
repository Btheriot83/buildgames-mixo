"use client";

import { motion, AnimatePresence } from "framer-motion";

/** Gamified "press stamp" delight on successful export / publish. */
export function StampOverlay({
  show,
  label = "PROOF PULLED",
}: {
  show: boolean;
  label?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="stamp-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="stamp-mark"
            initial={{ scale: 2.4, rotate: -18, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <span className="stamp-ring" />
            <strong>{label}</strong>
            <em>HOT METAL · EXPORT OK</em>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
