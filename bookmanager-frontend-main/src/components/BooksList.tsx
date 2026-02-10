import React, { useEffect, useId, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Book, deleteBook as deleteBookAction, updateBook as updateBookAction } from "../features/bookReducer";
import { deleteBook, updateBook } from "../api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CollapseIndicator from "./CollapseIndicator";
import "./BooksList.css";

// defining the type for avaiable values to be sorted in the book list.
type SortKey = "id" | "title" | "authorName" | "publishedDate";

/**
 * This will be responsible for displaying the list of books in the backend
 * we will be able to:
 * 1 - Display the list of books with their title, author and published date.
 * 2 - We will be able to sort the list of books by title, author and published date.
 * 3 - We will be able to filter the list of books by title, author and published date.
 * 4 - We will be able to search the list of books by title, author and published date.
 * 5 - We will be able to delete a book from the list of books.
 * 6 - We will be able to edit a book from the list of books.
 * @returns
 */
const BooksList = () => {
    // we get the list of books from the Redux store
    const dispatch = useDispatch();
    const books = useSelector((state: RootState) => state.books.books);
    const contentId = useId();
    const [isOpen, setIsOpen] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editAuthor, setEditAuthor] = useState("");
    const [editPublishedDate, setEditPublishedDate] = useState("");
    const filterId = useId();
    const [filterDate, setFilterDate] = useState("");

    // sort key and direction state
    const [sortKey, setSortKey] = useState<SortKey>("title");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    // pagination state
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // We are normalizing the date string to ensure we are comparing only the date part
    const normalizeDate = (value: string) => (value.length >= 10 ? value.substring(0, 10) : value);

    // we are converting the date to a date key format to be able to compare it with the filter date
    const toDateKey = (value: Date) => {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    /**
     * This will be responsible for getting all available dates from the list of books to be able to filter by them,
     * we are using useMemo to optimize the performance and avoid recalculating the available dates on every render,
     * it will only recalculate when the list of books changes.
     */
    const availableDates = React.useMemo(() => {
        // we will store here the unique dates
        const uniqueDates = new Set<string>();

        // we loop through the list of books and we normalize the published date to get only the date part and we add it to the set of unique dates
        books.forEach((book) => {
            const normalized = normalizeDate(book.publishedDate);
            if (normalized) {
                uniqueDates.add(normalized);
            }
        });

        // we are ensuring that we have the date with always time 00:00:00 to avoid any issue with the time part when we are comparing the dates in the filter
        return Array.from(uniqueDates, (dateKey) => new Date(`${dateKey}T00:00:00`));
    }, [books]);

    // This is the current selected filter date
    const selectedFilterDate = filterDate ? new Date(`${filterDate}T00:00:00`) : null;

    // We use the memory store for the filtering of the books
    const filteredBooks = React.useMemo<Book[]>(() => {
        // basic validation check
        if (!filterDate) {
            return books;
        }

        return books.filter((book) => normalizeDate(book.publishedDate) === filterDate);
    }, [books, filterDate]);

    // getting the range of books ad the current page
    const sortedBooks = React.useMemo<Book[]>(() => {
        // getting a copy of the books array
        const copy = [...filteredBooks];

        // sorting the copy of the books array based on the sort key and direction
        copy.sort((bookA, bookB) => {
            let result = 0;

            // checking for the sort key and sorting accordingly
            if (sortKey === "publishedDate") {
                const timeA = Date.parse(bookA.publishedDate);
                const timeB = Date.parse(bookB.publishedDate);
                result = timeA - timeB;
            } else if (sortKey === "id") {
                result = bookA.id - bookB.id;
            } else {
                const valueA = String(bookA[sortKey] ?? "");
                const valueB = String(bookB[sortKey] ?? "");

                // we use localeCompare to compare the string values for title and authorName
                result = valueA.localeCompare(valueB);
            }

            // we define the direction of the sort
            return sortDir === "asc" ? result : -result;
        });

        return copy;
    }, [filteredBooks, sortKey, sortDir]);

    // table configuration
    const totalPages = Math.max(1, Math.ceil(sortedBooks.length / pageSize));
    const startIndex = (page - 1) * pageSize;
    const pageBooks = sortedBooks.slice(startIndex, startIndex + pageSize);
    const showingFrom = sortedBooks.length === 0 ? 0 : startIndex + 1;
    const showingTo = Math.min(startIndex + pageSize, sortedBooks.length);

    /**
     * This will be responsible for resetting the page to 1 when we change the filter, sort key or sort direction,
     * to ensure that we are not on a page that is greater than the total pages after filtering or sorting.
     */
    useEffect(() => {
        setPage(1);
    }, [filterDate, sortKey, sortDir]);

    /**
     * This will be responsible for handling the case when we are changing the page and we are
     * on a page that is greater than the total pages,
     */
    useEffect(() => {
        // only update the page if the current page is greater than
        // the total of pages
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    /**
     * This will be responsible for resetting the edit state when we change the page, sort key or sort direction,
     * to ensure that we are not editing a book and then changing the page or sorting and we are still in the edit mode for a book
     * that is not visible anymore.
     */
    useEffect(() => {
        if (editingId !== null) {
            setEditingId(null);
            setEditTitle("");
            setEditAuthor("");
            setEditPublishedDate("");
        }
    }, [filterDate, page, sortKey, sortDir]);

    /**
     * This will be responsible for handling the sort action by
     * changing the sort key and the direction of the sort based on the current state.
     * @param key the key to sort by, it can be either title, authorName or publishedDate
     * @returns
     */
    const sortingBy = (key: SortKey) => {
        // if we are sorting by the same key, we change the direction of the sort
        if (key === sortKey) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
            return;
        }

        // otherwise, we set the new sort key and we set the direction to ascending
        setSortKey(key);
        setSortDir("asc");
    };

    /**
     * Visual indicator for the sort direction, just adding a simple arrow up
     * to show that we are sorting asc or desc based on the current sort key and direction.
     * @param key the key to check if we are sorting by it
     * @returns
     */
    const sortIndicator = (key: SortKey) => (key === sortKey ? (sortDir === "asc" ? " ^" : " v") : "");

    /**
     * This is to format in a better way the published date of the book,
     * as in the database contain a different order, here we make sure we show
     * in a more user friendly way.
     * @param value the date string to format
     * @returns a formatted date string or the original value if invalid
     */
    const formatDate = (value: string) => {
        let result: string;

        // checking if is empty or null
        if (!value) {
            result = "-";
            return result;
        }

        // parsing the date and checking if is valid to format it or just return the original
        const parsed = new Date(value);
        result = Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-GB");

        return result;
    };

    /**
     * This will do a basic formatting to the date string
     * to ensure that we are showing only the date part.
     * @param value the date string to format
     * @returns a formatted date string or the original value if invalid
     */
    const toInputDate = (value: string) => {
        // first validation if the value exists
        if (!value) {
            return "";
        }

        return value.length >= 10 ? value.substring(0, 10) : value;
    };

    /**
     * This will be responsible for handling the start of the edit action by setting the edit state with the book details
     * to be able to edit the book in the table row.
     * @param book the book to edit
     */
    const startEdit = (book: Book) => {
        // we set the edit state with the book details to be able to edit the book in the table row
        setEditingId(book.id);
        setEditTitle(book.title);
        setEditAuthor(book.authorName);

        // we use the toInputDate function to format the date string to show only the date part in the input field
        setEditPublishedDate(toInputDate(book.publishedDate));
    };

    /**
     * This will be responsible for handling the cancel action
     * of the edit by resetting the edit state to the default values.
     */
    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditAuthor("");
        setEditPublishedDate("");
    };

    /**
     * This will be responsible for handling the delete action by calling the backend to delete the book
     * and then dispatching the action to delete the book from the Redux store.
     * @param id the id of the book to delete
     */
    const deleteButtonAction = async (id: number) => {
        try {
            // calling the backend to delete the book
            await deleteBook(id);
            dispatch(deleteBookAction(id));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete book";
            alert(message);
        }
    };

    /**
     * This will be responsible for handling the save action of the edit by
     * calling the backend to update the book and then dispatching the action to update the book
     * in the Redux store.
     * @param id
     * @returns
     */
    const saveEdit = async (id: number) => {
        try {
            // basic validation to ensure we can update the book
            if (!editTitle || !editAuthor || !editPublishedDate) {
                alert("Please fill in all fields before saving.");
                return;
            }

            // updating the book
            const updatedBook = await updateBook({
                id,
                title: editTitle.trim(),
                authorName: editAuthor.trim(),
                publishedDate: editPublishedDate,
            });

            dispatch(updateBookAction(updatedBook));
            cancelEdit();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update book";
            alert(message);
        }
    };

    return (
        <section className="books">
            <div className="books-body">
                <div className="books-header">
                    <div className="books-header-main">
                        <button type="button" className="books-toggle" aria-expanded={isOpen} aria-controls={contentId} onClick={() => setIsOpen((prev) => !prev)}>
                            <span className="books-title">Books</span>
                            <CollapseIndicator isOpen={isOpen} />
                        </button>
                        <p className="books-subtitle">
                            Showing {showingFrom}-{showingTo} of {sortedBooks.length}
                        </p>
                    </div>
                    <div className="books-header-filter">
                        <div className="books-filters">
                            <label className="books-filter" htmlFor={filterId}>
                                <span className="books-filter-label">Filter by date</span>
                                <DatePicker
                                    id={filterId}
                                    className="books-filter-input"
                                    placeholderText="dd/mm/yyyy"
                                    dateFormat="dd/MM/yyyy"
                                    showPopperArrow={false}
                                    selected={selectedFilterDate}
                                    includeDates={availableDates}
                                    onChange={(date: Date | null) => setFilterDate(date ? toDateKey(date) : "")}
                                />
                            </label>
                            <button className="books-filter-clear" type="button" onClick={() => setFilterDate("")} disabled={!filterDate}>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                <div id={contentId} className={`books-collapse ${isOpen ? "is-open" : ""}`}>
                    <div className="books-collapse-inner">
                        <div className="books-table-wrap">
                            <table className="books-table">
                                <thead>
                                    <tr>
                                        <th scope="col" aria-sort={sortKey === "id" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                                            <button type="button" className="books-sort" onClick={() => sortingBy("id")}>
                                                ID{sortIndicator("id")}
                                            </button>
                                        </th>
                                        <th scope="col" aria-sort={sortKey === "title" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                                            <button type="button" className="books-sort" onClick={() => sortingBy("title")}>
                                                Title{sortIndicator("title")}
                                            </button>
                                        </th>
                                        <th scope="col" aria-sort={sortKey === "authorName" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                                            <button type="button" className="books-sort" onClick={() => sortingBy("authorName")}>
                                                Author{sortIndicator("authorName")}
                                            </button>
                                        </th>
                                        <th scope="col" aria-sort={sortKey === "publishedDate" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                                            <button type="button" className="books-sort" onClick={() => sortingBy("publishedDate")}>
                                                Published{sortIndicator("publishedDate")}
                                            </button>
                                        </th>
                                        <th scope="col" className="books-actions" aria-label="Book actions" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageBooks.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="books-empty">
                                                No books yet. Add your first one above.
                                            </td>
                                        </tr>
                                    ) : (
                                        pageBooks.map((book) => (
                                            <tr key={book.id}>
                                                <td>{book.id}</td>
                                                <td>
                                                    {editingId === book.id ? (
                                                        <input
                                                            className="books-inline-input"
                                                            type="text"
                                                            value={editTitle}
                                                            onChange={(event) => setEditTitle(event.target.value)}
                                                        />
                                                    ) : (
                                                        book.title
                                                    )}
                                                </td>
                                                <td>
                                                    {editingId === book.id ? (
                                                        <input
                                                            className="books-inline-input"
                                                            type="text"
                                                            value={editAuthor}
                                                            onChange={(event) => setEditAuthor(event.target.value)}
                                                        />
                                                    ) : (
                                                        book.authorName
                                                    )}
                                                </td>
                                                <td>
                                                    {editingId === book.id ? (
                                                        <input
                                                            className="books-inline-input"
                                                            type="date"
                                                            value={editPublishedDate}
                                                            onChange={(event) => setEditPublishedDate(event.target.value)}
                                                        />
                                                    ) : (
                                                        formatDate(book.publishedDate)
                                                    )}
                                                </td>
                                                <td className="books-actions">
                                                    <div className={`books-actions-buttons ${editingId === book.id ? "is-editing" : ""}`}>
                                                        {editingId === book.id ? (
                                                            <>
                                                                <button className="books-save" type="button" onClick={() => saveEdit(book.id)}>
                                                                    Save
                                                                </button>
                                                                <button className="books-cancel" type="button" onClick={cancelEdit}>
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button className="books-edit" type="button" onClick={() => startEdit(book)} disabled={editingId !== null}>
                                                                    Edit
                                                                </button>
                                                                <button className="books-delete" type="button" onClick={() => deleteButtonAction(book.id)}>
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <nav className="books-pagination" aria-label="Books pagination">
                                <button className="books-page" onClick={() => setPage(page - 1)} type="button" disabled={page === 1}>
                                    Prev
                                </button>
                                <div className="books-page-list">
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            className={`books-page ${pageNumber === page ? "is-active" : ""}`}
                                            onClick={() => setPage(pageNumber)}
                                            type="button"
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>
                                <button className="books-page" onClick={() => setPage(page + 1)} type="button" disabled={page === totalPages}>
                                    Next
                                </button>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BooksList;
