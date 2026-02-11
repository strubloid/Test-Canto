import React, { useEffect } from "react";
import "./ErrorMessage.css";

type ErrorMessageProps = {
    message: string | null;
    onClose: () => void;
    duration?: number;
};

/**
 * Reusable error banner component that replaces native alert() calls.
 * Shows a dismissible error message that auto-hides after a configurable duration.
 * @param message The error text to display, or null to hide.
 * @param onClose Callback to clear the error in the parent's state.
 * @param duration Auto-dismiss time in ms (default 5000). Pass 0 to disable.
 */
const ErrorMessage = ({ message, onClose, duration = 5000 }: ErrorMessageProps) => {
    // Auto-hide the error message after the specified duration
    useEffect(() => {
        if (!message || duration === 0) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    return (
        <div className="error-message" role="alert">
            <span className="error-message-text">{message}</span>
            <button className="error-message-close" onClick={onClose} aria-label="Dismiss error">
                &times;
            </button>
        </div>
    );
};

export default ErrorMessage;
