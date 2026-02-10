import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBooks } from "./features/bookReducer";
import BooksList from "./components/BooksList";
import AddBook from "./components/AddBook";
import { fetchBooks } from "./api/api";
import "./App.css";

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadBooks = async () => {
            try {
                // loading the books from the backend
                const books = await fetchBooks();
                dispatch(setBooks(books));
            } catch (error) {
                // TODO: Add error message ui
                console.error("Error loading books:", error);
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
                    <AddBook />
                    <BooksList />
                </div>
            </div>
        </div>
    );
};

export default App;
