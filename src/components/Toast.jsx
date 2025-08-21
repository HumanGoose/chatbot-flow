import React, { useEffect, useState } from 'react';
import './components.css';

export default function Toast({ open, message, variant = 'info', onClose, duration = 2500 }) {
  const [render, setRender] = useState(open);
  const [exiting, setExiting] = useState(false);

  // Auto-dismiss timer when open
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  // Manage mount/unmount for exit animation
  useEffect(() => {
    if (open) {
      setRender(true);
      setExiting(false);
      return;
    }
    if (render) {
      setExiting(true);
      const id = setTimeout(() => {
        setRender(false);
        setExiting(false);
      }, 180);
      return () => clearTimeout(id);
    }
  }, [open, render]);

  if (!render) return null;

  return (
    <div className={`toast toast--${variant} ${exiting ? 'toast-exit' : ''}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}


