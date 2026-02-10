import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook, Book } from "../features/bookReducer";
import { createBook } from "../api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddBook = () => {
    const dispatch = useDispatch();
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
        <div className="card add-book-card border-0">
            <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-2 mb-3">
                    <div>
                        <h2 className="h4 mb-1">Add Book</h2>
                        <p className="text-muted mb-0">Create a new entry for your library.</p>
                    </div>
                </div>

                <div className="add-book-fields">
                    <div className="add-book-field">
                        <label className="form-label">Title</label>
                        <input className="form-control" type="text" placeholder="e.g. The Great Gatsby" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="add-book-field">
                        <label className="form-label">Author</label>
                        <input className="form-control" type="text" placeholder="e.g. F. Scott Fitzgerald" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    </div>
                    <div className="add-book-field">
                        <label className="form-label">Published Date</label>
                        <DatePicker className="form-control" placeholderText="Select a date" selected={publishedDate} onChange={(date: Date | null) => setPublishedDate(date)} />
                    </div>
                    <div className="add-book-field d-flex align-items-end">
                        <button className="btn btn-primary w-100" onClick={handleAddBook}>
                            Add Book
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
