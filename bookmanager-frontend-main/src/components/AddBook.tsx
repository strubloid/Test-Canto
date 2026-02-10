import React, { useId, useState } from "react";
import { useDispatch } from "react-redux";
import { addBook } from "../features/bookReducer";
import { createBook } from "../api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CollapseIndicator from "./CollapseIndicator";
import "./AddBook.css";

const AddBook = () => {
    const dispatch = useDispatch();
    const contentId = useId();
    const [isOpen, setIsOpen] = useState(true);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publishedDate, setPublishedDate] = useState<Date | null>(null);

    /**
     * Validation function to ensure that all required
     * fields are filled before allowing the user to add a new book
     * at the store.
     * @returns True if is valid the fields, and false otherwise.
     */
    const addBookValidation = (): boolean => {
        let isValid: boolean = true;

        // we store here the missing fields
        let missingFields: string[] = [];

        // we check if is missing each required field
        if (!title) missingFields.push("Title");
        if (!author) missingFields.push("Author");
        if (!publishedDate) missingFields.push("Published Date");

        // checking the case of missing fields
        if (missingFields.length > 0) {
            isValid = false;
            throw new Error(`Please fill in the following fields: ${missingFields.join(", ")}`);
        }

        return isValid;
    };

    /**
     * This will be handing the action of adding a book to the backend
     * and then dispatching the action to add the book to the Redux store.
     * After adding the book, it will reset the input fields.
     */
    const handleAddBook = async () => {
        try {
            // basic validation to ensure we can be adding a new book with all the required fields
            addBookValidation();

            // converting the date to a string format that the backend can understand
            let publishedDateString: string = publishedDate!.toISOString();

            // creating a book object to ensure we are sending the correct data
            const book = {
                title,
                authorName: author,
                publishedDate: publishedDateString,
            };

            // calling the backend
            const newBook = await createBook(book);

            // updating the Redux store with the new book
            dispatch(addBook(newBook));

            // restarting the input fields
            setTitle("");
            setAuthor("");
            setPublishedDate(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to add book";
            alert(message);
        }
    };

    return (
        <section className="add-book">
            <div className="add-book-body">
                <div className="add-book-header">
                    <div>
                        <button type="button" className="add-book-toggle" aria-expanded={isOpen} aria-controls={contentId} onClick={() => setIsOpen((prev) => !prev)}>
                            <span className="add-book-title">Add Book</span>
                            <CollapseIndicator isOpen={isOpen} />
                        </button>
                        <p className="add-book-subtitle">Create a new entry for your library.</p>
                    </div>
                </div>

                <div id={contentId} className={`add-book-collapse ${isOpen ? "is-open" : ""}`}>
                    <div className="add-book-collapse-inner">
                        <div className="add-book-fields">
                            <div className="add-book-field">
                                <label className="add-book-label">Title</label>
                                <input className="add-book-input" type="text" placeholder="e.g. The Great Gatsby" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="add-book-field">
                                <label className="add-book-label">Author</label>
                                <input className="add-book-input" type="text" placeholder="e.g. F. Scott Fitzgerald" value={author} onChange={(e) => setAuthor(e.target.value)} />
                            </div>
                            <div className="add-book-field">
                                <label className="add-book-label">Published Date</label>
                                <DatePicker
                                    className="add-book-input"
                                    placeholderText="Select a date"
                                    selected={publishedDate}
                                    onChange={(date: Date | null) => setPublishedDate(date)}
                                />
                            </div>
                            <div className="add-book-field add-book-action">
                                <button className="add-book-button" onClick={handleAddBook}>
                                    Add Book
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AddBook;
