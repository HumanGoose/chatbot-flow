import React, { useEffect } from 'react';
import './components.css';

export default function Modal({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  variant = 'primary',
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {title ? <div className="modal-header">{title}</div> : null}
        <div className="modal-body">{message}</div>
        <div className="modal-actions">
          {onConfirm ? (
            <>
              <button type="button" className="modal-button modal-button--secondary" onClick={onClose}>
                {cancelText}
              </button>
              <button
                type="button"
                className={`modal-button ${
                  variant === 'danger' ? 'modal-button--danger' : 'modal-button--primary'
                }`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button type="button" className="modal-button modal-button--primary" onClick={onClose}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


