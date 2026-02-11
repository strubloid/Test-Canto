import React, { createContext, useCallback, useContext, useState } from "react";

// Defining the shape of our error context
type ErrorContextType = {
    error: string | null;
    setError: (message: string) => void;
    clearError: () => void;
};

// Creating the context with a default value of null
const ErrorContext = createContext<ErrorContextType | null>(null);

/**
 * Provides a centralized error state that any child component can push errors to.
 * Render <ErrorMessage /> once in the tree to display them.
 */
export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [error, setErrorState] = useState<string | null>(null);
    const setError = useCallback((message: string) => setErrorState(message), []);
    const clearError = useCallback(() => setErrorState(null), []);

    return <ErrorContext.Provider value={{ error, setError, clearError }}>{children}</ErrorContext.Provider>;
};

/**
 * Hook to access the centralized error state from any component.
 * Returns { error, setError, clearError }.
 */
export const useError = (): ErrorContextType => {
    const ctx = useContext(ErrorContext);
    if (!ctx) throw new Error("useError must be used within <ErrorProvider>");
    return ctx;
};
