import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBooks } from "./features/bookReducer";
import BooksList from "./components/BooksList";
import AddBook from "./components/AddBook";
import ErrorMessage from "./components/ErrorMessage";
import { useError } from "./context/ErrorContext";
import { fetchBooks } from "./api/api";
import "./App.css";

const App: React.FC = () => {
    const dispatch = useDispatch();
    const { error, setError, clearError } = useError();

    useEffect(() => {
        const loadBooks = async () => {
            try {
                // loading the books from the backend
                const books = await fetchBooks();
                dispatch(setBooks(books));
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to load books";
                setError(message);
            }
        };

        loadBooks();
    }, [dispatch]);

    return (
        <div className="app-shell">
            <div className="app-center">
                <header className="app-hero">
                    <h1 className="app-title">Book Management</h1>
                    <p className="app-subtitle">Track, add, and sort your library in one place.</p>
                </header>

                <div className="app-content">
                    <ErrorMessage message={error} onClose={clearError} />
                    <AddBook />
                    <BooksList />
                </div>
            </div>
        </div>
    );
};

export default App;
